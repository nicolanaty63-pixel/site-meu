import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/data";
import { areas } from "@/lib/areas";
import { guides } from "@/lib/guides";
import { projects } from "@/lib/data";

// Sitemap priority + changeFrequency reflect commercial intent: conversion
// pages (quote, contact, services landing) signal as the strongest, service
// + area detail pages just under, evergreen legal pages signal weak. Google
// uses these as soft hints when scheduling re-crawls.
type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

const ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: ChangeFreq;
}> = [
  // Top of funnel + conversion
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/free-quote", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
  // High-intent service + portfolio hubs
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
  { path: "/testimonials", priority: 0.7, changeFrequency: "weekly" },
  { path: "/areas", priority: 0.8, changeFrequency: "monthly" },
  // Informational cluster supporting the pillars
  { path: "/guides", priority: 0.7, changeFrequency: "monthly" },
  // Brand
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
];

const SERVICE_PRIORITY = 0.8; // per-service detail = high commercial intent
const AREA_PRIORITY = 0.7; // per-area detail = high local intent
const GUIDE_PRIORITY = 0.7; // cost guides â€” high informational + supports pillars
const PROJECT_PRIORITY = 0.7; // per-project case studies (substantial trust assets)
const LEGAL_PRIORITY = 0.3;
const LEGAL_PATHS = [
  "/privacy-policy",
  "/cookie-policy",
  "/terms",
  "/gdpr",
];

export default function sitemap(): MetadataRoute.Sitemap {

  const core = ROUTES.map((r) => ({
    url: `${site.url}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const servicePages = services.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    changeFrequency: "monthly" as ChangeFreq,
    priority: SERVICE_PRIORITY,
  }));

  const areaPages = areas.map((a) => ({
    url: `${site.url}/areas/${a.slug}`,
    changeFrequency: "monthly" as ChangeFreq,
    priority: AREA_PRIORITY,
  }));

  const guidePages = guides.map((g) => ({
    url: `${site.url}/guides/${g.slug}`,
    // Use the guide's own lastUpdated so Google sees real revisions.
    lastModified: new Date(g.lastUpdated),
    changeFrequency: "monthly" as ChangeFreq,
    priority: GUIDE_PRIORITY,
  }));

  // Only projects with a slug AND detail block become routes â€” see
  // src/app/projects/[slug]/page.tsx. Filter mirrors generateStaticParams.
  const projectPages = projects
    .filter((p) => p.slug && p.detail)
    .map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
        changeFrequency: "monthly" as ChangeFreq,
      priority: PROJECT_PRIORITY,
    }));

  const legalPages = LEGAL_PATHS.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "yearly" as ChangeFreq,
    priority: LEGAL_PRIORITY,
  }));

  return [
    ...core,
    ...servicePages,
    ...areaPages,
    ...guidePages,
    ...projectPages,
    ...legalPages,
  ];
}
