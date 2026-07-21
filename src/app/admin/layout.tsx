"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const NAV_ITEMS = [
  { icon: "📊", label: "Dashboard", href: "/admin" },
  { icon: "✨", label: "Hero Section", href: "/admin/hero" },
  { icon: "📂", label: "Business Units", href: "/admin/divisions" },
  { icon: "💼", label: "Project Grid", href: "/admin/projects" },
  { icon: "📝", label: "Blog Editor", href: "/admin/blogs" },
  { icon: "🌟", label: "Testimonials", href: "/admin/testimonials" },
  { icon: "❓", label: "FAQs Manager", href: "/admin/faqs" },
  { icon: "📨", label: "Contact Leads", href: "/admin/inquiries" },
  { icon: "📄", label: "Admission Forms", href: "/admin/admission-forms" },
  { icon: "📝", label: "Prescriptions", href: "/admin/prescriptions" },
  { icon: "👨‍⚕️", label: "Consultants", href: "/admin/consultants" },
  { icon: "💰", label: "Nursing Fees", href: "/admin/nursing-fee-structures" },
  { icon: "🔬", label: "Paramedical Lab Fees", href: "/admin/paramedical-fee-structure-lab" },
  { icon: "🧪", label: "Paramedical MLT Fees", href: "/admin/paramedical-fee-structure-mlt" },
  { icon: "⚙️", label: "Settings", href: "/admin/settings" },
];

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  confirmDelete: (message: string, onConfirm: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Confirmation Modal State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  // Toast trigger
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Confirm delete trigger
  const confirmDelete = useCallback((message: string, onConfirm: () => void) => {
    setConfirmMessage(message);
    setOnConfirmCallback(() => onConfirm);
    setConfirmOpen(true);
  }, []);

  const handleConfirm = () => {
    if (onConfirmCallback) onConfirmCallback();
    setConfirmOpen(false);
    setOnConfirmCallback(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setOnConfirmCallback(null);
  };

  // Close sidebar on navigation change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <ToastContext.Provider value={{ showToast, confirmDelete }}>
      <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
        
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(11, 18, 32, 0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 999,
              transition: "opacity 0.2s ease",
            }}
          />
        )}


        {/* Sidebar */}
        <aside
          className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
          style={{
            width: "260px",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            background: "linear-gradient(180deg, #0F172A 0%, #0B1220 100%)",
            borderRight: "1px solid rgba(255,255,255,.05)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto", // Make sidebar scrollable
          }}
        >
          {/* Logo */}
          <div style={{ padding: "20px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{
                width: "36px", height: "36px",
                background: "linear-gradient(135deg,#0F4C81,#14B8A6)",
                borderRadius: "9px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 900, fontSize: "16px", fontStyle: "italic",
              }}>M</div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>
                  Medic<span style={{ color: "#14B8A6" }}>xus</span>
                </div>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1.5px", color: "#94A3B8", textTransform: "uppercase" }}>
                  Admin Panel
                </div>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="sidebar-close-btn"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
                padding: "4px 8px",
                display: "none",
              }}
            >✕</button>
          </div>

          {/* Nav Items */}
          <nav style={{ flex: 1, padding: "0 12px", overflowY: "auto" }}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  marginBottom: "4px",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: isActive ? "#fff" : "rgba(255,255,255,.5)",
                  background: isActive ? "rgba(20,184,166,.15)" : "transparent",
                  transition: "all .2s",
                }}>
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          {session?.user && (
            <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,.08)", flexShrink: 0, marginTop: "auto" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>
                {session.user.name}
              </div>
              <div style={{
                display: "inline-block", fontSize: "10px", fontWeight: 700,
                color: "#14B8A6", background: "rgba(20,184,166,.12)",
                padding: "2px 8px", borderRadius: "100px", letterSpacing: "1px",
                textTransform: "uppercase", marginBottom: "12px",
              }}>
                {session.user.role}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
                  e.currentTarget.style.color = "#fca5a5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,.06)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,.1)";
                  e.currentTarget.style.color = "rgba(255,255,255,.5)";
                }}
                style={{
                  display: "block", width: "100%", padding: "10px",
                  background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: "8px", color: "rgba(255,255,255,.5)", fontSize: "13px",
                  cursor: "pointer", transition: "all .2s",
                }}
              >Sign Out</button>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            background: "#F8FAFC",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            transition: "margin-left 0.3s ease",
          }}
          className="admin-main"
        >
          {/* Top Header */}
          <header style={{
            background: "#fff", borderBottom: "1px solid #E2E8F0",
            padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {/* Hamburger Icon */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hamburger-btn"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  display: "none",
                  padding: 0,
                  color: "#0F172A",
                }}
              >☰</button>
              <div style={{ fontSize: "14px", color: "#475569" }} className="welcome-text">
                Welcome back, <strong style={{ color: "#0F172A" }}>{session?.user?.name || "Admin"}</strong>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#22c55e", display: "inline-block",
              }} />
              <span style={{ fontSize: "12px", color: "#94A3B8" }}>Database Connected</span>
            </div>
          </header>

          {/* Page Content */}
          <div style={{ padding: "32px", flex: 1 }}>
            {children}
          </div>
        </main>

        {/* Floating Premium Toast Notifications */}
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 100000,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          pointerEvents: "none",
        }}>
          {toasts.map((t) => (
            <div
              key={t.id}
              style={{
                pointerEvents: "auto",
                background: t.type === "success" ? "#EFF6FF" : t.type === "error" ? "#FEF2F2" : "#F8FAFC",
                border: `1.5px solid ${t.type === "success" ? "#3B82F6" : t.type === "error" ? "#EF4444" : "#64748B"}`,
                color: t.type === "success" ? "#1E40AF" : t.type === "error" ? "#991B1B" : "#1E293B",
                boxShadow: "0 10px 30px rgba(15,76,129,0.08)",
                borderRadius: "14px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minWidth: "280px",
                maxWidth: "420px",
                animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{
                width: "24px", height: "24px", borderRadius: "50%",
                background: t.type === "success" ? "#3B82F6" : t.type === "error" ? "#EF4444" : "#64748B",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 800, flexShrink: 0
              }}>
                {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
              </div>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>{t.message}</span>
            </div>
          ))}
        </div>

        {/* Custom Confirmation Modal */}
        {confirmOpen && (
          <div
            onClick={handleCancel}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.3)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: "16px",
                width: "440px",
                padding: "28px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Warning Icon */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#FEF2F2",
                  border: "1.5px solid #FEE2E2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#EF4444",
                  fontSize: "24px",
                  marginBottom: "16px",
                }}
              >
                ⚠️
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#0F172A",
                  marginBottom: "8px",
                }}
              >
                Confirm Deletion
              </h3>

              {/* Message */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748B",
                  lineHeight: "1.5",
                  marginBottom: "24px",
                }}
              >
                {confirmMessage}
              </p>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  width: "100%",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    background: "#F1F5F9",
                    color: "#475569",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  style={{
                    flex: 1,
                    background: "#EF4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </ToastContext.Provider>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutInner>{children}</AdminLayoutInner>;
}
