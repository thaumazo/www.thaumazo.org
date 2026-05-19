"use client";

import { adminClient } from "@kenstack/admin";
import EditForm from "./components/EditForm";
import ListItem from "./components/ListItem";
import { fields } from "./fields";

export default adminClient({ fields, ListItem, EditForm });
