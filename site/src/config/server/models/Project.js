import mongoose from "@kenstack/db";

// import ProjectAdmin from "../../client/models/Project";
import AdminSchema from "@kenstack/db/AdminSchema";
import { ImageFieldOptions } from "@kenstack/forms/Image/db"
import { TagFieldOptions } from "@kenstack/forms/Tags/db"

const ProjectSchema = new AdminSchema({
  title: String,
  slug: String,
  image: ImageFieldOptions,
  url: String,
  location: String,
  draft: {
    type: Boolean,
    default: true,
  },
  start_date: Date,
  end_date: Date,
  tags: TagFieldOptions,
  liaisons: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sdgs: [String],
  
  content: String,
});

export default mongoose.addModel("Project", ProjectSchema);
