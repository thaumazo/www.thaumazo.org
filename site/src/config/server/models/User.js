import mongoose from "@kenstack/db";

import userSchema from "@kenstack/modules/User/models/UserSchema";

userSchema.add({
  slug: String,
  location: String,
  linkedin: String,
  publicRoles: [String],
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Communities' }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' }],
  content: String,
  
});

export default mongoose.addModel("User", userSchema);
