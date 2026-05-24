# Project photos

Drop real (or licensed) photos in this folder, then point each project to them
in `src/lib/data.ts`. Until you do, the gallery shows polished placeholders —
nothing breaks.

## How to enable a photo

In `src/lib/data.ts`, add image fields to a project:

```ts
{
  title: "Spa-Style Master Bathroom",
  // ...existing fields...
  image: "/projects/spa-bathroom.webp",        // card thumbnail (≈4:3)
  beforeImage: "/projects/spa-bathroom-before.webp", // modal slider (≈16:9)
  afterImage: "/projects/spa-bathroom-after.webp",   // modal slider (≈16:9)
}
```

You can also paste a **licensed Unsplash/Pexels URL** instead of a local path —
those CDNs are already whitelisted in `next.config.mjs`.

## Recommended specs
- **Format:** `.webp` (or `.jpg`). Sized ~1600px on the long edge, < 300 KB each.
- **Card image (`image`):** roughly **4:3**.
- **Before/after (`beforeImage` / `afterImage`):** roughly **16:9**, shot from the
  **same position, lens and height** so the slider lines up.
- Natural colour, no heavy filters (see `PHOTOGRAPHY-BRIEF.md`).

## Suggested filenames (match the 9 portfolio projects)

| Project | Card | Before / After |
|---|---|---|
| Spa-Style Master Bathroom | `spa-bathroom.webp` | `spa-bathroom-before.webp` / `-after.webp` |
| Modern Shaker Kitchen | `shaker-kitchen.webp` | `shaker-kitchen-before/-after.webp` |
| Herringbone Oak Hallway | `herringbone-hallway.webp` | `herringbone-hallway-before/-after.webp` |
| Natural Stone Wet Room | `stone-wet-room.webp` | `stone-wet-room-before/-after.webp` |
| Open-Plan Ground Floor | `open-plan.webp` | `open-plan-before/-after.webp` |
| Zellige Feature Splashback | `zellige-splashback.webp` | `zellige-splashback-before/-after.webp` |
| Warm Laminate Living Space | `laminate-living.webp` | `laminate-living-before/-after.webp` |
| Minimalist Guest Bathroom | `guest-bathroom.webp` | `guest-bathroom-before/-after.webp` |
| Luxury Kitchen Diner | `kitchen-diner.webp` | `kitchen-diner-before/-after.webp` |

Always add descriptive `alt` text via the project `title` (handled automatically).
