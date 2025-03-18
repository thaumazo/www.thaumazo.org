#!/usr/bin/env -S  env-cmd -f ../../.env.local tsx  --conditions=react-server

import loadImage from "./loadImage";

import User from "@/config/server/models/User";
import Project from "@/config/server/models/Project";
import Organization from "@/config/server/models/Organization";

import listMD from "@/utils/listMD";
import omit from "lodash-es/omit";
import kebabCase from "lodash-es/kebabCase";
import startCase from "lodash-es/startCase";

process.chdir("../../");

const projects = await listMD(
  import.meta.dirname + "/../content/projects/posts",
);

let liaisonOmit = [];
const partnerOmit = []; // await Organization.find({}, ['slug']).map((p) => p.slug);

for (let project of projects) {
  const {
    title,
    slug,
    description,
    image,
    draft,
    url,
    location,
    status,
    start_date,
    end_date,
    // categories,
    tags,
    content,
    sdgs,
    date,
    liaison: liaisonTmp,
    partners: partnersTmp,

    // ...rest
  } = omit(project, ["author", "meta_title", "categories"]);

  const liaison = liaisonTmp.map((l) => kebabCase(l.toLowerCase()));
  const partners = partnersTmp
    .filter((p) => p.length)
    .map((p) => kebabCase(p.toLowerCase()));

  // eslint-disable-next-line no-console
  console.log(`${title} -  ${slug}`);

  const data = {
    title,
    slug,
    description,
    draft,
    url,
    location,
    status,
    start_date,
    end_date,
    tags: tags
      .filter((tag) => tag !== "")
      .map((tag) => ({ name: tag.trim().toLowerCase(), slug: kebabCase(tag) })),
    sdgs,
    content,
  };

  let doc = await Project.findOne({ slug });
  if (!doc) {
    doc = new Project({
      slug,
      "meta.createdAt": date,
    });
  }

  doc.partners = [];
  const partnerOrganizations = await Organization.find({
    slug: { $in: partners },
  });
  partnerOrganizations.forEach((u) => {
    doc.partners.push(u._id);

    partnerOmit.push(u.slug);
  });
  if (partnerOrganizations.length < partners.length) {
    // console.log('omit', partnerOmit);
    const create = partners.filter((p) => !partnerOmit.includes(p));

    for (let s of create) {
      const o = new Organization({
        draft: true,
        title: startCase(s),
        slug: s,
      });
      await o.save();
      doc.partners.push(o._id);
    }
  }

  doc.liaison = [];
  const liaisonUsers = await User.find({ slug: { $in: liaison } });
  liaisonUsers.forEach((u) => {
    doc.liaison.push(u._id);

    liaisonOmit.push(u.slug);
  });
  if (liaisonUsers.length < liaison.length) {
    const create = liaison.filter((l) => !liaisonOmit.includes(l));

    for (let s of create) {
      const names = s.split(/-+/g).map((v) => startCase(v));
      const u = new User({
        draft: true,
        first_name: names[0],
        last_name: names[1],
        slug: s,
        email: kebabCase(s) + "@temporary.email.com",
      });
      await u.save();
      doc.liaison.push(u._id);
    }
  }

  // liaisonArray = [...liaisonArray, ...liaison];
  // partnerArray = [...partnerArray, ...partners];

  doc.set(data);

  if (image && !doc.image) {
    doc.image = await loadImage(image);
  }

  await doc.save();
}

process.exit();
