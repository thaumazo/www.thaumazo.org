#!/usr/bin/env node
/* eslint-disable no-console */
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createId } from "@paralleldrive/cuid2";
import { config as dotenvConfig } from "dotenv";
import matter from "gray-matter";
import kebabCase from "lodash-es/kebabCase.js";
import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import sharp from "sharp";

const root = process.cwd();
dotenvConfig({ path: path.join(root, ".env.local"), quiet: true });
dotenvConfig({ quiet: true });

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const only = process.argv.find((arg) => arg.startsWith("--only="))?.slice(7);

const connectionString =
  process.env.DATABASE_POOL_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_POOL_URL or DATABASE_URL must be set.");
}

const region = process.env.AWS_S3_REGION ?? process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;
const s3 = new S3Client({
  requestChecksumCalculation: "WHEN_REQUIRED",
  region,
});
const sql = postgres(connectionString, { prepare: false, max: 1 });
const dryRunRows = new Map();
let dryRunId = 1;

const trueProjectStatuses = new Set([
  "Proposed",
  "Exploring",
  "Approved",
  "In Progress",
  "Completed",
]);

const maxOriginalWidth = 1920;
const maxOriginalHeight = 1920;
const squareSize = 800;

const contentTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const summary = {
  sitePages: 0,
  users: 0,
  projects: 0,
  organizations: 0,
  services: 0,
  placeholders: 0,
  images: 0,
  relationships: 0,
  tags: 0,
};

const sitePages = [
  ["homepage", "src/content/homepage/_index.md"],
  ["community", "src/content/community/_index.md"],
  ["organizations", "src/content/organizations/_index.md"],
  ["projects", "src/content/projects/_index.md"],
  ["contact", "src/content/contact/_index.md"],
  ["services", "src/content/services/page.md"],
];

const serviceIcons = {
  "red-alder-work": {
    filename: "red-alder-work.svg",
    title: "Red Alder Work",
    description: "Restorative, groundwork projects.",
    colors: ["#be123c", "#d97706"],
    paths: [
      "M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3",
      "M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4",
      "M5 21h14",
    ],
  },
  "story-time": {
    filename: "story-time.svg",
    title: "Storytime",
    description: "Narratives, notes, and field journals.",
    colors: ["#0284c7", "#6366f1"],
    paths: [
      "M12 7v14",
      "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
    ],
  },
  metachrysalis: {
    filename: "metachrysalis.svg",
    title: "Metachrysalis",
    description: "Transformation, prototypes, and launches.",
    colors: ["#f59e0b", "#65a30d"],
    paths: ["M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12"],
  },
};

const aliases = await buildAliases();

try {
  if (!only || only === "site-pages") {
    await importSitePages();
  }
  if (!only || only === "users") {
    await importUsers();
    await fillMissingPublishedAt("users");
  }
  if (!only || only === "organizations") {
    await importOrganizations();
    await fillMissingPublishedAt("organizations");
  }
  if (!only || only === "projects") {
    await importProjects();
    await fillMissingPublishedAt("projects");
  }
  if (!only || only === "services") {
    await importServices();
    await fillMissingPublishedAt("services");
  }

  console.log(
    JSON.stringify({ dryRun, only: only ?? "all", summary }, null, 2),
  );
} finally {
  await sql.end();
}

async function importSitePages() {
  for (const [slug, file] of sitePages) {
    const entry = await readMarkdown(path.join(root, file));
    await upsertContentPage({
      slug,
      values: {
        title: stringValue(entry.data.title),
        description: stringValue(entry.data.description),
        content: entry.content.trim(),
        seo_title: stringValue(entry.data.meta_title),
        seo_description: stringValue(entry.data.description),
      },
    });
    summary.sitePages += 1;
  }
}

