 export default function Hero() {
  return (
    <section style={{
      background: "linear-gradient(135deg,#0B1220 0%,#0F2D4F 55%,#0a2540 100%)",
      padding: "110px 64px 100px",
      position: "relative",
      overflow: "hidden",
      minHeight: "640px",
      display: "flex",
      alignItems: "center",
    }}>
      {/* Orbs */}
      <div style={{
        position: "absolute", top: "-120px", right: "-120px",
        width: "650px", height: "650px",
        background: "radial-gradient(circle,rgba(20,184,166,.18) 0%,transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-180px", left: "35%",
        width: "500px", height: "500px",
        background: "radial-gradient(circle,rgba(245,158,11,.09) 0%,transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "-100px", transform: "translateY(-50%)",
        width: "400px", height: "400px",
        background: "radial-gradient(circle,rgba(15,76,129,.2) 0%,transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "760px" }}>
        {/* Badge */}
        <div className="animate-fade-down" style={{
          display: "inline-flex", alignItems: "center", gap: "9px",
          background: "rgba(20,184,166,.12)", border: "1px solid rgba(20,184,166,.28)",
          borderRadius: "100px", padding: "7px 18px",
          fontSize: "13px", color: "#14B8A6", fontWeight: 500, marginBottom: "1px",
        }}>
          <span className="animate-pulse-dot" style={{
            width: "6px", height: "6px", background: "#14B8A6",
            borderRadius: "50%", display: "inline-block",
          }} />
          Trusted Healthcare Technology Group &nbsp;—&nbsp; medicxus.com
        </div>

        {/* Heading */}
        <div className="animate-fade-up" style={{
          fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 800, color: "#14B8A6", letterSpacing: "8px", marginBottom: "16px", textTransform: "uppercase"
        }}>
          MEDICXUS GROUP
        </div>
        <h1 className="animate-fade-up" style={{
          fontSize: "clamp(42px,5.2vw,72px)", fontWeight: 900,
          lineHeight: 1.06, color: "#fff", letterSpacing: "-2.5px", marginBottom: "26px",
        }}>
          Empowering<br />
          <span style={{ color: "#14B8A6" }}>Healthcare.</span><br />
          <span style={{ color: "#F59E0B" }}>Transforming</span> Lives.
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up-delay-2" style={{
          fontSize: "18px", color: "rgba(255,255,255,.6)", lineHeight: 1.75,
          maxWidth: "560px", marginBottom: "44px", fontWeight: 300,
        }}>
          Medicxus Group bridges world-class health education, advanced diagnostics,
          international MBBS consultancy and cutting-edge healthcare IT&nbsp;—
          all under one trusted roof.
        </p>

        {/* Buttons */}
        <div className="animate-fade-up-delay-3" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <a href="#divisions" className="hero-btn-primary" style={{
            background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#0B1220",
            padding: "15px 34px", borderRadius: "11px", fontWeight: 700, fontSize: "15px",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "9px",
            transition: "transform .2s,box-shadow .2s", letterSpacing: "-0.2px",
          }}>
            Explore Our Divisions ↗
          </a>
          <a href="#about" className="hero-btn-secondary" style={{
            background: "rgba(255,255,255,.07)", color: "#fff",
            padding: "15px 34px", borderRadius: "11px", fontWeight: 600, fontSize: "15px",
            textDecoration: "none", border: "1.5px solid rgba(255,255,255,.22)", transition: "all .2s",
          }}>
            Learn About Us
          </a>
        </div>

        {/* Trust Chips */}
        <div className="animate-fade-up-delay-1" style={{
          display: "flex", alignItems: "center", gap: "28px", marginTop: "0px", flexWrap: "wrap",
        }}>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,.35)", fontWeight: 500 }}>
            Trusted by:
          </span>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["Hospitals", "Medical Students", "Diagnostic Labs", "Healthcare IT Teams"].map((chip) => (
              <span key={chip} style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "100px", padding: "5px 12px",
                fontSize: "12px", color: "rgba(255,255,255,.65)", fontWeight: 500,
              }}>
                <span style={{ color: "#14B8A6", fontWeight: 700, fontSize: "11px" }}>✓</span>
                {chip}
              </span>
            ))}
          </div>
          </div>
        </div>

      <style>{`




        .hero-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(245,158,11,.38);
        }
        .hero-btn-secondary:hover {
          border-color: rgba(255,255,255,.5) !important;
          background: rgba(255,255,255,.1) !important;
        }
        @media(max-width:900px){
          section { padding: 72px 24px 60px !important; }
          h1 { font-size: 38px !important; letter-spacing: -1.5px !important; }
        }
        @media(max-width:600px){
          h1 { font-size: 32px !important; }
        }
      `}</style>
    </section>
  );
}
