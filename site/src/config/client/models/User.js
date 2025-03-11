import clientModel from "@kenstack/client/Model";
import PasswordRequest from "@kenstack/modules/User/PasswordRequest";

import Editor from "@kenstack/forms/ToastEditor";

const fields = {
  modelName: "User",
  title: "Manage users",
  list: [
    ["first_name", { label: "First", width: "auto" }],
    ["last_name", { label: "Last", width: "auto" }],
    ["email"],
    ["draft", { width: "auto" }],
  ],
  fields: {
    personal: {
      card: true,
      title: "Personal information",
      span: "lg:col-span-6",
      fields: {
        image: {
          field: "image",
          span: "col-span-2 row-span-2",
        },
        first_name: {
          required: true,
          span: "col-span-10 lg:col-span-5",
        },
        last_name: {
          required: true,
          span: "col-span-10 lg:col-span-5",
        },
        slug: {
          // label: "Name",
          // required: true,
          field: "slug",
          subscribe: ["first_name", "last_name"],
          span: "col-span-10",
        },

        email: {
          required: true,
          field: "email",
        },
        location: {},
        linkedin: {},
        // projects: {
        //   field: "multi-select",
        // }
      },
    },
    login: {
      card: true,
      title: "Access & Meta",
      span: "lg:col-span-6",
      fields: {
        draft: {
          field: "checkbox",
        },
        roles: {
          label: "Roles  (Access)",
          field: "checkbox-list",
          options: [["ADMIN", "Administrator"]],
        },
        categories: {
          field: "multi-select",
          options: ["Community"],
        },
        tags: {
          field: "tags",
        },
        publicRoles: {
          label: "Roles  (Public)",
          field: "multi-select",
          options: [
            "Community Member",
            "Director",
            "Liaison",
            "Project Lead",
            "Project Member",
            "Team Lead",
            "Team Member",
            "Volunteer",
          ],
        },
        resetPassword: {
          field: PasswordRequest,
          transient: true,
        },
      },
    },
    // metaa:  {
    //   card: true,
    //   title: "Meta",
    //   span: "lg:col-span-6",
    //   fields: {

    //   }
    // },
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

const UserAdmin = clientModel(fields);
export default UserAdmin;