async function importServices() {
  for (const file of await markdownFiles("src/content/services/posts")) {
    const entry = await readMarkdown(file);
    const slug = slugFromFile(file);
    const serviceIcon = serviceIcons[slug];
    const description =
      stringValue(entry.data.description) || serviceIcon?.description || "";
    const imageId = await imageForExistingOrServiceIcon({
      slug,
      alt: entry.data.title,
    });

    const serviceId = await upsertBySlug({
      table: "services",
      slug,
      values: {
        title:
          serviceIcon?.title ||
          stringValue(entry.data.title) ||
          titleFromSlug(slug),
        published_at: dateOrToday(entry.data.date),
        description,
        content: entry.content.trim(),
        draft: Boolean(entry.data.draft),
        seo_title: stringValue(entry.data.meta_title),
        seo_description: description,
        ...(imageId ? { image: imageId } : {}),
      },
      imageColumn: "image",
    });

    summary.services += 1;
    await saveTagsFor("service", serviceId, stringArray(entry.data.tags));

    for (const userRef of stringArray(entry.data.liaison)) {
      const userId = await ensureUser(userRef);
      await syncRelationship({
        table: "user_services",
        fromColumn: "service_id",
        toColumn: "user_id",
        fromId: serviceId,
        toId: userId,
        relationship: "liaison",
      });
    }
  }
}

async function importUsers() {
  for (const file of await markdownFiles("src/content/community/people")) {
    const entry = await readMarkdown(file);
    const slug = slugFromFile(file);
    const names = splitName(
      stringValue(entry.data.title) || titleFromSlug(slug),
    );
    const imageId = await imageForExistingOrPath({
      table: "users",
      field: "avatar",
      slug,
      imagePath: entry.data.image,
      alt: entry.data.title,
    });

    const userId = await upsertBySlug({
      table: "users",
      slug,
      values: {
        given_name: names.givenName,
        family_name: names.familyName,
        email: stringValue(entry.data.email) || placeholderEmail(slug),
        title: stringValue(entry.data.title),
        published_at: dateOrToday(entry.data.date),
        description: stringValue(entry.data.description),
        content: entry.content.trim(),
        draft: Boolean(entry.data.draft),
        linkedin: stringValue(entry.data.linkedin),
        community_roles: stringArray(entry.data.roles),
        seo_title: stringValue(entry.data.meta_title),
        seo_description: stringValue(entry.data.description),
        roles: [],
        ...(imageId ? { avatar: imageId } : {}),
      },
      imageColumn: "avatar",
    });

    summary.users += 1;

    for (const orgRef of stringArray(entry.data.communities)) {
      const organizationId = await ensureOrganization(orgRef);
      await syncRelationship({
        table: "user_organizations",
        fromColumn: "user_id",
        toColumn: "organization_id",
        fromId: userId,
        toId: organizationId,
        relationship: "organization",
      });
    }

    for (const projectRef of stringArray(entry.data.projects)) {
      const projectId = await ensureProject(projectRef);
      await syncRelationship({
        table: "user_projects",
        fromColumn: "user_id",
        toColumn: "project_id",
        fromId: userId,
        toId: projectId,
        relationship: "project",
      });
    }
  }
}

async function importOrganizations() {
  for (const file of await markdownFiles("src/content/organizations/posts")) {
    const entry = await readMarkdown(file);
    const slug = slugFromFile(file);
    const imageId = await imageForExistingOrPath({
      table: "organizations",
      field: "image",
      slug,
      imagePath: entry.data.image,
      alt: entry.data.title,
    });

    const organizationId = await upsertBySlug({
      table: "organizations",
      slug,
      values: {
        title: stringValue(entry.data.title) || titleFromSlug(slug),
        published_at: dateOrToday(entry.data.date),
        description: stringValue(entry.data.description),
        content: entry.content.trim(),
        draft: Boolean(entry.data.draft),
        url: stringValue(entry.data.url),
        kind: stringArray(entry.data.status),
        sdgs: stringArray(entry.data.sdgs),
        seo_title: stringValue(entry.data.meta_title),
        seo_description: stringValue(entry.data.description),
        ...(imageId ? { image: imageId } : {}),
      },
      imageColumn: "image",
    });

    summary.organizations += 1;
    await saveTagsFor(
      "organization",
      organizationId,
      stringArray(entry.data.tags),
    );

    for (const userRef of stringArray(entry.data.liaison)) {
      const userId = await ensureUser(userRef);
      await syncRelationship({
        table: "user_organizations",
        fromColumn: "organization_id",
        toColumn: "user_id",
        fromId: organizationId,
        toId: userId,
        relationship: "liaison",
      });
    }

    for (const projectRef of stringArray(entry.data.projects)) {
      const projectId = await ensureProject(projectRef);
      await syncRelationship({
        table: "project_organizations",
        fromColumn: "organization_id",
        toColumn: "project_id",
        fromId: organizationId,
        toId: projectId,
        relationship: "project",
      });
    }
  }
}

