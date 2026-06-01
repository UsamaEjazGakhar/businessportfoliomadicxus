const ABOUT_STATS = [
  { num: "4+", label: "Core Business Divisions" },
  { num: "5+", label: "IT Product Verticals" },
  { num: "15+", label: "Partner Universities Abroad" },
  { num: "∞", label: "Growth Potential" },
];

const ABOUT_CARDS = [
  { icon: "🏆", title: "Our Mission", desc: "Deliver accessible, world-class healthcare across all our divisions." },
  { icon: "🔭", title: "Our Vision", desc: "To be South Asia's most trusted healthcare technology group by 2030." },
  { icon: "💡", title: "Innovation", desc: "Cutting-edge HMS and lab management solutions for modern hospitals." },
  { icon: "🌱", title: "Growth", desc: "Structured for scalability with a clear 5-year expansion roadmap." },
];

export default function AboutBand() {
  return (
    <section id="about" style={{
      background: "linear-gradient(135deg,#0B1220,#0F2D4F)",
      padding: "80px 64px", position: "relative", overflow: "hidden",
    }}>
      {/* Decorative Orb */}
      <div style={{
        content: "", position: "absolute", right: "-80px", top: "-80px",
        width: "400px", height: "400px",
        background: "radial-gradient(circle,rgba(20,184,166,.12) 0%,transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "80px", alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        {/* Left: Text */}
        <div>
          <p style={{
            fontSize: "12px", fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", color: "#14B8A6", marginBottom: "12px",
          }}>Who We Are</p>
          <h2 style={{
            fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 800,
            color: "#fff", letterSpacing: "-1.5px", lineHeight: 1.2, marginBottom: "14px",
          }}>A Group Built for<br />Tomorrow&apos;s Healthcare</h2>
          <p style={{
            fontSize: "16px", color: "rgba(255,255,255,.6)", lineHeight: 1.7,
            maxWidth: "580px", marginBottom: "32px",
          }}>
            Medicxus Group is a next-generation healthcare conglomerate committed to excellence across
            education, diagnostics, consultancy, and technology. We are investment-ready, globally connected,
            and locally committed.
          </p>

          {/* Mini Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "40px",
          }}>
            {ABOUT_STATS.map((stat) => (
              <div key={stat.label} style={{
                padding: "20px", background: "rgba(255,255,255,.05)",
                border: "1px solid rgba(255,255,255,.08)", borderRadius: "12px",
              }}>
                <span style={{
                  fontSize: "28px", fontWeight: 800, color: "#14B8A6",
                  letterSpacing: "-1px", display: "block",
                }}>{stat.num}</span>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,.5)", marginTop: "4px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cards Grid */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {ABOUT_CARDS.map((card) => (
              <div key={card.title} className="about-card" style={{
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "14px", padding: "22px", transition: "all .2s", cursor: "pointer",
              }}>
                <div style={{ fontSize: "22px", marginBottom: "10px" }}>{card.icon}</div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "5px" }}>
                  {card.title}
                </h4>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,.45)", lineHeight: 1.5 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .about-card:hover {
          background: rgba(255,255,255,.1) !important;
          transform: translateY(-3px);
        }
        @media(max-width:900px){
          section { padding: 64px 24px !important; }
          section > div { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media(max-width:600px){
          section > div > div:last-child > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
