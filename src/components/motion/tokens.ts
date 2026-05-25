// Shared motion tokens — one cohesive feel across the whole site.
// EASE_OUT is an easeOutExpo-style curve: a confident, cinematic settle used
// by high-end studio / Awwwards sites. EASE_IN_OUT for symmetric moves.
export const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as [number, number, number, number];

export const DURATION = {
  fast: 0.45,
  base: 0.8,
  slow: 1.1,
} as const;

// Default viewport trigger for scroll reveals (slightly early, once only).
export const VIEWPORT = { once: true, margin: "-80px" } as const;