async function importProjects() {
  for (const file of await markdownFiles("src/content/projects/posts")) {
    const entry = await readMarkdown(file);
    const slug = slugFromFile(file);
    const split = splitProjectStatus(entry.data.status);
    const imageId = await imageForExistingOrPath({
      table: "projects",
      field: "image",
      slug,
      imagePath: entry.data.image,
      alt: entry.data.title,
    });

    const projectId = await upsertBySlug({
      table: "projects",
      slug,
      values: {
        title: stringValue(entry.data.title) || titleFromSlug(slug),
        published_at: dateOrToday(entry.data.date),
        description: stringValue(entry.data.description),
        content: entry.content.trim(),
        draft: Boolean(entry.data.draft),
        url: stringValue(entry.data.url),
        location: stringValue(entry.data.location),
        start_date: dateOrNull(entry.data.start_date),
        end_date: dateOrNull(entry.data.end_date),
        status: split.status,
        kind: split.kind,
        sdgs: stringArray(entry.data.sdgs),
        seo_title: stringValue(entry.data.meta_title),
        seo_description: stringValue(entry.data.description),
        ...(imageId ? { image: imageId } : {}),
      },
      imageColumn: "image",
    });

    summary.projects += 1;
    await saveTagsFor("project", projectId, stringArray(entry.data.tags));

    for (const userRef of stringArray(entry.data.liaison)) {
      const userId = await ensureUser(userRef);
      await syncRelationship({
        table: "user_projects",
        fromColumn: "project_id",
        toColumn: "user_id",
        fromId: projectId,
        toId: userId,
        relationship: "liaison",
      });
    }

    for (const orgRef of stringArray(entry.data.partners)) {
      const organizationId = await ensureOrganization(orgRef);
      await syncRelationship({
        table: "project_organizations",
        fromColumn: "project_id",
        toColumn: "organization_id",
        fromId: projectId,
        toId: organizationId,
        relationship: "organization",
      });
    }
  }
}

async function markdownFiles(dir) {
  const fullDir = path.join(root, dir);
  const entries = await fs.readdir(fullDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(fullDir, entry.name))
    .sort();
}

async function buildAliases() {
  return {
    users: await aliasesFor("src/content/community/people"),
    projects: await aliasesFor("src/content/projects/posts"),
    organizations: await aliasesFor("src/content/organizations/posts"),
    services: await aliasesFor("src/content/services/posts"),
  };
}

async function aliasesFor(dir) {
  const map = new Map();
  for (const file of await markdownFiles(dir)) {
    const entry = await readMarkdown(file);
    const slug = slugFromFile(file);
    for (const value of [slug, entry.data.title, entry.data.meta_title]) {
      addAlias(map, value, slug);
    }
  }
  return map;
}

function addAlias(map, value, slug) {
  const text = stringValue(value);
  if (!text) {
    return;
  }
  map.set(kebabCase(text), slug);
  map.set(compactKey(text), slug);
}

async function readMarkdown(file) {
  const raw = await fs.readFile(file, "utf8");
  return matter(raw);
}

function slugFromFile(file) {
  return path.basename(file, path.extname(file)).trim().toLowerCase();
}

async function upsertBySlug({ table, slug, values, imageColumn }) {
  const existing = await findBySlug(table, slug, imageColumn);
  const nowValues = sanitizeValues({ ...values, slug });

  if (existing) {
    const updateValues = { ...nowValues };
    if (imageColumn && existing[imageColumn] && imageColumn in updateValues) {
      delete updateValues[imageColumn];
    }
    if (table === "users") {
      delete updateValues.roles;
    }

    await run(
      sql`update ${sql(table)} set ${sql(updateValues)}, updated_at = now() where id = ${existing.id}`,
    );
    return existing.id;
  }

  if (dryRun) {
    const row = {
      id: (dryRunId += 1),
      slug,
      ...(imageColumn ? { [imageColumn]: null } : {}),
    };
    dryRunRows.set(rowKey(table, slug), row);
    return row.id;
  }

  const [row] = await run(
    sql`insert into ${sql(table)} ${sql({ public_id: createId(), ...nowValues })} returning id`,
  );
  return row.id;
}

