"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        padding: "0 64px",
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: scrolled ? "0 4px 24px rgba(15,76,129,.08)" : "0 1px 3px rgba(0,0,0,.06)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
        <div style={{
          width: "42px", height: "42px",
          background: "linear-gradient(135deg,#0F4C81,#14B8A6)",
          borderRadius: "11px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 900, fontSize: "19px", fontStyle: "italic",
          boxShadow: "0 4px 12px rgba(15,76,129,.25)",
        }}>M</div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontSize: "19px", fontWeight: 800, color: "#0F4C81", letterSpacing: "-0.5px" }}>
            Medic<span style={{ color: "#14B8A6" }}>xus</span>
          </span>
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "2px", color: "#94A3B8", textTransform: "uppercase" }}>
            Group
          </span>
        </div>
      </Link>

      {/* Desktop Nav Links */}
      <ul style={{ display: "flex", alignItems: "center", gap: "8px", listStyle: "none", margin: 0, padding: 0 }}
        className="hidden-mobile">
        {[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Divisions", href: "/#divisions" },
          { label: "Services", href: "/#services" },
          { label: "Careers", href: "/careers" },
        ].map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              style={{
                textDecoration: "none", color: "#475569", fontSize: "14px", fontWeight: 500,
                padding: "8px 14px", borderRadius: "8px", transition: "all .2s", display: "block",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = "#0F4C81";
                (e.target as HTMLElement).style.background = "#EFF6FF";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = "#475569";
                (e.target as HTMLElement).style.background = "transparent";
              }}
            >{item.label}</Link>
          </li>
        ))}
        <li>
          <Link
            href="/login"
            style={{
              border: "1.5px solid #0F4C81", color: "#0F4C81",
              background: "transparent",
              padding: "9px 20px", borderRadius: "10px",
              fontWeight: 600, fontSize: "14px", textDecoration: "none",
              transition: "all .2s", display: "block",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = "#EFF6FF";
              (e.target as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
              (e.target as HTMLElement).style.transform = "translateY(0)";
            }}
          >Login</Link>
        </li>
        <li>
          <Link
            href="/contact"
            style={{
              background: "#0F4C81", color: "#fff",
              padding: "10px 22px", borderRadius: "10px",
              fontWeight: 600, fontSize: "14px", textDecoration: "none",
              boxShadow: "0 4px 12px rgba(15,76,129,.3)",
              transition: "all .2s", display: "block",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = "#0a3a65";
              (e.target as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "#0F4C81";
              (e.target as HTMLElement).style.transform = "translateY(0)";
            }}
          >Get in Touch →</Link>
        </li>
      </ul>

      <style>{`
        @media(max-width:900px){
          nav { padding: 0 24px !important; }
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
