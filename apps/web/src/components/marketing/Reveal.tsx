"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const hidden = { opacity: 0, y: 24, filter: "blur(8px)" };
const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  // Always render the same element so hydration matches the server's hidden style.
  // With reduced motion, snap to visible on mount (swapping to a plain div would leave
  // the server's inline `opacity: 0` in place and hide the content).
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={reduce ? shown : undefined}
      whileInView={shown}
      viewport={{ once: true, margin: "-80px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
