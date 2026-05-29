import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// PWA manifest — drives "Add to Home Screen" + Android install UI.
// Sourced from the central site config so name/colours stay in sync.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0e13", // brand ink
    theme_color: "#0b0e13",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
