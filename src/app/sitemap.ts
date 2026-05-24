import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/data";
import { areas } from "@/lib/areas";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const core = [
    "",
    "/about",
    "/services",
    "/projects",
    "/testimonials",
    "/contact",
    "/free-quote",
    "/areas",
  ];
  const servicePaths = services.map((s) => `/services/${s.slug}`);
  const areaPaths = areas.map((a) => `/areas/${a.slug}`);
  const legalPaths = ["/privacy-policy", "/cookie-policy", "/terms", "/gdpr"];

  const all = [...core, ...servicePaths, ...areaPaths, ...legalPaths];

  return all.map((route) => ({
    url: `${site.url}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : legalPaths.includes(route) ? 0.3 : 0.7,
  }));
}
