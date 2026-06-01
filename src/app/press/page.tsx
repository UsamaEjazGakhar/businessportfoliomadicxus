"use client";

import Navbar from "@/components/main/navbar";
import Footer from "@/components/main/footer";

const PRESS_RELEASES = [
  {
    date: "June 01, 2026",
    category: "Product Launch",
    title: "Medicxus Group Introduces AI-Driven Hospital Analytics Suite",
    desc: "Our IT Services division launches a fully integrated diagnostic reporting engine, cutting hospital clinical entry times by up to 40% with predictive charting.",
  },
  {
    date: "April 18, 2026",
    category: "Academic Partnership",
    title: "Medicxus Expands European MBBS Footprint with 4 New Universities",
    desc: "Establishing elite bilateral student transfers and fully-accredited residency pathways in Spain, Italy, and Poland starting Fall 2026.",
  },
  {
    date: "February 09, 2026",
    category: "Corporate Milestone",
    title: "Medicxus Diagnostics Reaches 1 Million Completed Patient Reports",
    desc: "Celebrating a milestone of trust and exceptional reliability, supported by our regional labs and automated high-throughput chemistry instrumentation.",
  },
];

export default function PressPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #0B1220 0%, #0F2D4F 100%)",
        padding: "120px 64px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <p style={{
            fontSize: "13px", fontWeight: 700, letterSpacing: "3px",
            color: "#14B8A6", textTransform: "uppercase", marginBottom: "16px"
          }}>Press & Media</p>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: "#fff",
            letterSpacing: "-1.5px", lineHeight: 1.15, marginBottom: "20px"
          }}>
            Company News &<br />
            <span style={{
              background: "linear-gradient(135deg, #14B8A6, #60A5FA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Official Announcements</span>
          </h1>
          <p style={{
            fontSize: "17px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7,
            maxWidth: "640px", margin: "0 auto"
          }}>
            Stay up to date with the latest innovations, expansion updates, and official press releases from the Medicxus Group ecosystem.
          </p>
        </div>
      </section>

      {/* Press Releases Grid */}
      <section style={{ padding: "100px 64px", background: "#fff" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {PRESS_RELEASES.map((pr, index) => (
              <div key={index} style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                gap: "40px",
                borderBottom: "1px solid #E2E8F0",
                paddingBottom: "40px",
              }}
              className="press-row"
              >
                <div>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#64748B", display: "block", marginBottom: "8px" }}>
                    {pr.date}
                  </span>
                  <span style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "#14B8A6",
                    background: "rgba(20,184,166,0.08)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    display: "inline-block"
                  }}>
                    {pr.category}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginBottom: "12px", lineHeight: 1.3 }}>
                    {pr.title}
                  </h3>
                  <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, margin: "0 0 16px" }}>
                    {pr.desc}
                  </p>
                  <button
                    type="button"
                    style={{
                      background: "none", border: "none", color: "#0F4C81", fontWeight: 700,
                      fontSize: "14px", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "6px"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#14B8A6"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#0F4C81"}
                  >
                    Read Press Release →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit Download */}
      <section style={{ padding: "100px 64px", background: "#F8FAFC" }}>
        <div style={{
          maxWidth: "1000px", margin: "0 auto", background: "linear-gradient(135deg, #0F4C81, #0a2f52)",
          borderRadius: "24px", padding: "64px", color: "#fff", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "60px",
          alignItems: "center", boxShadow: "0 20px 40px rgba(15,76,129,0.15)"
        }}
        className="kit-grid"
        >
          <div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "16px" }}>
              Looking for our Media Kit?
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: "32px" }}>
              Download our high-resolution brand assets, corporate logos, vector guidelines, official colors, and verified executive headshots for publishing.
            </p>
            <button
              type="button"
              style={{
                background: "#14B8A6", color: "#fff", border: "none", borderRadius: "10px",
                padding: "14px 28px", fontWeight: 700, fontSize: "14px", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(20,184,166,0.3)", transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#0d9488"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#14B8A6"}
            >
              Download Press Kit (ZIP, 45MB)
            </button>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "18px", padding: "32px", backdropFilter: "blur(10px)"
          }}>
            <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#14B8A6", marginBottom: "14px" }}>Media Contacts</h4>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: "20px" }}>
              For PR inquiries, interview requests with executive directors, or corporate statements, please email our media office.
            </p>
            <div style={{ fontSize: "14px" }}>
              <span style={{ display: "block", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>Email</span>
              <strong>press@medicxus.com</strong>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:850px){
          .press-row { grid-template-columns: 1fr !important; gap: 16px !important; }
          .kit-grid { grid-template-columns: 1fr !important; padding: 40px !important; gap: 40px !important; }
        }
      `}</style>

      <Footer />
    </>
  );
}
