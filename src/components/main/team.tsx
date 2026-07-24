"use client";
import Image from "next/image";
import { useState } from "react";

export default function Team() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const teamMembers = [
    {
      name: "Mr. Maqsood Awan",
      role: "CEO - Medicxus Diagnostics",
      bio: "As Chief Executive Officer, serves as the principal decision-maker for Medicxus Diagnostics, overseeing daily operations, strategic planning, and organizational growth. Ensures seamless execution across all departments while driving the group's mission of delivering excellence in diagnostic and healthcare services.",
      projects: [],
      showProjects: false,
      image: "/teamphotos/image9.png",
      color: "#0F4C81",
      objectPosition: "center 15%",
    },
    {
      name: "Usama Ejaz",
      role: "IT Head - Medicxus Group",
      bio: "Oversees all IT operations, project development, and technical strategy. Partner in both Lab Management and Hospital Management System projects, serving as Product Owner for these initiatives.",
      projects: ["Lab Management System", "Hospital Management System"],
      showProjects: true,
      image: "/teamphotos/usamapic.jpeg",
      color: "#14B8A6",
      objectPosition: "top",
    },
    {
      name: "Maqsood Gul",
      role: "Director - Medicxus Group",
      bio: "Leads management, marketing, and business development. Specializes in the Study Abroad Next Project, driving its growth and partnerships across educational institutions worldwide. Partner in both Lab Management and Hospital Management System projects, serving as Product Owner for these initiatives.",
      projects: ["Study Abroad Next Project", "Lab Management System", "Hospital Management System"],
      showProjects: true,
      image: "/teamphotos/maqsoodpic.jpeg",
      color: "#0F4C81",
      objectPosition: "top",
    },
    {
      name: "Asst. Prof. Dr. Aaminah",
      role: "MBBS, M.Phil Histopathology",
      bio: "Brings specialized expertise in histopathology, contributing to accurate diagnostic assessment and academic excellence within the Medicxus Group's healthcare initiatives.",
      projects: [],
      showProjects: false,
      image: "/teamphotos/image1.png",
      color: "#0F4C81",
      objectPosition: "top",
    },
    {
      name: "Dr. Ayesha Ellahi",
      role: "Consultant Hematologist",
      bio: "MBBS, M.Phil, PhD Hematology. Provides expert consultation in hematology, supporting patient diagnosis and treatment planning across the Medicxus Group's healthcare network.",
      projects: [],
      showProjects: false,
      image: "/teamphotos/image2.png",
      color: "#14B8A6",
      objectPosition: "top",
    },
    {
      name: "Dr. Asim Munir",
      role: "Microbiologist",
      bio: "M.Phil., Ph.D., Postdoctoral Researcher (Microbiology). Provides expert microbiological analysis and research support, contributing to the diagnostic accuracy and scientific excellence of the Medicxus Group's laboratory services. Expertise includes antimicrobial resistance (AMR), microbial genomics, molecular epidemiology, plasmid biology, and One Health research.",
      projects: [],
      showProjects: false,
      image: "/teamphotos/image8.png",
      color: "#14B8A6",
      objectPosition: "top",
    },
    {
      name: "Dr. M. A. Yousaf",
      role: "MBBS, RMP 1987 | Diploma in Anesthesia & Pain Medicine, Yale University",
      bio: "Graduated in 1987 with nearly four decades of clinical experience. Completed residency training in anesthesiology and pain medicine at Yale University, later practicing in the United States and Australia in senior clinical leadership roles. Since 2021, has served in maritime medicine aboard vessels ranging from under 200 to over 8,000 passengers and crew, delivering care across all seven continents and five oceans, including Antarctica and the Arctic.",
      projects: [],
      showProjects: false,
      image: "/teamphotos/image10.png",
      color: "#0F4C81",
      objectPosition: "top",
    },
    {
      name: "Muhammad Luqman",
      role: "PhD Molecular Biology",
      bio: "Brings advanced research expertise in molecular biology, supporting scientific and diagnostic initiatives across the Medicxus Group.",
      projects: [],
      showProjects: false,
      image: "/teamphotos/image7.png",
      color: "#0F4C81",
      objectPosition: "top",
    },
    {
      name: "Muhammad Tanveer",
      role: "MSc Microbiology",
      bio: "Contributes specialized microbiology expertise, supporting laboratory operations and diagnostic accuracy within the Medicxus Group's healthcare projects.",
      projects: [],
      showProjects: false,
      image: "/teamphotos/image3.png",
      color: "#0F4C81",
      objectPosition: "top",
    },
    {
      name: "Dr. Hadayat-Ullah",
      role: "Cardiologist",
      bio: "MBBS, FCPS Cardiology. Delivers specialized cardiac care and consultation, strengthening the clinical expertise of the Medicxus Group's healthcare team.",
      projects: [],
      showProjects: false,
      image: "/teamphotos/image6.png",
      color: "#14B8A6",
      objectPosition: "top",
    },
    {
      name: "Dr. Kazim Raza",
      role: "Head of Patient Care Department",
      bio: "MBBS. Leads the Patient Care Department, ensuring quality service delivery and patient satisfaction across the Medicxus Group's healthcare facilities.",
      projects: [],
      showProjects: false,
      image: "/teamphotos/image4.png",
      color: "#14B8A6",
      objectPosition: "top",
    },
    {
      name: "Dr. Ahtesham",
      role: "Physiotherapist",
      bio: "DPT. Provides expert physiotherapy services, helping patients recover mobility and improve quality of life within the Medicxus Group's healthcare network.",
      projects: [],
      showProjects: false,
      image: "/teamphotos/image5.png",
      color: "#0F4C81",
      objectPosition: "top",
    },
  ];

  // Split into rows: 3, then 3, then 3, then 3
  const rows: (typeof teamMembers)[] = [];
  const rowSizes = [3, 3, 3, 3];
  let cursor = 0;
  for (const size of rowSizes) {
    rows.push(teamMembers.slice(cursor, cursor + size));
    cursor += size;
  }

  const renderCard = (member: (typeof teamMembers)[number], index: number) => (
    <div
      key={member.name}
      style={{
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(15,76,129,.06)",
        transition: "box-shadow .4s cubic-bezier(.4,0,.2,1)",
        cursor: "default",
        position: "relative",
        width: "220px",
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Image Container - fixed aspect ratio, never changes size */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "100%",
          overflow: "hidden",
          background: "#F8FAFC",
        }}
      >
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          loading="eager"
          style={{
            objectFit: "cover",
            objectPosition: member.objectPosition,
            transition: "transform .5s cubic-bezier(.4,0,.2,1)",
            transform: hoveredIndex === index ? "scale(1.06)" : "scale(1)",
            transformOrigin: member.objectPosition,
          }}
        />
        {/* Color Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: `linear-gradient(180deg,transparent 0%,${member.color}90 100%)`,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          padding: "12px 14px",
          overflow: "hidden",
          maxHeight: hoveredIndex === index ? "500px" : "52px",
          transition: "max-height .4s cubic-bezier(.4,0,.2,1), padding .4s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* Name & Role */}
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 800,
            color: "#0F172A",
            marginBottom: "2px",
          }}
        >
          {member.name}
        </h3>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 600,
            color: member.color,
            textTransform: "uppercase",
            letterSpacing: "0.7px",
            marginBottom: "0px",
            transition: "margin-bottom .4s cubic-bezier(.4,0,.2,1)",
          }}
        >
          {member.role}
        </p>

        {/* Bio - Shows on Hover */}
        <div
          style={{
            opacity: hoveredIndex === index ? 1 : 0,
            maxHeight: hoveredIndex === index ? "500px" : "0",
            marginTop: hoveredIndex === index ? "12px" : "0",
            transition: "all .3s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#64748B",
              lineHeight: 1.5,
              marginBottom: member.showProjects ? "12px" : "0px",
            }}
          >
            {member.bio}
          </p>

          {/* Key Projects - only for leadership (Maqsood Gul & Usama Ejaz) */}
          {member.showProjects && (
            <div>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  marginBottom: "8px",
                }}
              >
                Key Projects
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {member.projects.map((project, i) => (
                  <span
                    key={i}
                    style={{
                      background: `${member.color}15`,
                      color: member.color,
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 600,
                      border: `1px solid ${member.color}30`,
                    }}
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section
      style={{
        padding: "60px 32px",
        background: "linear-gradient(180deg,#F8FAFC 0%,#fff 100%)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "1.8px",
            textTransform: "uppercase",
            color: "#14B8A6",
            marginBottom: "10px",
          }}
        >
          Our Team
        </p>
        <h2
          style={{
            fontSize: "clamp(20px,2.5vw,28px)",
            fontWeight: 800,
            color: "#0F172A",
            letterSpacing: "-0.8px",
            lineHeight: 1.1,
            marginBottom: "12px",
          }}
        >
          Meet Our Leadership
        </h2>
        <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6, maxWidth: "420px" }}>
          Dedicated professionals driving innovation and excellence across all Medicxus Group initiatives.
        </p>
      </div>

      {/* Team Rows: 3 - 3 - 3 - 3 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        {rows.map((row, rowIndex) => {
          // compute global start index for this row (for hoveredIndex tracking)
          const startIndex = rowSizes.slice(0, rowIndex).reduce((a, b) => a + b, 0);
          return (
            <div
              key={rowIndex}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              {row.map((member, i) => renderCard(member, startIndex + i))}
            </div>
          );
        })}
      </div>

      <style>{`
        @media(max-width:768px){
          section { padding: 48px 16px !important; }
        }
        @media(max-width:520px){
          section > div:last-child > div { flex-direction: column !important; align-items: center !important; }
        }
      `}</style>
    </section>
  );
}