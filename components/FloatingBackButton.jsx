import React, { useState } from "react";

const FloatingBackButton = ({ onBack, show }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!show) return null;

  return (
    <button
      onClick={onBack}
      type="button"
      aria-label="Go back"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "fixed",
        left: "24px",
        top: "90px",
        zIndex: 100,
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "#ffffff",
        border: "none",
        boxShadow: isHovered 
          ? "0 8px 20px rgba(0,0,0,0.12)" 
          : "0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#3b82f6",
        cursor: "pointer",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    </button>
  );
};

export default FloatingBackButton;
