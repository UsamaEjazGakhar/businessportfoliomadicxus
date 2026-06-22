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
    <section id="about" className="about-section">
      {/* Decorative Orb */}
      <div className="about-orb" />

      <div className="about-grid">
        {/* Left: Text */}
        <div>
          <p className="about-subtitle">Who We Are</p>
          <h2 className="about-title">A Group Built for<br />Tomorrow&apos;s Healthcare</h2>
          <p className="about-text">
            Medicxus Group is a next-generation healthcare conglomerate committed to excellence across
            education, diagnostics, consultancy, and technology. We are investment-ready, globally connected,
            and locally committed.
          </p>

          {/* Mini Stats */}
          <div className="about-stats-grid">
            {ABOUT_STATS.map((stat) => (
              <div key={stat.label} className="about-stat-card">
                <span className="about-stat-number">{stat.num}</span>
                <div className="about-stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cards Grid */}
        <div>
          <div className="about-cards-grid">
            {ABOUT_CARDS.map((card) => (
              <div key={card.title} className="about-card">
                <div className="about-card-icon">{card.icon}</div>
                <h4 className="about-card-title">{card.title}</h4>
                <p className="about-card-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