async function findBySlug(table, slug, imageColumn) {
  if (dryRun) {
    const exact = dryRunRows.get(rowKey(table, slug));
    if (exact) {
      return exact;
    }

    const compactSlug = compactKey(slug);
    for (const [key, row] of dryRunRows) {
      if (key.startsWith(`${table}:`) && compactKey(row.slug) === compactSlug) {
        return row;
      }
    }

    return null;
  }

  const imageSelect = imageColumn ? sql`, ${sql(imageColumn)}` : sql``;
  const exactRows =
    await sql`select id ${imageSelect} from ${sql(table)} where slug = ${slug} and deleted_at is null limit 1`;
  if (exactRows[0]) {
    return exactRows[0];
  }

  const compactSlug = compactKey(slug);
  const compactRows = await sql`
    select id ${imageSelect}
    from ${sql(table)}
    where regexp_replace(lower(slug), '[^a-z0-9]+', '', 'g') = ${compactSlug}
      and deleted_at is null
    limit 1
  `;
  return compactRows[0] ?? null;
}

async function upsertContentPage({ slug, values }) {
  const nowValues = sanitizeValues({ ...values, slug });

  if (dryRun) {
    dryRunRows.set(rowKey("content", slug), {
      id: (dryRunId += 1),
      slug,
    });
    return;
  }

  await run(sql`
    insert into content ${sql(nowValues)}
    on conflict (slug) do update set ${sql({
      ...nowValues,
      updated_at: new Date(),
    })}
  `);
}

async function fillMissingPublishedAt(table) {
  await run(sql`
    update ${sql(table)}
    set published_at = now(), updated_at = now()
    where published_at is null
      and deleted_at is null
  `);
}

async function ensureUser(ref) {
  const slug = slugFromRef("users", ref);
  if (!slug) {
    return null;
  }

  const existing = await findBySlug("users", slug, "avatar");
  if (existing) {
    return existing.id;
  }

  const title = titleFromRef(ref);
  const names = splitName(title);
  summary.placeholders += 1;
  return upsertBySlug({
    table: "users",
    slug,
    values: {
      given_name: names.givenName,
      family_name: names.familyName,
      email: placeholderEmail(slug),
      title,
      published_at: dateOrToday(),
      description: "",
      content: "",
      draft: true,
      linkedin: "",
      community_roles: [],
      seo_title: "",
      seo_description: "",
      roles: [],
    },
    imageColumn: "avatar",
  });
}

async function ensureProject(ref) {
  const slug = slugFromRef("projects", ref);
  if (!slug) {
    return null;
  }

  const existing = await findBySlug("projects", slug, "image");
  if (existing) {
    return existing.id;
  }

  summary.placeholders += 1;
  return upsertBySlug({
    table: "projects",
    slug,
    values: {
      title: titleFromRef(ref),
      published_at: dateOrToday(),
      description: "",
      content: "",
      draft: true,
      url: "",
      location: "",
      start_date: null,
      end_date: null,
      status: "Proposed",
      kind: [],
      sdgs: [],
      seo_title: "",
      seo_description: "",
    },
    imageColumn: "image",
  });
}

async function ensureOrganization(ref) {
  const slug = slugFromRef("organizations", ref);
  if (!slug) {
    return null;
  }

  const existing = await findBySlug("organizations", slug, "image");
  if (existing) {
    return existing.id;
  }

  summary.placeholders += 1;
  return upsertBySlug({
    table: "organizations",
    slug,
    values: {
      title: titleFromRef(ref),
      published_at: dateOrToday(),
      description: "",
      content: "",
      draft: true,
      url: "",
      kind: [],
      sdgs: [],
      seo_title: "",
      seo_description: "",
    },
    imageColumn: "image",
  });
}

async function syncRelationship({
  table,
  fromColumn,
  toColumn,
  fromId,
  toId,
  relationship,
}) {
  if (!fromId || !toId) {
    return;
  }

  await run(sql`
    insert into ${sql(table)} (public_id, ${sql(fromColumn)}, ${sql(toColumn)}, relationship)
    values (${createId()}, ${fromId}, ${toId}, ${relationship})
    on conflict do nothing
  `);
  summary.relationships += 1;
}

