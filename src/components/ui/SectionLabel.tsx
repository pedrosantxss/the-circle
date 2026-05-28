"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: string;
  number?: string;
  className?: string;
}

export function SectionLabel({ children, number, className }: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("label-tag", className)}
    >
      {number && (
        <span className="text-ghost font-mono">{number}</span>
      )}
      <span className="line-accent" />
      <span>{children}</span>
    </motion.div>
  );
}
