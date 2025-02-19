import clientModel from "@kenstack/client/Model";
import Editor from "@kenstack/forms/ToastEditor";
// import loadUserOptions from "@/config/server/actions/loadUserOptions";

import apiAction from "@kenstack/client/apiAction";

const fields = {
  modelName: "Project",
  // title: "Projects",
  list: [["title"]],
  fields: {
    personal: {
      card: true,
      title: "Personal information",
      span: "lg:col-span-6",
      fields: {
        title: {
          required: true,
        },
        slug: {
          field: "slug",
          subscribe: ["title"],
          required: true,
        },
        location: {},
        url: {
          type: "url",
        },
      },
    },
    meta: {
      card: true,
      title: "Meta",
      span: "lg:col-span-6",
      fields: {
        draft: {
          field: "checkbox",
          default: true,
        },
        start_date: {
          type: "date",
          span: "col-span-6",
        },
        end_date: {
          type: "date",
          span: "col-span-6",
        },
        tags: {
          field: "tags",
        },
        liaisons: {
          field: "multi-select",
          loadOptions: (arg) => apiAction("/admin/api/user-options", arg),
        },
        sdgs: {
          field: "multi-select",
          options: [
            ["1", "1: No Poverty"],
            ["2", "2: Zero Hunger"],
            ["3", "3: Good Health and Well-being"],
            ["4", "4: Quality Education"],
            ["5", "5: Gender Equality"],
            ["6", "6: Clean Water and Sanitation"],
            ["7", "7: Affordable and Clean Energy"],
            ["8", "8: Decent Work and Economic Growth"],
            ["9", "9: Industry, Innovation and Infrastructure"],
            ["10", "10: Reduced Inequalities"],
            ["11", "11: Sustainable Cities and Communities"],
            ["12", "12: Responsible Consumption and Production"],
            ["13", "13: Climate Action"],
            ["14", "14: Life Below Water"],
            ["15", "15: Life on Land"],
            ["16", "16: Peace, Justice and Strong Institutions"],
            ["17", "17: Partnerships for the Goals"],
          ],
        },
      },
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
