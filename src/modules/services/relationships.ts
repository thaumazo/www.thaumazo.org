import { defineRelationships } from "@kenstack/fields";
import { sql } from "drizzle-orm";
import { withRelationshipName } from "@/modules/relationships";
import { users } from "@/modules/users/tables";
import { services, userServices } from "./tables";

const userLabel = sql<string>`coalesce(nullif(trim(concat_ws(' ', ${users.givenName}, ${users.familyName})), ''), ${users.email})`;

export const relationships = defineRelationships({
  liaisons: {
    through: userServices,
    from: withRelationshipName(services, "service"),
    to: withRelationshipName(users, "user"),
    label: userLabel,
    search: [users.givenName, users.familyName, users.email],
  },
});
