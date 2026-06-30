"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedSectionTitleProps = {
  text: string;
  className?: string;
  level?: 1 | 2 | 3;
  disableGradient?: boolean;
};

export default function AnimatedSectionTitle({ text, className = "", level = 2, disableGradient = false }: AnimatedSectionTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [display, setDisplay] = useState("");
  const [typing, setTyping] = useState(false);
  const Tag = `h${level}` as "h1" | "h2" | "h3";

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const timeout = window.setTimeout(() => setDisplay(text), 0);
      return () => window.clearTimeout(timeout);
    }

    let index = 0;
    let timeout = 0;
    let started = false;

    const type = () => {
      index += 1;
      setDisplay(text.slice(0, index));
      if (index < text.length) {
        timeout = window.setTimeout(type, text[index - 1] === " " ? 28 : 42);
      } else {
        setTyping(false);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        setTyping(true);
        timeout = window.setTimeout(type, 120);
        observer.disconnect();
      },
      { threshold: 0.45 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [text]);

  return (
    <Tag
      ref={ref}
      className={`typing-section-title ${disableGradient ? "" : "section-title"} ${className}`}
      style={{ fontFamily: "Orbitron, sans-serif" }}
      aria-label={text}
    >
      <span aria-hidden="true">{display || "\u00A0"}</span>
      <span className={`typing-caret ${typing ? "is-typing" : ""}`} aria-hidden="true" />
    </Tag>
  );
}
