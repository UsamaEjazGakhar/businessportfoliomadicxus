import Link from "next/link";

const FOOTER_DIVISIONS = [
  { label: "Care Institute", href: "#" },
  { label: "Medicxus Diagnostic", href: "#" },
  { label: "MBBS Abroad", href: "#" },
  { label: "IT Services", href: "#" },
];

const FOOTER_PRODUCTS = [
  { label: "Hospital Software", href: "#" },
  { label: "Lab Management", href: "#" },
  { label: "Web Development", href: "#" },
  { label: "Digital Marketing", href: "#" },
];

const FOOTER_COMPANY = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { label: "in", href: "#" },
  { label: "tw", href: "#" },
  { label: "fb", href: "#" },
  { label: "yt", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0B1220", padding: "64px 64px 36px" }}>
      {/* Top Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
        gap: "48px", paddingBottom: "48px",
        borderBottom: "1px solid rgba(255,255,255,.08)",
      }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg,#0F4C81,#14B8A6)",
              borderRadius: "9px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 900, fontSize: "16px", fontStyle: "italic",
            }}>M</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}>
              Medic<span style={{ color: "#14B8A6" }}>xus</span> Group
            </div>
          </div>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,.4)", lineHeight: 1.7, marginBottom: "24px" }}>
            A diversified healthcare technology group uniting education, diagnostics, consultancy and IT solutions for a healthier world.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} className="social-link" style={{
                width: "36px", height: "36px",
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,.5)", textDecoration: "none", fontSize: "14px",
                transition: "all .2s",
              }}>{s.label}</a>
            ))}
          </div>
        </div>

        {/* Divisions Column */}
        <FooterCol title="Divisions" items={FOOTER_DIVISIONS} />
        <FooterCol title="IT Products" items={FOOTER_PRODUCTS} />
        <FooterCol title="Company" items={FOOTER_COMPANY} />
      </div>

      {/* Bottom Bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: "28px", flexWrap: "wrap", gap: "12px",
      }}>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,.3)" }}>
          © 2025 <span style={{ color: "#14B8A6" }}>Medicxus Group</span>. All rights reserved. &nbsp;—&nbsp; medicxus.com
        </p>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy Policy", "Terms of Use", "Cookies"].map((item) => (
            <a key={item} href="#" className="legal-link" style={{
              fontSize: "13px", color: "rgba(255,255,255,.3)",
              textDecoration: "none", transition: "color .2s",
            }}>{item}</a>
          ))}
        </div>
      </div>

      <style>{`
        .social-link:hover {
          background: rgba(20,184,166,.15) !important;
          border-color: #14B8A6 !important;
          color: #14B8A6 !important;
        }
        .legal-link:hover {
          color: rgba(255,255,255,.6) !important;
        }
        .footer-col-link:hover {
          color: #14B8A6 !important;
        }
        @media(max-width:900px){
          footer { padding: 48px 24px 24px !important; }
          footer > div:first-child { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media(max-width:600px){
          footer > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 style={{
        fontSize: "13px", fontWeight: 700, color: "#fff",
        letterSpacing: ".5px", marginBottom: "20px", textTransform: "uppercase",
      }}>{title}</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item.label} style={{ marginBottom: "10px" }}>
            <Link href={item.href} className="footer-col-link" style={{
              textDecoration: "none", color: "rgba(255,255,255,.4)",
              fontSize: "14px", transition: "color .2s",
            }}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
