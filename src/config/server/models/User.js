import mongoose from "@kenstack/db";

import userSchema from "@kenstack/modules/User/models/UserSchema";
import image from "@kenstack/forms/Image/schema";
import tags from "@kenstack/forms/Tags/schema";

userSchema.add({
  slug: { type: String, unique: true},
  image,
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

export default mongoose.addModel("User", userSchema);
