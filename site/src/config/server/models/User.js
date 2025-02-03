import mongoose from "@kenstack/db";

import userSchema from "@kenstack/modules/User/models/UserSchema";

userSchema.add({
  slug: String,
});

export default mongoose.addModel("User", userSchema);
