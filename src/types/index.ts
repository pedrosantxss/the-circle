export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

export interface ScrollState {
  progress: number; // 0 to 1
  direction: "up" | "down";
  velocity: number;
}

export interface SectionProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export interface AnimationVariants {
  hidden: object;
  visible: object;
  exit?: object;
}
