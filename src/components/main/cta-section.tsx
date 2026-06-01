import ContactForm from "./contact-form";

export default function CtaSection() {
  return (
    <section id="contact" style={{
      background: "linear-gradient(135deg,#0F4C81 0%,#1a6eb5 100%)",
      padding: "88px 64px", textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* Glow Orb */}
      <div style={{
        position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "600px",
        background: "radial-gradient(circle,rgba(20,184,166,.15) 0%,transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      <h2 style={{
        fontSize: "clamp(32px,4vw,52px)", fontWeight: 900, color: "#fff",
        letterSpacing: "-2px", marginBottom: "18px", position: "relative", zIndex: 2,
      }}>Ready to Build the Future of Healthcare Together?</h2>
      <p style={{
        fontSize: "18px", color: "rgba(255,255,255,.65)",
        maxWidth: "500px", margin: "0 auto 40px", lineHeight: 1.7, position: "relative", zIndex: 2,
      }}>Whether you are a student, hospital, investor, or technology partner — Medicxus Group has a place for you.</p>

      <div style={{
        background: "rgba(255,255,255,.95)", borderRadius: "20px", padding: "48px",
        maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 2,
      }}>
        <ContactForm />
      </div>

      <style>{`
        .cta-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,.2);
        }
        .cta-btn-secondary:hover {
          border-color: #fff !important;
          background: rgba(255,255,255,.08) !important;
        }
        @media(max-width:900px){ section { padding: 64px 24px !important; } }
      `}</style>
    </section>
  );
}
