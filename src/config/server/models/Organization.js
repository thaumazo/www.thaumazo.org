import mongoose from "@kenstack/db";

import AdminSchema from "@kenstack/db/AdminSchema";
import { imagePlugin } from "@kenstack/forms/Image/schema";
import tag from "@kenstack/forms/Tags/schema";

const OrganizationSchema = new AdminSchema({
  title: String,
  slug: { type: String },
  description: String,
  //  image,
  url: String,
  // location: String,
  draft: {
    type: Boolean,
    default: true,
  },
  status: [String],
  tags: tag,
  liaisons: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sdgs: [String],

  content: String,
});

OrganizationSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { "meta.deleted": false } },
);

OrganizationSchema.plugin(imagePlugin, {
  transformations: [["thumbnail", "w_360,h_250,c_fill,g_auto,f_webp"]],
});

export default mongoose.addModel("Organization", OrganizationSchema);
