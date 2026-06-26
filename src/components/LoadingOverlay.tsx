"use client";
import React from "react";

export default function LoadingOverlay() {
  return (
    <div style={overlayStyle}>
      <div style={spinnerStyle} />
      <div style={textStyle}>Medicxus Group</div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  zIndex: 9999,
};

const spinnerStyle: React.CSSProperties = {
  width: "48px",
  height: "48px",
  border: "4px solid rgba(255,255,255,0.2)",
  borderTopColor: "#14B8A6",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const textStyle: React.CSSProperties = {
  marginTop: "16px",
  fontSize: "1.2rem",
  fontWeight: 600,
};

// Add keyframes for spin animation
const styleSheet = typeof document !== "undefined" ? document.styleSheets[0] : null;
if (styleSheet) {
  const keyframes = `@keyframes spin { to { transform: rotate(360deg); } }`;
  // @ts-ignore
  styleSheet?.insertRule(keyframes, styleSheet?.cssRules.length);
}
