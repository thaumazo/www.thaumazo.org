import { defineRelationships } from "@kenstack/admin";
import { sql } from "drizzle-orm";
import { projectOrganizations, projects } from "@/modules/projects/tables";
import { users } from "@/modules/users/tables";
import {
  organizations,
  userOrganizations,
} from "@/modules/organizations/tables";
import { withRelationshipName } from "@/modules/relationships";

const userLabel = sql<string>`coalesce(nullif(trim(concat_ws(' ', ${users.givenName}, ${users.familyName})), ''), ${users.email})`;

export const relationships = defineRelationships({
  members: {
    through: userOrganizations,
    from: withRelationshipName(organizations, "organization"),
    to: withRelationshipName(users, "user"),
    label: userLabel,
    search: [users.givenName, users.familyName, users.email],
  },
  liaisons: {
    through: userOrganizations,
    from: withRelationshipName(organizations, "organization"),
    to: withRelationshipName(users, "user"),
    label: userLabel,
    search: [users.givenName, users.familyName, users.email],
  },
  projects: {
    through: projectOrganizations,
    from: withRelationshipName(organizations, "organization"),
    to: withRelationshipName(projects, "project"),
    label: projects.title,
    search: [projects.title, projects.description],
  },
});
