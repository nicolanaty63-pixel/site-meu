import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Builds consistent, per-page metadata: page <title> (the layout template adds
 * the brand suffix), a unique meta description, the correct canonical, and
 * fully populated OpenGraph + Twitter tags with a page-specific og:url and the
 * shared social card. Use on every route so social previews and canonicals are
 * unique and correct rather than inheriting the layout's generic defaults.
 */
export function pageMeta({
  title,
  description,
  path,
  ogTitle,
}: {
  /** Page title without the brand suffix (template appends "| Nicolla Contractors Ltd"). */
  title: string;
  description: string;
  /** Absolute path beginning with "/" (e.g. "/about"). Use "/" for home. */
  path: string;
  /** Optional full OG/Twitter title; defaults to "<title> | <brand>". */
  ogTitle?: string;
}): Metadata {
  const url = path === "/" ? site.url : `${site.url}${path}`;
  const socialTitle = ogTitle ?? `${title} | ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url,
      siteName: site.name,
      title: socialTitle,
      description,
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: `${site.name} — premium building & renovation`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/og.jpg"],
    },
  };
}
