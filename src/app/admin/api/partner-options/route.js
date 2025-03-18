import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

import { session } from "@/config/server";
// import { redirect } from "next/navigation";

import Organization from "@/config/server/models/Organization";
import apiAction from "@kenstack/server/apiAction";

async function loadPartnerOptions({ keywords = "", idArray = [] }) {
  const objectIds = idArray.map((id) => new ObjectId(id));

  let query;
  if (idArray.length) {
    query = Organization.find({ _id: { $in: objectIds } }, ["title"]);
  } else {
    query = Organization.find(
      {
        title: { $regex: keywords, $options: "i" },
      },
      ["title"],
    ).limit(25);
  }

  let organizations = await query.sort("title").exec();

  const options = organizations.map(({ _id, title }) => [
    _id.toString(),
    title,
  ]);

  return {
    success: true,
    options,
  };
}

export const POST = (request) =>
  apiAction(loadPartnerOptions, request, {
    session,
    roles: ["ADMIN"],
  });
