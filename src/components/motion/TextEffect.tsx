"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { motionDurations } from "@/lib/motion";

type TextEffectProps = {
  children: string;
  className?: string;
  /** Animate per word or per character. */
  per?: "word" | "char";
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  id?: string;
};

/**
 * Staggered text reveal (21st.dev / Motion Primitives style).
 */
export function TextEffect({
  children,
  className = "",
  per = "word",
  delay = 0,
  as: Tag = "p",
  id,
}: TextEffectProps) {
  const reducedMotion = useReducedMotion();
  const parts =
    per === "char"
      ? Array.from(children)
      : children.split(/(\s+)/).filter((part) => part.length > 0);

  if (reducedMotion) {
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[Tag];

  return (
    <MotionTag id={id} className={className} aria-label={children}>
      {parts.map((part, index) => {
        const isSpace = /^\s+$/.test(part);
        if (isSpace) {
          return <span key={`s-${index}`}>{part}</span>;
        }
        return (
          <span key={`${part}-${index}`} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                duration: motionDurations.slow,
                delay: delay + index * (per === "char" ? 0.02 : 0.045),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {part}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
