import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className }, ref) => (
    <div ref={ref} className={cn("container-max", className)}>
      {children}
    </div>
  )
);

Container.displayName = "Container";
