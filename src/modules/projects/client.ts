"use client";

import { adminClient } from "@kenstack/admin";
import { fields } from "./fields";
import EditForm from "./components/Form";
import ListItem from "./components/ListItem";

export default adminClient({ fields, ListItem, EditForm });
