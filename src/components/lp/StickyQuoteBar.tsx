"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";

// Mobile-only sticky CTA. Sits to the left of the floating WhatsApp button.
export default function StickyQuoteBar() {
  return (
    <motion.a
      href="#quote"
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-5 left-4 right-24 z-50 flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3.5 font-bold text-ink shadow-[0_10px_30px_rgba(200,162,76,0.4)] lg:hidden"
    >
      Get my free quote
      <Icon name="arrow" className="h-4 w-4" />
    </motion.a>
  );
}
