"use client";
import Image from "next/image";
import { useState } from "react";

export default function Team() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const teamMembers = [
    {
      name: "Maqsood Gul",
      role: "Director - Madicxus Group",
      bio: "Leads management, marketing, and business development. Specializes in the Study Abroad Next Project, driving its growth and partnerships across educational institutions worldwide. Partner in both Lab Management and Hospital Management System projects, serving as Product Owner for these initiatives.",
      projects: ["Study Abroad Next Project", "Lab Management System", "Hospital Management System"],
      image: "/teamphotos/maqsoodpic.jpeg",
      color: "#0F4C81",
      zoomScale: 1.15,
      defaultScale: 1,
      objectPosition: "center 40%",
    },
    {
      name: "Usama Ejaz",
      role: "IT Head - Madicxus Group",
      bio: "Oversees all IT operations, project development, and technical strategy. Partner in both Lab Management and Hospital Management System projects, serving as Product Owner for these initiatives.",
      projects: ["Lab Management System", "Hospital Management System"],
      image: "/teamphotos/usamapic.jpeg",
      color: "#14B8A6",
      zoomScale: 1.15,
      defaultScale: 1,
      objectPosition: "top",
    },
  ];

  return (
    <section style={{
      padding: "60px 32px",
      background: "linear-gradient(180deg,#F8FAFC 0%,#fff 100%)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginBottom: "40px",
      }}>
        <p style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "1.8px",
          textTransform: "uppercase",
          color: "#14B8A6",
          marginBottom: "10px",
        }}>Our Team</p>
        <h2 style={{
          fontSize: "clamp(20px,2.5vw,28px)",
          fontWeight: 800,
          color: "#0F172A",
          letterSpacing: "-0.8px",
          lineHeight: 1.1,
          marginBottom: "12px",
        }}>Meet Our Leadership</h2>
        <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6, maxWidth: "420px" }}>
          Dedicated professionals driving innovation and excellence across all Madicxus Group initiatives.
        </p>
      </div>

      {/* Team Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}>
        {teamMembers.map((member, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(15,76,129,.06)",
              transition: "all .4s cubic-bezier(.4,0,.2,1)",
              cursor: "default",
              position: "relative",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Image Container */}
            <div style={{
              position: "relative",
              paddingTop: hoveredIndex === index ? "110%" : "100%",
              overflow: "hidden",
              background: "#F8FAFC",
              transition: "padding-top .4s cubic-bezier(.4,0,.2,1)",
            }}>
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                loading="eager"
                style={{
                  objectFit: "cover",
                  objectPosition: member.objectPosition,
                  transition: "transform .6s cubic-bezier(.4,0,.2,1)",
                  transform: hoveredIndex === index ? `scale(${member.zoomScale})` : `scale(${member.defaultScale})`,
                }}
              />
              {/* Color Overlay */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: `linear-gradient(180deg,transparent 0%,${member.color}90 100%)`,
                pointerEvents: "none",
              }} />
            </div>

            {/* Content */}
            <div style={{
              padding: "12px 14px",
              overflow: "hidden",
              maxHeight: hoveredIndex === index ? "500px" : "52px",
              transition: "max-height .4s cubic-bezier(.4,0,.2,1), padding .4s cubic-bezier(.4,0,.2,1)",
            }}>
              {/* Name & Role */}
              <h3 style={{
                fontSize: "14px",
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: "2px",
              }}>{member.name}</h3>
              <p style={{
                fontSize: "10px",
                fontWeight: 600,
                color: member.color,
                textTransform: "uppercase",
                letterSpacing: "0.7px",
                marginBottom: "0px",
                transition: "margin-bottom .4s cubic-bezier(.4,0,.2,1)",
              }}>{member.role}</p>

              {/* Bio - Shows on Hover */}
              <div style={{
                opacity: hoveredIndex === index ? 1 : 0,
                maxHeight: hoveredIndex === index ? "500px" : "0",
                marginTop: hoveredIndex === index ? "12px" : "0",
                transition: "all .3s cubic-bezier(.4,0,.2,1)",
              }}>
                <p style={{
                  fontSize: "12px",
                  color: "#64748B",
                  lineHeight: 1.5,
                  marginBottom: "12px",
                }}>{member.bio}</p>
                <div>
                  <p style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "1.2px",
                    marginBottom: "8px",
                  }}>Key Projects</p>
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
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media(max-width:768px){
          section { padding: 48px 16px !important; }
        }
      `}</style>
    </section>
  );
}