async function saveTagsFor(prefix, tableId, tags) {
  const cleanTags = tags.map((tag) => tag.trim()).filter(Boolean);
  if (!cleanTags.length) {
    return;
  }
  if (dryRun) {
    summary.tags += cleanTags.length;
    return;
  }

  for (const name of cleanTags) {
    const slug = kebabCase(name);
    await run(sql`
      insert into tags (name, slug)
      values (${name}, ${slug})
      on conflict (slug) do nothing
    `);

    const [tag] = await sql`select id from tags where slug = ${slug} limit 1`;
    if (!tag) {
      continue;
    }

    await run(sql`
      insert into ${sql(`${prefix}_tags`)} (${sql(`${prefix}_id`)}, tag_id)
      values (${tableId}, ${tag.id})
      on conflict do nothing
    `);
    summary.tags += 1;
  }
}

async function imageForExistingOrPath({ table, field, slug, imagePath, alt }) {
  if (!stringValue(imagePath)) {
    return null;
  }

  const existing = await findBySlug(table, slug, field);
  if (existing?.[field]) {
    return null;
  }

  return uploadImage({
    table,
    field,
    imagePath: stringValue(imagePath),
    alt: stringValue(alt),
  });
}

async function imageForExistingOrServiceIcon({ slug, alt }) {
  const existing = await findBySlug("services", slug, "image");
  if (existing?.image) {
    return null;
  }

  const icon = serviceIcons[slug];
  if (!icon) {
    return null;
  }

  return uploadSvgImage({
    table: "services",
    field: "image",
    filename: icon.filename,
    svg: serviceIconSvg(icon),
    alt: stringValue(alt),
  });
}

async function uploadSvgImage({ table, field, filename, svg, alt }) {
  if (!bucket || !region) {
    throw new Error(
      "AWS_S3_BUCKET and AWS_S3_REGION/AWS_REGION must be set to import images.",
    );
  }
  if (dryRun) {
    return null;
  }

  const publicId = createId();
  const buffer = Buffer.from(svg);
  const baseName = kebabCase(path.basename(filename, ".svg")) || "image";
  const prefix = `${table}/${field}/${publicId}`;
  const sourceKey = `${prefix}/original-${baseName}.svg`;

  await putObject(sourceKey, buffer, "image/svg+xml");
  const metadata = await sharp(buffer).metadata();
  const sourceUrl = urlFor(sourceKey);
  const [image] = await run(sql`
    insert into images ${sql({
      public_id: publicId,
      status: "attached",
      kind: "svg",
      table,
      field,
      filename,
      prefix,
      base_name: baseName,
      alt,
      source_key: sourceKey,
      source_url: sourceUrl,
      source_type: "image/svg+xml",
      source_size: buffer.length,
      source_width: metadata.width ?? 256,
      source_height: metadata.height ?? 256,
    })}
    returning id
  `);
  summary.images += 1;
  return image.id;
}

