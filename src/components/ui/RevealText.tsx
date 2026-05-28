"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  splitBy?: "words" | "chars" | "lines";
  trigger?: "scroll" | "mount";
}

export function RevealText({
  children,
  className,
  delay = 0,
  as: Tag = "h2",
  splitBy = "words",
  trigger = "scroll",
}: RevealTextProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const text = children;
    const units = splitBy === "chars"
      ? text.split("")
      : splitBy === "words"
        ? text.split(" ")
        : [text];

    el.innerHTML = units
      .map((unit) =>
        `<span class="reveal-unit" style="display:inline-block; overflow:hidden; vertical-align:bottom; ${splitBy === 'words' ? 'margin-right: 0.25em;' : ''}">` +
        `<span class="reveal-inner" style="display:inline-block; transform:translateY(110%);">${unit === " " ? "&nbsp;" : unit}</span>` +
        `</span>`
      )
      .join("");

    const inners = el.querySelectorAll(".reveal-inner");

    const anim = gsap.to(inners, {
      y: "0%",
      duration: 1,
      ease: "power4.out",
      stagger: 0.04,
      delay,
      paused: trigger === "scroll",
    });

    if (trigger === "scroll") {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => anim.play(),
      });
    } else {
      anim.play();
    }

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [children, delay, splitBy, trigger]);

  return <Tag ref={ref} className={cn(className)} />;
}
