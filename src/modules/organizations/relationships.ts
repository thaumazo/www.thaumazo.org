import { defineRelationships } from "@kenstack/fields/relationships";
import { sql } from "drizzle-orm";
import { users } from "@/modules/users/tables";
import {
  organizations,
  userOrganizations,
} from "@/modules/organizations/tables";
import { withRelationshipName } from "@/modules/relationships";

const userLabel = sql<string>`coalesce(nullif(trim(concat_ws(' ', ${users.givenName}, ${users.familyName})), ''), ${users.email})`;

export const relationships = defineRelationships({
  liaisons: {
    through: userOrganizations,
    from: withRelationshipName(organizations, "organization"),
    to: withRelationshipName(users, "user"),
    label: userLabel,
    search: [users.givenName, users.familyName, users.email],
  },
});
