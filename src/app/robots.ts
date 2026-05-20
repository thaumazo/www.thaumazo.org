import type { MetadataRoute } from "next";

import { deps } from "@app/deps";

const disallowedPaths = [
  "/admin/",
  "/api/",
  "/forgot-password",
  "/login",
  "/reset-password",
];

const blockedCrawlers = [
  "360Spider",
  "Baiduspider",
  "Bytespider",
  "PetalBot",
  "Sogou web spider",
  "Yandex",
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (process.env.VERCEL_ENV !== "production") {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
        {
          userAgent: blockedCrawlers,
          disallow: "/",
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: blockedCrawlers,
        disallow: "/",
      },
    ],
    sitemap: new URL("/sitemap.xml", deps.siteUrl).toString(),
  };
}
