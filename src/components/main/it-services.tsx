import { prisma } from "@/lib/prisma";

const IT_ICONS: Record<string, string> = {
  "hospital-management-software": "🏥",
  "lab-management-software": "🔬",
  "website-development": "🌐",
  "digital-marketing": "📣",
  "healthcare-projects": "💼",
  "it-infrastructure": "⚙️",
};

export default async function ITServices() {
  const projects = await prisma.project.findMany({
    where: { category: "IT Services" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section id="services" style={{ padding: "96px 64px", background: "#fff" }}>
      <p style={{
        fontSize: "12px", fontWeight: 700, letterSpacing: "2.5px",
        textTransform: "uppercase", color: "#14B8A6", marginBottom: "12px",
      }}>IT Services</p>
      <h2 style={{
        fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 800,
        color: "#0F172A", letterSpacing: "-1.5px", lineHeight: 1.2, marginBottom: "14px",
      }}>Healthcare Technology Suite</h2>
      <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.7, maxWidth: "580px" }}>
        Purpose-built digital solutions for hospitals, diagnostic labs, clinics and healthcare businesses.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "18px",
        marginTop: "52px",
      }}>

        {projects.map((project: { id: string; title: string; description: string; slug: string }, i: number) => (
          <a
            key={project.id}
            href={`/api/redirect/${project.id}`}
            className="it-service-card"
            style={{
              border: "1px solid #E2E8F0", borderRadius: "14px", padding: "26px",
              transition: "all .25s", cursor: "pointer", position: "relative",
              background: "#F8FAFC", textDecoration: "none", display: "block",
            }}
          >
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2px",
              color: "#94A3B8", marginBottom: "14px", display: "block",
            }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontSize: "26px", marginBottom: "12px", display: "block" }}>
              {IT_ICONS[project.slug] || "💻"}
            </span>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
              {project.title}
            </h3>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.55 }}>
              {project.description}
            </p>
            <span style={{
              position: "absolute", top: "22px", right: "22px",
              color: "#94A3B8", fontSize: "16px", transition: "all .2s",
            }}>→</span>
          </a>
        ))}
      </div>

      <style>{`
        .it-service-card:hover {
          border-color: #14B8A6 !important;
          background: #fff !important;
          transform: translateY(-3px);
          box-shadow: 0 16px 32px rgba(20,184,166,.1);
        }
        @media(max-width:900px){ section { padding: 64px 24px !important; } }
        @media(max-width:600px){ section > div:last-of-type { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </section>
  );
}
