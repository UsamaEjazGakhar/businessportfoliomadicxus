import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [
    projectCount,
    divisionCount,
    inquiryCount,
    unreadCount,
    recentInquiries,
    topProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.businessDivision.count(),
    prisma.contactInquiry.count(),
    prisma.contactInquiry.count({ where: { isRead: false } }),
    prisma.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.project.findMany({
      orderBy: { clickCount: "desc" },
      take: 5,
      select: { title: true, clickCount: true, status: true },
    }),
  ]);

  const stats = [
    { label: "Active Projects", value: projectCount, color: "#0F4C81", icon: "💼" },
    { label: "Business Divisions", value: divisionCount, color: "#14B8A6", icon: "📂" },
    { label: "Total Inquiries", value: inquiryCount, color: "#F59E0B", icon: "📨" },
    { label: "Unread Messages", value: unreadCount, color: "#ef4444", icon: "🔔" },
  ];

  return (
    <div>
      <h1 style={{
        fontSize: "28px", fontWeight: 800, color: "#0F172A",
        letterSpacing: "-1px", marginBottom: "8px",
      }}>Dashboard Overview</h1>
      <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "32px" }}>
        Real-time platform analytics and management insights
      </p>

      {/* Stats Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px", marginBottom: "40px",
      }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
            padding: "24px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: stat.color,
            }} />
            <span style={{ fontSize: "28px", marginBottom: "8px", display: "block" }}>{stat.icon}</span>
            <span style={{
              fontSize: "32px", fontWeight: 900, color: stat.color,
              letterSpacing: "-1.5px", display: "block", marginBottom: "4px",
            }}>{stat.value}</span>
            <span style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 500 }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Recent Inquiries */}
        <div style={{
          background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "20px" }}>
            Recent Inquiries
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ textAlign: "left", padding: "8px 0", fontSize: "12px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px" }}>Name</th>
                <th style={{ textAlign: "left", padding: "8px 0", fontSize: "12px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px" }}>Subject</th>
                <th style={{ textAlign: "left", padding: "8px 0", fontSize: "12px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((inq: { id: string; name: string; subject: string; isRead: boolean }) => (
                <tr key={inq.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 0", fontSize: "14px", fontWeight: 500, color: "#0F172A" }}>{inq.name}</td>
                  <td style={{ padding: "12px 0", fontSize: "13px", color: "#475569" }}>{inq.subject}</td>
                  <td style={{ padding: "12px 0" }}>
                    <span style={{
                      fontSize: "11px", fontWeight: 600,
                      padding: "3px 10px", borderRadius: "100px",
                      background: inq.isRead ? "rgba(34,197,94,.1)" : "rgba(245,158,11,.1)",
                      color: inq.isRead ? "#22c55e" : "#F59E0B",
                    }}>{inq.isRead ? "Read" : "New"}</span>
                  </td>
                </tr>
              ))}
              {recentInquiries.length === 0 && (
                <tr><td colSpan={3} style={{ padding: "20px 0", textAlign: "center", fontSize: "13px", color: "#94A3B8" }}>No inquiries yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Top Projects */}
        <div style={{
          background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px",
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "20px" }}>
            Top Projects by Clicks
          </h2>
          {topProjects.map((proj: { title: string; clickCount: number }, i: number) => (
            <div key={proj.title} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: i < topProjects.length - 1 ? "1px solid #f1f5f9" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  width: "28px", height: "28px", borderRadius: "8px",
                  background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 700, color: "#0F4C81",
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#0F172A" }}>{proj.title}</span>
              </div>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#0F4C81" }}>{proj.clickCount}</span>
            </div>
          ))}
          {topProjects.length === 0 && (
            <p style={{ fontSize: "13px", color: "#94A3B8", textAlign: "center", padding: "20px 0" }}>No project data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
