"use client";
import { ReactNode, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Role } from "@prisma/client";

export default function ConsultantLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session.user as any).role !== Role.CONSULTANT) {
      router.push("/admin");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ fontSize: "16px", color: "#64748b" }}>Loading...</p>
      </div>
    );
  }

  // If authenticated but not a consultant, don't render layout (redirect handled in useEffect)
  if (status === "authenticated" && (session?.user as any).role !== Role.CONSULTANT) {
    return null;
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/consultant",
      icon: "🏥"
    },
    {
      label: "Prescriptions",
      href: "/consultant?view=prescriptions",
      icon: "📋"
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#f8fafc"
    }}>
      {/* Sidebar */}
      <aside className={`consultant-sidebar ${isSidebarOpen ? 'open' : ''}`} style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        padding: "24px 0",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        position: "sticky",
        top: "0",
        height: "100vh"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "0 24px",
          marginBottom: "40px"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0f4c81 0%, #14b8a6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px"
          }}>
            🏥
          </div>
          {isSidebarOpen && (
            <div>
              <h1 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "2px" }}>Clinic Pro</h1>
              <p style={{ fontSize: "11px", color: "#94a3b8" }}>Consultant Portal</p>
            </div>
          )}
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map(item => {
            const url = new URL(item.href, "http://localhost");
            const viewParam = url.searchParams.get("view");
            const currentView = searchParams.get("view");
            const isActive = 
              (item.href === "/consultant" && !currentView) || 
              (viewParam && currentView === viewParam);
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 24px",
                  background: isActive
                    ? "rgba(15,76,129,0.3)"
                    : "transparent",
                  borderLeft: isActive ? "3px solid #14b8a6" : "3px solid transparent",
                  color: isActive ? "#14b8a6" : "#94a3b8",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left"
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {isSidebarOpen && (
          <div style={{
            padding: "24px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            marginTop: "auto"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#0f4c81,#14b8a6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 700
              }}>
                {(session?.user?.name || "C").charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {session?.user?.name || "Consultant"}
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                  Consultant
                </div>
              </div>
            </div>
            <button
              onClick={async (e) => {
                e.preventDefault();
                await signOut({ redirect: false });
                router.push('/');
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              }}
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        overflowY: "auto"
      }}>
        <header style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: "0",
          zIndex: 50
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                padding: "8px 12px",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                cursor: "pointer"
              }}
            >
              ☰
            </button>
          </div>
        </header>
        <div style={{ padding: "32px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
