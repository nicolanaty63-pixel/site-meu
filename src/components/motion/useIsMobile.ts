"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe viewport check used to dial animation intensity down on phones
 * (lighter travel, no scroll-linked parallax, no blur filters) so motion stays
 * buttery on low-power devices. Defaults to the Tailwind `md` breakpoint.
 */
export function useIsMobile(query = "(max-width: 767px)") {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return isMobile;
}
