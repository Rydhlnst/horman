"use client";

// After Watermelon UI "announcement-1" (MIT): a thin bar over the navbar with a
// badge, one line and a link whose underline draws in. Closing it lasts for the tab.

import { ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "horman.announce.closed";

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) {
        const t = setTimeout(() => setOpen(false));
        return () => clearTimeout(t);
      }
    } catch {
      /* storage blocked: the bar just stays */
    }
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage blocked */
    }
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          className="announce-bar"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="announce-bar-row">
            <span className="announce-bar-badge">Wave 1</span>
            <p className="min-w-0 truncate">Horman opens in waves, and the first invites go out soon.</p>
            <Link href="/access" className="announce-bar-link group">
              Join the list <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <button type="button" className="announce-bar-close" onClick={close} aria-label="Close announcement">
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
