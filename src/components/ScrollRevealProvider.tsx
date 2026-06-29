"use client";

import { useEffect } from "react";

export default function ScrollRevealProvider() {
  useEffect(() => {
    const selector = [
      ".section-reveal",
      ".section-reveal-delay-1",
      ".section-reveal-delay-2",
      ".section-reveal-delay-3",
      ".card-animated",
      ".table-row-animated",
      ".stagger-list > *",
    ].join(",");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = new WeakSet<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16,
      }
    );

    const observeElements = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
      elements.forEach((element) => {
        if (element.closest("[data-no-scroll-reveal]")) return;
        if (seen.has(element)) return;
        seen.add(element);
        if (reducedMotion) {
          element.classList.add("is-visible");
          return;
        }
        observer.observe(element);
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
