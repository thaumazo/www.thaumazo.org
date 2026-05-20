import type { MetadataRoute } from "next";

import { listOrganizations } from "@/modules/organizations/queries";
import { listProjects } from "@/modules/projects/queries";
import { listServices } from "@/modules/services/queries";
import { listCommunityUsers } from "@/modules/users/queries";
import { deps } from "@app/deps";

function url(path: string, origin: string) {
  return new URL(path, origin).toString();
}

function page(
  path: string,
  origin: string,
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: url(path, origin),
    changeFrequency: "monthly",
    priority,
  };
}

function listPage(path: string, origin: string): MetadataRoute.Sitemap[number] {
  return {
    url: url(path, origin),
    changeFrequency: "weekly",
    priority: 0.8,
  };
}

function articlePage(
  path: string,
  origin: string,
): MetadataRoute.Sitemap[number] {
  return {
    url: url(path, origin),
    changeFrequency: "monthly",
    priority: 0.6,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = deps.siteUrl;
  const [communityUsers, organizations, projects, services] = await Promise.all(
    [listCommunityUsers(), listOrganizations(), listProjects(), listServices()],
  );

  return [
    {
      url: url("/", origin),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Re-enable the blog list and post pages when blog is linked into the public site.
    // listPage("/blog", origin),
    listPage("/community", origin),
    listPage("/organizations", origin),
    listPage("/projects", origin),
    listPage("/services", origin),
    page("/contact", origin, 0.7),
    ...communityUsers.map((user) =>
      articlePage(`/community/${encodeURIComponent(user.slug)}`, origin),
    ),
    ...organizations.map((organization) =>
      articlePage(
        `/organizations/${encodeURIComponent(organization.slug)}`,
        origin,
      ),
    ),
    ...projects.map((project) =>
      articlePage(`/projects/${encodeURIComponent(project.slug)}`, origin),
    ),
    ...services.map((service) =>
      articlePage(`/services/${encodeURIComponent(service.slug)}`, origin),
    ),
  ];
}
