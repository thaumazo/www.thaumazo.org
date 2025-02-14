import mongoose from "@kenstack/db";

import ProjectAdmin from "../../client/models/Project";
import AdminSchema from "@kenstack/db/AdminSchema";

const ProjectSchema = AdminSchema.fromClientModel(ProjectAdmin);

// userSchema.add({});

export default mongoose.addModel("Project", ProjectSchema);

