"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import Icon from "@/components/ui/Icon";

export default function WhatsAppButton() {
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    "Hi Nicolla Contractors, I'd like a quote for a project."
  )}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-sm font-semibold text-[#062b14] shadow-[0_8px_30px_rgba(37,211,102,0.35)]"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 16 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative grid h-7 w-7 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
        <Icon name="whatsapp" className="relative h-7 w-7" />
      </span>
      <span className="hidden sm:inline">WhatsApp us</span>
    </motion.a>
  );
}
