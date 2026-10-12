"use client";

import { useEffect, useState } from "react";

type ScrollToTopProps = {
  /** Scroll distance (px) before the button appears. */
  threshold?: number;
  className?: string;
};

export default function ScrollToTop({
  threshold = 300,
  className = "",
}: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);

    onScroll(); // sync on mount (e.g. restored scroll position)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={[
        "fixed right-0 bottom-6 z-50 grid size-10 place-items-center",
        "rounded-tl-sm rounded-tr-2xl rounded-br-sm rounded-bl-2xl",
        "bg-linear-to-b from-blue-600 to-blue-800 text-white shadow-lg",
        "transition-all duration-300 ease-out",
        "hover:from-blue-500 hover:to-blue-700 hover:shadow-xl",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
        className,
      ].join(" ")}
    >
      {/* Double chevron up */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden="true"
      >
        <path d="m6 11 6-6 6 6" />
        <path d="m6 19 6-6 6 6" />
      </svg>
    </button>
  );
}