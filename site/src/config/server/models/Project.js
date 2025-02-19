import mongoose from "@kenstack/db";

// import ProjectAdmin from "../../client/models/Project";
import AdminSchema from "@kenstack/db/AdminSchema";

const ProjectSchema = new AdminSchema({
  title: String,
  slug: String,
  url: String,
  location: String,
  draft: {
    type: Boolean,
    default: true,
  },
  start_date: Date,
  end_date: Date,
  tags: {
    type: [String],
    index: true, 
  },
  liaisons: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sdgs: [String],
  
  content: String,
});

export default mongoose.addModel("Project", ProjectSchema);
