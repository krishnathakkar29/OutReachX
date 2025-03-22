"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const beamsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (beamsRef.current) {
        const rect = beamsRef.current.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={beamsRef}
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `
            radial-gradient(600px circle at ${mousePosition.x}px ${
            mousePosition.y
          }px, rgba(99, 102, 241, 0.15), transparent 40%),
            radial-gradient(800px circle at ${mousePosition.x - 200}px ${
            mousePosition.y + 200
          }px, rgba(99, 102, 241, 0.1), transparent 40%),
            radial-gradient(600px circle at ${mousePosition.x + 300}px ${
            mousePosition.y - 300
          }px, rgba(34, 197, 94, 0.1), transparent 40%)
          `,
        }}
      />
    </div>
  );
};
