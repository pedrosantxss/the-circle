"use client";

import { useState, useEffect, useCallback } from "react";
import type { MousePosition } from "@/types";

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const normalizedX = (x / window.innerWidth) * 2 - 1;
    const normalizedY = -((y / window.innerHeight) * 2 - 1);

    setPosition({ x, y, normalizedX, normalizedY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return position;
}
