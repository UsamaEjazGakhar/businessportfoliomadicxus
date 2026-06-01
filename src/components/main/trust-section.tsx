const TRUST_ITEMS = [
  { icon: "✅", title: "Healthcare Certified", desc: "All divisions operate under international healthcare compliance and quality standards.", color: "icon-blue" },
  { icon: "🌐", title: "Global Reach", desc: "International MBBS network spanning 15+ countries and top-ranked medical universities.", color: "icon-teal" },
  { icon: "💡", title: "Innovation Driven", desc: "Cutting-edge HMS and diagnostic tools built for modern healthcare operations.", color: "icon-amber" },
  { icon: "📊", title: "Investment Ready", desc: "Structured governance, clear roadmap and scalable model for long-term growth.", color: "icon-purple" },
  { icon: "🎓", title: "Accredited Education", desc: "Health sciences programs aligned with international medical education boards.", color: "icon-blue" },
  { icon: "🔬", title: "Precision Diagnostics", desc: "Advanced equipment and expert clinicians ensuring accurate, reliable results.", color: "icon-teal" },
];

export default function TrustSection() {
  return (
    <section style={{ padding: "96px 64px", background: "#F8FAFC" }}>
      <p style={{
        fontSize: "12px", fontWeight: 700, letterSpacing: "2.5px",
        textTransform: "uppercase", color: "#14B8A6", marginBottom: "12px",
      }}>Why Medicxus</p>
      <h2 style={{
        fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 800,
        color: "#0F172A", letterSpacing: "-1.5px", lineHeight: 1.2, marginBottom: "14px",
      }}>Built on Trust, Driven by Excellence</h2>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)",
        gap: "28px", marginTop: "52px",
      }}>
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="trust-card" style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
            padding: "28px", transition: "all .2s", cursor: "pointer",
          }}>
            <div className={item.color} style={{
              width: "48px", height: "48px", borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", marginBottom: "16px",
            }}>{item.icon}</div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
              {item.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        .trust-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px rgba(15,76,129,.08);
        }
        @media(max-width:900px){ section { padding: 64px 24px !important; } section > div:last-child { grid-template-columns: 1fr 1fr !important; } }
        @media(max-width:600px){ section > div:last-child { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
