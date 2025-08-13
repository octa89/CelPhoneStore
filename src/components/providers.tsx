"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig, AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </MotionConfig>
    </ThemeProvider>
  );
}
