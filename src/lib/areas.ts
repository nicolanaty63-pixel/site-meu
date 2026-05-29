// Local SEO landing-page data. Each area generates /areas/[slug].

export type Area = {
  slug: string;
  name: string;
  county: string;
  intro: string;
  nearby: string[];
};

export const areas: Area[] = [
  {
    slug: "kings-langley",
    name: "Kings Langley",
    county: "Hertfordshire",
    intro:
      "As our home town, Kings Langley is where it all started. We're proud to be the local builders Kings Langley homeowners turn to for bathrooms, kitchens, tiling and flooring finished to a premium standard.",
    nearby: ["Watford", "Hemel Hempstead", "Berkhamsted"],
  },
  {
    slug: "watford",
    name: "Watford",
    county: "Hertfordshire",
    intro:
      "Looking for trusted builders in Watford? We deliver premium bathroom and kitchen renovations, tiling and flooring across Watford and the surrounding area — reliable, tidy and rated 4.9/5.",
    nearby: ["Rickmansworth", "Kings Langley", "Hemel Hempstead"],
  },
  {
    slug: "st-albans",
    name: "St Albans",
    county: "Hertfordshire",
    intro:
      "Premium renovation specialists serving St Albans. From spa-style bathrooms to bespoke kitchens and flawless flooring, we bring craftsmanship and reliability to every St Albans home.",
    nearby: ["Hemel Hempstead", "Watford", "Kings Langley"],
  },
  {
    slug: "hemel-hempstead",
    name: "Hemel Hempstead",
    county: "Hertfordshire",
    intro:
      "Your local builders in Hemel Hempstead for bathroom and kitchen renovations, tiling, laminate and flooring installation. Clean, punctual and finished to the highest standard.",
    nearby: ["Berkhamsted", "Kings Langley", "St Albans"],
  },
  {
    slug: "rickmansworth",
    name: "Rickmansworth",
    county: "Hertfordshire",
    intro:
      "Renovation and building specialists in Rickmansworth. We transform bathrooms, kitchens and floors with premium materials and meticulous attention to detail.",
    nearby: ["Watford", "Kings Langley", "North London"],
  },
  {
    slug: "berkhamsted",
    name: "Berkhamsted",
    county: "Hertfordshire",
    intro:
      "Trusted builders in Berkhamsted delivering luxury bathrooms, kitchens, tiling and flooring. Honest advice, reliable scheduling and a flawless finish every time.",
    nearby: ["Hemel Hempstead", "Kings Langley", "Watford"],
  },
  {
    slug: "bushey",
    name: "Bushey",
    county: "Hertfordshire",
    intro:
      "Trusted builders in Bushey delivering premium bathroom and kitchen renovations, precision tiling and flooring installation. Tidy, punctual and finished to the highest standard — rated 4.9/5.",
    nearby: ["Watford", "Radlett", "Rickmansworth"],
  },
  {
    slug: "harpenden",
    name: "Harpenden",
    county: "Hertfordshire",
    intro:
      "Premium renovation specialists in Harpenden. Bespoke kitchens, spa-style bathrooms, large-format tiling and engineered flooring — delivered cleanly, on schedule, and built to last.",
    nearby: ["St Albans", "Hemel Hempstead", "Radlett"],
  },
  {
    slug: "radlett",
    name: "Radlett",
    county: "Hertfordshire",
    intro:
      "Luxury home renovations in Radlett — bathrooms, kitchens, tiling, flooring and full refurbishments. Honest advice, clean work and a flawless premium finish, rated 4.9/5 by Hertfordshire homeowners.",
    nearby: ["Bushey", "St Albans", "Harpenden"],
  },
  {
    slug: "north-london",
    name: "North London",
    county: "London",
    intro:
      "Premium builders and flooring contractors covering North London. Bathroom and kitchen renovation specialists, expert tiling and flooring installation — rated 4.9/5 by homeowners.",
    nearby: ["Watford", "Rickmansworth", "St Albans"],
  },
];

export function getArea(slug: string) {
  return areas.find((a) => a.slug === slug);
}
