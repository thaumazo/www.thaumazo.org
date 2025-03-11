#!/usr/bin/env -S  env-cmd -f ../../.env.local tsx  --conditions=react-server

import loadImage from "./loadImage";

import User from "@/config/server/models/User";
// import Project from "@/config/server/models/Project";
import Organization from "@/config/server/models/Organization";
import listMD from "@/utils/listMD";
import omit from "lodash-es/omit";
import kebabCase from "lodash-es/kebabCase";
import startCase from "lodash-es/startCase";

process.chdir("../../");

const organizations = await listMD(
  import.meta.dirname + "/../content/organizations/posts",
);

let liaisonOmit = [];

for (let organization of organizations) {
  const {
    title,
    slug,
    description,
    image,
    draft,
    url,
    status,
    tags,
    content,
    sdgs,
    date,
    liaison: liaisonTmp,

    // projects,
    // ...rest
  } = omit(organization, ["author", "meta_title", "categories"]);

  const liaison = liaisonTmp.map((l) => kebabCase(l));

  // eslint-disable-next-line no-console
  console.log(`${title} -  ${slug}`);

  const data = {
    title,
    slug,
    description,
    draft,
    url,
    status,
    tags: tags
      .filter((tag) => tag !== "")
      .map((tag) => ({ name: tag.trim().toLowerCase(), slug: kebabCase(tag) })),
    sdgs,
    content,
  };

  let doc = await Organization.findOne({ slug });
  if (!doc) {
    doc = new Organization({
      slug,
      "meta.createdAt": date,
    });
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
