"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header style={headerStyle}>
      <div style={logoContainerStyle}>
        <div style={logoStyle}>M</div>
        <h1 style={titleStyle}>Medic<span style={highlightStyle}>xus</span> Group</h1>
      </div>
      {status === "authenticated" && (
        <div style={userInfoStyle}>
          <span style={userNameStyle}>{session?.user?.name || session?.user?.email}</span>
          <button onClick={handleSignOut} style={signOutButtonStyle}>Sign Out</button>
        </div>
      )}
    </header>
  );
}

// Inline styling matching the project's design system
const headerStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px 24px",
  background: "rgba(255,255,255,.04)",
  borderBottom: "1px solid rgba(255,255,255,.1)",
  backdropFilter: "blur(12px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const logoContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const logoStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  background: "linear-gradient(135deg,#0F4C81,#14B8A6)",
  borderRadius: "10px",
  color: "#fff",
  fontWeight: 900,
  fontSize: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 800,
  color: "#fff",
  margin: 0,
};

const highlightStyle: React.CSSProperties = {
  color: "#14B8A6",
};

const userInfoStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const userNameStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.85)",
  fontSize: "14px",
};

const signOutButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  background: "linear-gradient(135deg,#F59E0B,#D97706)",
  color: "#0B1220",
  border: "none",
  borderRadius: "6px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background .2s",
};
