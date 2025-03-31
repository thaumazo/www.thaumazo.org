import mongoose from "@kenstack/db";

import userSchema from "@kenstack/modules/User/models/UserSchema";
import { imagePlugin } from "@kenstack/forms/Image/schema";
import tags from "@kenstack/forms/Tags/schema";

userSchema.add({
  slug: { type: String },
  // image,
  location: String,
  linkedin: String,
  draft: Boolean,
  tags,
  categories: [String],
  publicRoles: [String],
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Communities" }],
  // projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' }],
  content: String,
});

userSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { "meta.deleted": false } },
);

userSchema.plugin(imagePlugin, {
  transformations: [["thumbnail", "w_360,h_250,c_fill,g_auto,f_webp"]],
});

export default mongoose.addModel("User", userSchema);
