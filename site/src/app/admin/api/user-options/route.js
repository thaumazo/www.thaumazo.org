import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

import { session } from "@/config/server";
// import { redirect } from "next/navigation";

import User from "@/config/server/models/User";
import apiAction from "@kenstack/server/apiAction";

async function loadUserOptions({ keywords = "", idArray = [] }) {
  // if (!(await session.hasRole("ADMIN"))) {
  //   return redirect("/login");
  // }

  const objectIds = idArray.map((id) => new ObjectId(id));

  // let query = User.find({}, 'first_name last_name').limit(25);

  let query = User.aggregate([
    {
      $addFields: {
        fullName: { $concat: ["$first_name", " ", "$last_name"] },
      },
    },
    {
      $match: idArray.length
        ? { _id: { $in: objectIds } }
        : {
            fullName: { $regex: keywords, $options: "i" },
          },
    },
    {
      $sort: { fullName: 1 }, // 1 for ascending, -1 for descending
    },
  ]).limit(25);

  let users = await query.exec();

  const options = users.map(({ _id, fullName, first_name, last_name }) => [
    _id.toString(),
    fullName,
    // first_name + " " + last_name,
  ]);

  console.log(keywords);
  return {
    success: true,
    options,
  };
}

export const POST = (request) =>
  apiAction(loadUserOptions, request, {
    session,
    roles: ["ADMIN"],
  });
