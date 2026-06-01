"use client";

import Navbar from "@/components/main/navbar";
import Footer from "@/components/main/footer";
import { useState } from "react";

const BENEFITS = [
  { icon: "🩺", title: "Premium Healthcare", desc: "Comprehensive health coverage and wellness stipends for you and your dependents." },
  { icon: "📈", title: "Career Progression", desc: "Explicit 3-tier promotion structures, annual training budgets, and skill development programs." },
  { icon: "🏠", title: "Hybrid Work Setup", desc: "Work comfortably with our modern hybrid layout (2 days remote, 3 days collaborative office)." },
  { icon: "🏖️", title: "Generous Time Off", desc: "25 days of annual paid leave, medical leaves, plus standard parental and family wellness leaves." },
];

const JOBS = [
  {
    id: "hms-dev",
    title: "Senior Full-Stack Engineer (HMS Platform)",
    department: "IT Services & Solutions",
    location: "Lahore, PK (Hybrid)",
    type: "Full-Time",
    experience: "4-6 Years",
    desc: "Scale our custom-built hospital information software and lead high-availability clinic management integrations.",
  },
  {
    id: "diag-con",
    title: "Clinical Diagnostic Consultant",
    department: "Medicxus Diagnostics",
    location: "Islamabad, PK (On-site)",
    type: "Full-Time",
    experience: "3+ Years",
    desc: "Oversee operational workflow, clinical audit compliance, and partner with clinicians for accuracy evaluations.",
  },
  {
    id: "edu-counselor",
    title: "Senior Academic Consultant (MBBS Abroad)",
    department: "Education Consultancy",
    location: "Karachi, PK (Hybrid)",
    type: "Full-Time",
    experience: "2-4 Years",
    desc: "Assist outstanding student candidates in enrolling with top-tier international partner medical universities.",
  },
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      setSelectedJob(null);
      setAppliedSuccess(false);
      setApplicantName("");
      setApplicantEmail("");
    }, 4000);
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #0B1220 0%, #0F2D4F 100%)",
        padding: "120px 64px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-80px", left: "-80px", width: "350px", height: "350px",
          background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <p style={{
            fontSize: "13px", fontWeight: 700, letterSpacing: "3px",
            color: "#14B8A6", textTransform: "uppercase", marginBottom: "16px"
          }}>Careers at Medicxus</p>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: "#fff",
            letterSpacing: "-1.5px", lineHeight: 1.15, marginBottom: "20px"
          }}>
            Build the Future of<br />
            <span style={{
              background: "linear-gradient(135deg, #14B8A6, #60A5FA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Healthcare Systems</span>
          </h1>
          <p style={{
            fontSize: "17px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7,
            maxWidth: "640px", margin: "0 auto"
          }}>
            We hire highly driven developers, medical professionals, and educators who love taking extreme ownership of impactful products. Join us in shaping tomorrow&apos;s wellness network.
          </p>
        </div>
      </section>

      {/* Why Us Section */}
      <section style={{ padding: "100px 64px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{
              fontSize: "12px", fontWeight: 700, letterSpacing: "2px",
              color: "#0F4C81", textTransform: "uppercase", display: "block", marginBottom: "12px"
            }}>Core Perks</span>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 800, color: "#0F172A",
              letterSpacing: "-1px"
            }}>Why You&apos;ll Love Working Here</h2>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px"
          }}>
            {BENEFITS.map((b) => (
              <div key={b.title} style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "18px",
                padding: "32px",
                transition: "all 0.3s ease"
              }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>{b.icon}</div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", marginBottom: "10px" }}>{b.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section style={{ padding: "100px 64px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span style={{
              fontSize: "12px", fontWeight: 700, letterSpacing: "2px",
              color: "#14B8A6", textTransform: "uppercase", display: "block", marginBottom: "12px"
            }}>Opportunities</span>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 800, color: "#0F172A",
              letterSpacing: "-1px", marginBottom: "16px"
            }}>Currently Active Roles</h2>
            <p style={{ fontSize: "15px", color: "#64748B", maxWidth: "580px", margin: "0 auto" }}>
              Explore our openings below. If you don&apos;t see an exact match but feel you belong at Medicxus, send your pitch to <strong>hr@medicxus.com</strong>.
            </p>
          </div>

          {/* Job List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {JOBS.map((job) => (
              <div key={job.id} style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                transition: "all 0.2s ease"
              }}
              className="job-row"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3 style={{ fontSize: "19px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>{job.title}</h3>
                    <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#64748B", fontWeight: 500 }}>
                      <span>📂 {job.department}</span>
                      <span>📍 {job.location}</span>
                      <span>💼 {job.experience}</span>
                    </div>
                  </div>
                  <span style={{
                    background: "rgba(20,184,166,0.1)",
                    color: "#14B8A6",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}>{job.type}</span>
                </div>

                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 }}>{job.desc}</p>
                
                <button
                  type="button"
                  onClick={() => setSelectedJob(job.title)}
                  style={{
                    alignSelf: "flex-start",
                    background: "#0F4C81",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#0a3a65"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#0F4C81"}
                >
                  Apply For Role
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Application Form */}
      {selectedJob && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(11,18,32,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: "24px",
            padding: "40px",
            maxWidth: "480px",
            width: "100%",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            position: "relative"
          }}>
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              style={{
                position: "absolute", top: "24px", right: "24px",
                background: "none", border: "none", fontSize: "20px",
                color: "#64748B", cursor: "pointer"
              }}
            >✕</button>

            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginBottom: "8px" }}>Submit Application</h3>
            <p style={{ fontSize: "13px", color: "#14B8A6", fontWeight: 600, marginBottom: "24px" }}>{selectedJob}</p>

            {appliedSuccess ? (
              <div style={{
                background: "#DCFCE7", border: "1px solid #86EFAC", color: "#166534",
                padding: "20px", borderRadius: "12px", textAlign: "center"
              }}>
                <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>🎉</span>
                <strong style={{ display: "block", fontSize: "15px", marginBottom: "4px" }}>Application Received!</strong>
                <span style={{ fontSize: "13px" }}>Our hiring team will review your profile and reach out within 3 business days.</span>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>Full Name</label>
                  <input
                    type="text" required value={applicantName} onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Jane Doe"
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>Email Address</label>
                  <input
                    type="email" required value={applicantEmail} onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="jane@example.com"
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>Resume / CV Link</label>
                  <input
                    type="url" required placeholder="https://drive.google.com/..."
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #0F4C81, #14B8A6)",
                    color: "#fff", border: "none", borderRadius: "10px",
                    padding: "12px", fontWeight: 700, fontSize: "14px",
                    cursor: "pointer", transition: "opacity 0.2s"
                  }}
                >Submit Application</button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .job-row:hover {
          border-color: #0F4C81 !important;
          box-shadow: 0 10px 20px rgba(15,76,129,0.03) !important;
        }
      `}</style>

      <Footer />
    </>
  );
}
