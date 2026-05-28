"use client";

import { useState, useEffect, useRef } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;

      setDirection(scrollTop > lastScrollY.current ? "down" : "up");
      setProgress(scrollProgress);
      lastScrollY.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { progress, direction };
}
