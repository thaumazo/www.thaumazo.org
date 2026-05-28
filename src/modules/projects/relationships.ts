import { defineRelationships } from "@kenstack/fields";
import { sql } from "drizzle-orm";
import { organizations } from "@/modules/organizations/tables";
import { users } from "@/modules/users/tables";
import {
  projectOrganizations,
  projects,
  userProjects,
} from "@/modules/projects/tables";
import { withRelationshipName } from "@/modules/relationships";

const userLabel = sql<string>`coalesce(nullif(trim(concat_ws(' ', ${users.givenName}, ${users.familyName})), ''), ${users.email})`;

export const relationships = defineRelationships({
  liaisons: {
    through: userProjects,
    from: withRelationshipName(projects, "project"),
    to: withRelationshipName(users, "user"),
    label: userLabel,
    search: [users.givenName, users.familyName, users.email],
  },
  organizations: {
    through: projectOrganizations,
    from: withRelationshipName(projects, "project"),
    to: withRelationshipName(organizations, "organization"),
    label: organizations.title,
    search: [organizations.title, organizations.description],
  },
});
