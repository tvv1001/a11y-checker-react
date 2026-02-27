"use client";

import { ReactNode, useState } from "react";

interface StyledTooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export function StyledTooltip({
  content,
  children,
  className = "",
}: StyledTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.top - 10,
      left: rect.left + rect.width / 2,
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      className={`styled-tooltip-wrapper ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className="styled-tooltip-popup"
          style={{
            position: "fixed",
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: "translateX(-50%) translateY(-100%)",
            zIndex: 9999,
          }}
        >
          <div className="styled-tooltip-content">{content}</div>
          <div className="styled-tooltip-arrow" />
        </div>
      )}
    </div>
  );
}
