"use client";

import Navbar from "@/components/main/navbar";
import Footer from "@/components/main/footer";
import ContactForm from "@/components/main/contact-form";

export default function ContactPage() {
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
          position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px",
          background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <p style={{
            fontSize: "13px", fontWeight: 700, letterSpacing: "3px",
            color: "#14B8A6", textTransform: "uppercase", marginBottom: "16px"
          }}>Get In Touch</p>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: "#fff",
            letterSpacing: "-1.5px", lineHeight: 1.15, marginBottom: "20px"
          }}>
            Connecting People,<br />
            <span style={{
              background: "linear-gradient(135deg, #14B8A6, #60A5FA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Healing Ecosystems</span>
          </h1>
          <p style={{
            fontSize: "17px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7,
            maxWidth: "640px", margin: "0 auto"
          }}>
            Have questions about clinical diagnostics, international medical education, HMS tools, or partner collaborations? Write to us below.
          </p>
        </div>
      </section>

      {/* Main Grid Contact Section */}
      <section style={{ padding: "100px 64px", background: "#fff" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", display: "grid",
          gridTemplateColumns: "1.1fr 1fr", gap: "80px", alignItems: "start"
        }}
        className="contact-grid"
        >
          {/* Left Column: Direct Coordinates */}
          <div>
            <span style={{
              fontSize: "12px", fontWeight: 700, letterSpacing: "2px",
              color: "#0F4C81", textTransform: "uppercase", display: "block", marginBottom: "12px"
            }}>Corporate Offices</span>
            <h2 style={{
              fontSize: "32px", fontWeight: 800, color: "#0F172A",
              letterSpacing: "-1.5px", marginBottom: "36px", lineHeight: 1.25
            }}>
              Direct Corporate Support Channels
            </h2>

            {/* Headquarters details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "28px" }}>🏢</span>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Lahore Headquarters</h4>
                  <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                    Level 5, Sovereign Blue Towers, Phase 5 DHA,<br />
                    Lahore, Punjab 54000, Pakistan
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "28px" }}>📞</span>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Phone Inquiry Lines</h4>
                  <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                    Support: +92 (42) 111-999-888<br />
                    International Student Desk: +92 (300) 123-4567
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "28px" }}>✉️</span>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Digital Support</h4>
                  <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                    General: info@medicxus.com<br />
                    IT & Software: customercare@medicxus.com
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "28px" }}>⏰</span>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>Corporate Hours</h4>
                  <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                    Monday – Friday: 09:00 AM – 06:00 PM<br />
                    Saturday – Sunday: Closed (Emergency clinical labs open 24/7)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "24px",
            padding: "48px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.02)"
          }}
          className="form-wrapper"
          >
            <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", marginBottom: "8px" }}>Send a Message</h3>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "32px", lineHeight: 1.6 }}>
              Fill out the form below and one of our segment advisors will get back to you within 24 hours.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){
          .contact-grid { grid-template-columns: 1fr !important; gap: 60px !important; }
          .form-wrapper { padding: 32px !important; }
        }
      `}</style>

      <Footer />
    </>
  );
}
