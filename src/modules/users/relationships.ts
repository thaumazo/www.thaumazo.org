import { defineRelationships } from "@kenstack/admin";
import {
  organizations,
  userOrganizations,
} from "@/modules/organizations/tables";
import { projects, userProjects } from "@/modules/projects/tables";
import { users } from "./tables";
import { withRelationshipName } from "@/modules/relationships";

export const relationships = defineRelationships({
  organizations: {
    through: userOrganizations,
    from: withRelationshipName(users, "user"),
    to: withRelationshipName(organizations, "organization"),
    label: organizations.title,
    search: [organizations.title, organizations.description],
  },
  projects: {
    through: userProjects,
    from: withRelationshipName(users, "user"),
    to: withRelationshipName(projects, "project"),
    label: projects.title,
    search: [projects.title, projects.description],
  },
});
