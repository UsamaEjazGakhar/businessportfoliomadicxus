"use client";
import { useState, useEffect } from "react";

const IT_ICONS: Record<string, string> = {
  "hospital-management-software": "🏥",
  "lab-management-software": "🔬",
  "website-development": "🌐",
  "digital-marketing": "📣",
  "healthcare-projects": "💼",
  "it-infrastructure": "⚙️",
};

export default function ITServices() {
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 300);
    
    // Fetch projects
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects?category=IT%20Services");
        if (res.ok) {
          const result = await res.json();
          setProjects(result.data);
        }
      } catch (e) {
        console.error("Failed to fetch IT projects:", e);
      }
    };
    fetchProjects();

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="services" style={{ 
      padding: "120px 64px", 
      background: "linear-gradient(180deg,#F8FAFC 0%,#fff 100%)",
      overflow: "hidden",
    }}>
      {/* Centered Header with Animations */}
      <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto" }}>
        <p style={{
          fontSize: "14px", fontWeight: 700, letterSpacing: "3px",
          textTransform: "uppercase", color: "#14B8A6", marginBottom: "20px",
          display: "inline-block",
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
          transition: "all .8s cubic-bezier(.25,.8,.25,1) .1s",
        }}>IT Services</p>
        <h2 style={{
          fontSize: "clamp(36px,4.5vw,56px)", fontWeight: 800,
          color: "#0F172A", letterSpacing: "-1.8px", lineHeight: 1.05, 
          marginBottom: "24px",
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
          transition: "all .8s cubic-bezier(.25,.8,.25,1) .2s",
        }}>Healthcare Technology Suite</h2>
        <p style={{
          fontSize: "20px", color: "#64748B", lineHeight: 1.8,
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
          transition: "all .8s cubic-bezier(.25,.8,.25,1) .3s",
        }}>
          Purpose-built digital solutions for hospitals, diagnostic labs, clinics and healthcare businesses.
        </p>
      </div>

      {/* Animated Services Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "28px",
        marginTop: "72px",
        maxWidth: "1280px",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        {projects.map((project, i: number) => (
          <a
            key={project.id}
            href={`/api/redirect/${project.id}`}
            style={{
              border: "1px solid #E2E8F0", borderRadius: "20px", padding: "36px",
              transition: "all .5s cubic-bezier(.25,.8,.25,1)", cursor: "pointer", 
              position: "relative", background: "#fff", textDecoration: "none", 
              display: "block", overflow: "hidden",
              opacity: isVisible ? 1 : 0, 
              transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.95)",
              transitionDelay: `${.4 + i * 0.12}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#14B8A6";
              e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 32px 80px rgba(20,184,166,.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E2E8F0";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Gradient Top Bar */}
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "5px",
              background: "linear-gradient(90deg,#14B8A6,#0F4C81,#14B8A6)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 3s ease infinite",
            }}></div>
            
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "2px",
              color: "#94A3B8", marginBottom: "22px", display: "block",
            }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ 
              fontSize: "40px", marginBottom: "18px", display: "block",
              transition: "transform .4s cubic-bezier(.25,.8,.25,1)",
            }} className="service-icon">
              {IT_ICONS[project.slug] || "💻"}
            </span>
            <h3 style={{ 
              fontSize: "19px", fontWeight: 700, color: "#0F172A", 
              marginBottom: "12px",
            }}>
              {project.title}
            </h3>
            <p style={{ 
              fontSize: "15px", color: "#64748B", lineHeight: 1.75,
            }}>
              {project.description}
            </p>
          </a>
        ))}
      </div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @media(max-width:900px){ 
          section { padding: 80px 24px !important; } 
          section > div:last-of-type { grid-template-columns: 1fr 1fr !important; } 
        }
        @media(max-width:600px){ 
          section > div:last-of-type { grid-template-columns: 1fr !important; } 
        }
      `}</style>
    </section>
  );
}
