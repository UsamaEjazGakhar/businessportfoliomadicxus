import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Divisions() {
  const divisions = await prisma.businessDivision.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const categoryLabels: Record<string, string> = {
    "icon-blue": "Education",
    "icon-teal": "Healthcare",
    "icon-amber": "Consultancy",
    "icon-purple": "IT Services",
  };

  return (
    <section id="divisions" style={{ padding: "96px 64px", background: "#F8FAFC" }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        marginBottom: "52px", flexWrap: "wrap", gap: "24px",
      }}>
        <div>
          <p style={{
            fontSize: "12px", fontWeight: 700, letterSpacing: "2.5px",
            textTransform: "uppercase", color: "#14B8A6", marginBottom: "12px",
          }}>Our Divisions</p>
          <h2 style={{
            fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 800,
            color: "#0F172A", letterSpacing: "-1.5px", lineHeight: 1.2, marginBottom: "14px",
          }}>Four Pillars of Excellence</h2>
          <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.7, maxWidth: "580px" }}>
            A diversified healthcare group built to serve patients, professionals, students and technology partners worldwide.
          </p>
        </div>
        <a href="#" className="view-all-link" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          fontSize: "14px", fontWeight: 600, color: "#0F4C81", textDecoration: "none",
          borderBottom: "1.5px solid #0F4C81", paddingBottom: "2px", transition: "gap .2s",
        }}>View All Divisions →</a>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: "24px",
      }}>
        {divisions.map((division: { id: string; title: string; description: string; icon: string; iconColor: string; slug: string }) => (
          <DivisionCard key={division.id} division={division} categoryLabel={categoryLabels[division.iconColor] || ""} />
        ))}
      </div>

      <style>{`
        .view-all-link:hover {
          gap: 10px !important;
        }
        .card-hover-border:hover {
          transform: translateY(-5px);
          box-shadow: 0 24px 48px rgba(15,76,129,.11);
          border-color: transparent !important;
        }
        @media(max-width:900px){
          section { padding: 64px 24px !important; }
        }
        @media(max-width:600px){
          .cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function DivisionCard({ division, categoryLabel }: {
  division: { id: string; title: string; description: string; icon: string; iconColor: string; slug: string };
  categoryLabel: string;
}) {
  return (
    <Link href={`/api/redirect-division/${division.id}`}
      style={{
        background: "#fff", border: "1px solid #E2E8F0", borderRadius: "18px",
        padding: "34px", transition: "all .25s", cursor: "pointer",
        position: "relative", overflow: "hidden", display: "block", textDecoration: "none",
      }}
      className="card-hover-border"
    >
      <div className={division.iconColor} style={{
        width: "56px", height: "56px", borderRadius: "14px",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "22px", fontSize: "24px",
      }}>{division.icon}</div>
      <p style={{
        fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
        color: "#94A3B8", marginBottom: "8px",
      }}>{categoryLabel}</p>
      <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", marginBottom: "10px", letterSpacing: "-0.3px" }}>
        {division.title}
      </h3>
      <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65 }}>
        {division.description}
      </p>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        fontSize: "13px", fontWeight: 600, color: "#0F4C81",
        textDecoration: "none", marginTop: "18px", transition: "gap .2s",
      }}>Learn More →</span>
    </Link>
  );
}
