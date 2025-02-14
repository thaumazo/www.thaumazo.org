import clientModel from "@kenstack/client/Model";
import Editor from "@kenstack/forms/ToastEditor";

const fields = {
  modelName: "Project",
  // title: "Projects",
  list: [
    ["title"],
  ],
  fields: {
    personal: {
      card: true,
      title: "Personal information",
      span: "lg:col-span-6",
      fields: {
        title: {
          required: true,
        },

      },
    },
    login: {
      card: true,
      title: "Access",
      span: "lg:col-span-6",
      fields: {},
    },
    content: {
      fields: {
        content: {
          field: Editor,
        },
      },
    },
  },
};

export { fields };

const ProjectAdmin = clientModel(fields);
export default ProjectAdmin;
