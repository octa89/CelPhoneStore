"use client";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { useRef, useState } from "react";

/** Magnetic CTA button */
export function MagneticButton({
  children,
  className,
  ...props
}: HTMLMotionProps<"button"> & { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 150, damping: 12 });
  const y = useSpring(my, { stiffness: 150, damping: 12 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mx.set(dx * 0.3);
        my.set(dy * 0.3);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
        setHover(false);
      }}
      onMouseEnter={() => setHover(true)}
      style={{ x, y }}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl px-6 py-3",
        "glass ringed font-medium transition-transform",
        hover ? "scale-[1.03]" : "scale-100",
        className
      )}
      {...props}
    >
      {children}
      <span className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}

/** Small circular count badge used in the navbar cart */
export function Badge({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(
      "ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-white/10 px-2 py-[2px] text-xs",
      className
    )}>
      {children}
    </span>
  );
}
