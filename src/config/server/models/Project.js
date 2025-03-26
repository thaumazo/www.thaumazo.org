import mongoose from "@kenstack/db";

// import ProjectAdmin from "../../client/models/Project";
import AdminSchema from "@kenstack/db/AdminSchema";
import image from "@kenstack/forms/Image/schema";
import tag from "@kenstack/forms/Tags/schema";

// import Checkbox from "@kenstack/forms/Checkbox";

const ProjectSchema = new AdminSchema({
  title: String,
  slug: { type: String},
  description: String,
  image,
  url: String,
  location: String,
  draft: {
    type: Boolean,
    default: true,
  },
  start_date: Date,
  end_date: Date,
  status: [String],
  tags: tag,
  liaison: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  partners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Organization" }],
  sdgs: [String],

  content: String,
});

ProjectSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { "meta.deleted": false } },
);

export default mongoose.addModel("Project", ProjectSchema);
