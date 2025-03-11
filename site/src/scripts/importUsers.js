#!/usr/bin/env -S  env-cmd -f ../../.env.local tsx --conditions=react-server

import loadImage from "./loadImage";

import User from "@/config/server/models/User";
import listMD from "@/utils/listMD";
import omit from "lodash-es/omit";
import kebabCase from "lodash-es/kebabCase";

process.chdir("../../");

const users = await listMD(
  import.meta.dirname + "/../content/community/people",
);

for (let user of users) {
  if (user.slug !== "kenneth-spencer") {
    // continue;
  }

  const {
    draft,
    location,
    content,
    contact,
    slug,
    title,
    categories,
    linkedin,
    roles: publicRoles,
    // projects,
    // communities,
    image,
    tags = [],
    date,
    // ...rest
  } = omit(user, ["description", "meta_title", "author"]);
  const [email] = contact;
  const [first_name = "", last_name = ""] = title.trim().split(/\s+/);

  const data = {
    first_name,
    last_name,
    location,
    draft,

    categories,
    linkedin,
    publicRoles,
    // projects,
    // communities,

    tags: tags.map((tag) => ({
      name: tag.trim().toLowerCase(),
      slug: kebabCase(tag),
    })),
    content,
  };

  let doc = await User.findOne({ slug });
  if (!doc) {
    doc = new User({
      slug,
      email,
      "meta.createdAt": date,
    });
  }

  if (!doc.image) {
    doc.image = await loadImage(image);
  }

  doc.set(data);

  await doc.save();
}

// const updatedUser = await User.findOneAndUpdate(
//   { slug: userData.slug }, // filter by slug
//   { $set: { ...userData } }, // update with the provided userData
//   { new: true, upsert: true } // options: return new doc and upsert if not exists
// );

process.exit();
