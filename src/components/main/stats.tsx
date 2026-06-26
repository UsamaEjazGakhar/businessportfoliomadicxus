const STATS = [
  { num: "4+", label: "Business Divisions" },
  { num: "100%", label: "Compliance Focused" },
  { num: "Global", label: "MBBS Network" },
  { num: "5+", label: "IT Verticals" },
  { num: "24/7", label: "Healthcare Support" },
];

export default function Stats() {
  return (
    <div className="stats-container" style={{
      background: "#fff",
      borderBottom: "1px solid #E2E8F0",
      display: "flex",
      alignItems: "stretch",
    }}>
      {STATS.map((stat, i) => (
        <div key={stat.label} className="stat-pill" style={{
          flex: 1, padding: "28px 40px", textAlign: "center",
          borderRight: i < STATS.length - 1 ? "1px solid #E2E8F0" : "none",
          transition: "background .2s", cursor: "default",
        }}>
          <span style={{
            fontSize: "34px", fontWeight: 900, color: "#0F4C81",
            letterSpacing: "-1.5px", display: "block", marginBottom: "4px",
          }}>{stat.num}</span>
          <span style={{ fontSize: "13px", color: "#475569", fontWeight: 500 }}>
            {stat.label}
          </span>
        </div>
      ))}
      <style>{`
        .stat-pill:hover {
          background: #F8FAFC !important;
        }
        @media(max-width:900px){
          div > div { min-width: 50%; }
        }
      `}</style>
    </div>
  );
}
