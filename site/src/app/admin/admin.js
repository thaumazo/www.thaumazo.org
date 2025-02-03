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
  ],
  fields: {
    personal: {
      card: true,
      title: "Personal information",
      span: "lg:col-span-6",
      fields: {
        first_name: {
          required: true,
          span: "lg:col-span-6",
        },
        last_name: {
          required: true,
          span: "lg:col-span-6",
        },
        slug: {
          // label: "Name",
          // required: true,
          field: "slug",
          subscribe: ["first_name", "last_name"],
        },

        email: {
          required: true,
          type: "email",
        },
      },
    },
    login: {
      card: true,
      title: "Access",
      span: "lg:col-span-6",
      fields: {
        roles: {
          field: "checkboxList",
          options: [["ADMIN", "Administrator"]],
        },
        resetPassword: {
          field: PasswordRequest,
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

const UserAdmin = clientModel(fields);
export default UserAdmin;