function serviceIconSvg(icon) {
  const paths = icon.paths
    .map(
      (d) =>
        `<path d="${d}" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="${icon.colors[0]}"/><stop offset="1" stop-color="${icon.colors[1]}"/></linearGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="black" flood-opacity=".25"/></filter></defs><rect width="256" height="256" rx="42" fill="url(#bg)"/><g transform="translate(56 56) scale(6)" filter="url(#shadow)">${paths}</g></svg>`;
}

async function uploadImage({ table, field, imagePath, alt }) {
  const fullPath = path.join(root, imagePath.replace(/^\//, "public/"));
  const ext = path.extname(fullPath).toLowerCase();
  const sourceType = contentTypes[ext];
  if (!sourceType) {
    console.warn(`Skipping unsupported image type: ${imagePath}`);
    return null;
  }
  if (!bucket || !region) {
    throw new Error(
      "AWS_S3_BUCKET and AWS_S3_REGION/AWS_REGION must be set to import images.",
    );
  }
  if (dryRun) {
    return null;
  }

  const originalBuffer = await fs.readFile(fullPath);
  const publicId = createId();
  const baseName = kebabCase(path.basename(fullPath, ext)) || "image";
  const prefix = `${table}/${field}/${publicId}`;

  if (sourceType === "image/svg+xml") {
    const sourceKey = `${prefix}/original-${baseName}${ext}`;
    await putObject(sourceKey, originalBuffer, sourceType);
    const metadata = await sharp(originalBuffer).metadata();
    const sourceUrl = urlFor(sourceKey);
    const [image] = await run(sql`
      insert into images ${sql({
        public_id: publicId,
        status: "attached",
        kind: "svg",
        table,
        field,
        filename: path.basename(fullPath),
        prefix,
        base_name: baseName,
        alt,
        source_key: sourceKey,
        source_url: sourceUrl,
        source_type: sourceType,
        source_size: originalBuffer.length,
        source_width: metadata.width ?? null,
        source_height: metadata.height ?? null,
      })}
      returning id
    `);
    summary.images += 1;
    return image.id;
  }

  const sourceKey = `private/${prefix}/original-${baseName}${ext}`;
  await putObject(sourceKey, originalBuffer, sourceType);

  const metadata = await sharp(originalBuffer).metadata();
  const webpOptions =
    metadata.format === "png" ||
    metadata.format === "gif" ||
    metadata.format === "webp"
      ? { lossless: true }
      : { quality: 82 };

  const originalWebp = await sharp(originalBuffer)
    .rotate()
    .resize({
      width: maxOriginalWidth,
      height: maxOriginalHeight,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp(webpOptions)
    .toBuffer();
  const squareWebp = await sharp(originalBuffer)
    .rotate()
    .resize({
      width: squareSize,
      height: squareSize,
      fit: "cover",
      position: "centre",
      withoutEnlargement: true,
    })
    .webp(webpOptions)
    .toBuffer();

  const originalKey = `${prefix}/original/${baseName}.webp`;
  const squareKey = `${prefix}/square/${baseName}.webp`;
  await Promise.all([
    putObject(originalKey, originalWebp, "image/webp"),
    putObject(squareKey, squareWebp, "image/webp"),
  ]);

  const originalMetadata = await sharp(originalWebp).metadata();
  const squareMetadata = await sharp(squareWebp).metadata();
  const [image] = await run(sql`
    insert into images ${sql({
      public_id: publicId,
      status: "attached",
      kind: "raster",
      table,
      field,
      filename: path.basename(fullPath),
      prefix,
      base_name: baseName,
      alt,
      source_key: sourceKey,
      source_url: "",
      source_type: sourceType,
      source_size: originalBuffer.length,
      source_width: metadata.width ?? null,
      source_height: metadata.height ?? null,
      variants: {
        original: {
          key: originalKey,
          url: urlFor(originalKey),
          type: "image/webp",
          size: originalWebp.length,
          width: originalMetadata.width ?? null,
          height: originalMetadata.height ?? null,
        },
        square: {
          key: squareKey,
          url: urlFor(squareKey),
          type: "image/webp",
          size: squareWebp.length,
          width: squareMetadata.width ?? null,
          height: squareMetadata.height ?? null,
          square: true,
        },
      },
    })}
    returning id
  `);
  summary.images += 1;
  return image.id;
}

async function putObject(key, body, contentType) {
  if (dryRun) {
    return;
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

async function run(query) {
  if (dryRun) {
    return [];
  }
  return query;
}

function splitProjectStatus(value) {
  const values = stringArray(value);
  const status =
    values.find((item) => trueProjectStatuses.has(item)) ?? "Proposed";
  const kind = values.filter((item) => item && item !== status);
  return { status, kind };
}

function sanitizeValues(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  );
}

function stringArray(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map(stringValue).filter(Boolean);
  }
  const text = stringValue(value);
  return text ? [text] : [];
}

function stringValue(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

function dateOrNull(value) {
  if (!value) {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function dateOrToday(value) {
  return dateOrNull(value) ?? new Date();
}

function splitName(name) {
  const parts = stringValue(name).split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { givenName: parts[0] ?? "", familyName: "" };
  }
  return {
    givenName: parts.slice(0, -1).join(" "),
    familyName: parts.at(-1) ?? "",
  };
}

function slugFromRef(type, ref) {
  const value = stringValue(ref);
  return (
    aliases[type].get(kebabCase(value)) ??
    aliases[type].get(compactKey(value)) ??
    kebabCase(value)
  );
}

function titleFromRef(ref) {
  const value = stringValue(ref);
  return value.includes("-") || value.includes("_")
    ? titleFromSlug(value)
    : value;
}

function titleFromSlug(slug) {
  return stringValue(slug)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function placeholderEmail(slug) {
  return `${slug}@placeholder.thaumazo.local`;
}

function urlFor(key) {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

function compactKey(value) {
  return stringValue(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function rowKey(table, slug) {
  return `${table}:${slug}`;
}
