"use client";

import Navbar from "@/components/main/navbar";
import Footer from "@/components/main/footer";

const VALUES = [
  { icon: "💡", title: "Technology-First", desc: "Driving medical efficiency via AI-powered Hospital Management Systems and streamlined Lab tools." },
  { icon: "🌍", title: "Global Vision", desc: "Enabling students to pursue quality medical education globally through trusted MBBS partnerships." },
  { icon: "🛡️", title: "Uncompromising Quality", desc: "Setting the gold standard in diagnostic accuracy and compassionate clinical care." },
  { icon: "🤝", title: "Empathetic Partnership", desc: "Unifying patients, students, institutions, and builders for collective well-being." },
];

const LEADERSHIP = [
  { name: "Dr. Farhan Qureshi", role: "Founder & Chief Executive Officer", bio: "A visionary medical pioneer dedicated to integrating Next-Gen diagnostics with clinical excellence.", avatar: "👨‍⚕️" },
  { name: "Sarah Jenkins", role: "Chief Technology Officer", bio: "Leading our healthcare IT software solutions to empower digital transformation in South Asia.", avatar: "👩‍💻" },
  { name: "Prof. Asif Ali", role: "Dean of Global Education", bio: "Architecting paths for students to succeed at the world's most prestigious medical universities.", avatar: "👨‍🏫" },
];

export default function AboutPage() {
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
        {/* Glow orbs */}
        <div style={{
          position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-150px", left: "10%", width: "350px", height: "350px",
          background: "radial-gradient(circle, rgba(15,76,129,0.2) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <p style={{
            fontSize: "13px", fontWeight: 700, letterSpacing: "3px",
            color: "#14B8A6", textTransform: "uppercase", marginBottom: "16px"
          }}>About Medicxus Group</p>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 900, color: "#fff",
            letterSpacing: "-1.5px", lineHeight: 1.15, marginBottom: "20px"
          }}>
            Empowering Healthcare.<br />
            <span style={{
              background: "linear-gradient(135deg, #14B8A6, #60A5FA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Transforming Human Lives.</span>
          </h1>
          <p style={{
            fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7,
            maxWidth: "680px", margin: "0 auto 36px"
          }}>
            We are a highly diversified healthcare technology conglomerate uniting clinical diagnostics, medical academic programs, global student consultancy, and modern hospital management solutions.
          </p>
        </div>
      </section>

      {/* Story & Legacy Section */}
      <section style={{ padding: "100px 64px", background: "#ffffff" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto", display: "grid",
          gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center"
        }}>
          <div>
            <span style={{
              fontSize: "12px", fontWeight: 700, letterSpacing: "2px",
              color: "#0F4C81", textTransform: "uppercase", display: "block", marginBottom: "12px"
            }}>Our Legacy</span>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 800, color: "#0F172A",
              letterSpacing: "-1px", lineHeight: 1.25, marginBottom: "24px"
            }}>
              Unifying Clinical Excellence with Cutting-Edge Digital Software
            </h2>
            <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.8, marginBottom: "20px" }}>
              Founded with the goal of bridging critical gaps in healthcare systems, Medicxus Group has grown from a specialized laboratory network into a comprehensive ecosystem of healthcare, digital tools, and academic opportunities.
            </p>
            <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.8, marginBottom: "32px" }}>
              Today, our platforms serve thousands of diagnostics patients daily, support major healthcare organizations with robust HMS tools, and connect hundreds of aspiring doctors to fully certified medical universities worldwide.
            </p>
            <div style={{ display: "flex", gap: "24px" }}>
              <div>
                <span style={{ fontSize: "36px", fontWeight: 800, color: "#0F4C81", display: "block" }}>99.9%</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748B" }}>Diagnostic Accuracy</span>
              </div>
              <div style={{ borderLeft: "2px solid #E2E8F0", paddingLeft: "24px" }}>
                <span style={{ fontSize: "36px", fontWeight: 800, color: "#14B8A6", display: "block" }}>15k+</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#64748B" }}>Students Consulted</span>
              </div>
            </div>
          </div>

          {/* Graphical Frame */}
          <div style={{
            background: "linear-gradient(135deg, #EFF6FF 0%, #E0F2FE 100%)",
            border: "1px solid #CFE2FE",
            borderRadius: "24px",
            padding: "48px",
            position: "relative",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px solid #E2E8F0",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(15,76,129,0.05)",
              marginBottom: "20px",
              transform: "rotate(-1deg)"
            }}>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0F4C81", marginBottom: "8px" }}>Our Core Mission</h4>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>
                To transform and democratize global healthcare access through scalable, user-centric technology and world-class educational pathways.
              </p>
            </div>
            
            <div style={{
              background: "#0F4C81",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(15,76,129,0.15)",
              color: "#fff",
              transform: "rotate(1deg)",
              alignSelf: "flex-end",
              maxWidth: "90%",
            }}>
              <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#14B8A6", marginBottom: "8px" }}>Our Five-Year Vision</h4>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, margin: 0 }}>
                Establishing South Asia&apos;s most integrated and trusted hospital intelligence ecosystem, serving over 10 million patients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section style={{ padding: "100px 64px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{
              fontSize: "12px", fontWeight: 700, letterSpacing: "2px",
              color: "#14B8A6", textTransform: "uppercase", display: "block", marginBottom: "12px"
            }}>Our Principles</span>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 800, color: "#0F172A",
              letterSpacing: "-1px"
            }}>Values that Define Us</h2>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px"
          }}>
            {VALUES.map((val) => (
              <div key={val.title} style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: "18px",
                padding: "32px",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)"
              }}
              className="val-card"
              >
                <div style={{ fontSize: "36px", marginBottom: "20px" }}>{val.icon}</div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>{val.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, margin: 0 }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section style={{ padding: "100px 64px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{
              fontSize: "12px", fontWeight: 700, letterSpacing: "2px",
              color: "#0F4C81", textTransform: "uppercase", display: "block", marginBottom: "12px"
            }}>Leadership</span>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 800, color: "#0F172A",
              letterSpacing: "-1px"
            }}>Meet the Innovators</h2>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px"
          }}>
            {LEADERSHIP.map((lead) => (
              <div key={lead.name} style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "20px",
                padding: "40px 32px",
                textAlign: "center",
                transition: "all 0.3s ease"
              }}>
                <div style={{
                  width: "80px", height: "80px", background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                  borderRadius: "50%", margin: "0 auto 24px", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "36px", border: "2px solid #BFDBFE"
                }}>
                  {lead.avatar}
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>{lead.name}</h3>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#14B8A6", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>
                  {lead.role}
                </p>
                <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, margin: 0 }}>
                  {lead.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styled inline media rules */}
      <style>{`
        .val-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(15,76,129,0.06), 0 10px 10px -5px rgba(15,76,129,0.04) !important;
          border-color: #14B8A6 !important;
        }
        @media(max-width:900px){
          section { padding: 60px 24px !important; }
          section > div { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>

      <Footer />
    </>
  );
}
