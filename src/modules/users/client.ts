"use client";

import { adminClient } from "@kenstack/admin";
import { userClientOptions } from "@kenstack/modules/users/client";
import EditForm from "./components/EditForm";
import ListItem from "./components/ListItem";
import { fields } from "./fields";

export const client = adminClient({
  ...userClientOptions,
  fields,
  ListItem,
  EditForm,
});
