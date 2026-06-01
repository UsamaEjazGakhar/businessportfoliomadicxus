"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/app/admin/layout";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  assignedNotes: string | null;
  createdAt: string;
}

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const { showToast } = useToast();
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);


  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async (selectId?: string) => {
    try {
      setLoading(true);
      const res2 = await fetch("/api/inquiries");
      const data = await res2.json();
      if (data.success) {
        setInquiries(data.data);
        if (data.data.length > 0) {
          const current = selectId ? data.data.find((x: Inquiry) => x.id === selectId) : data.data[0];
          setSelectedInquiry(current || data.data[0]);
          setNotes(current?.assignedNotes || data.data[0]?.assignedNotes || "");
        } else {
          setSelectedInquiry(null);
        }
      }
    } catch {
      console.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectInquiry = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setNotes(inq.assignedNotes || "");
    if (!inq.isRead) {
      markAsRead(inq.id);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      const data = await res.json();
      if (data.success) {
        // Silently update local state
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, isRead: true } : inq));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, isRead: true } : null);
        }
      }
    } catch {
      console.error("Failed to mark read");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;

    setSavingNotes(true);
    setSaveStatus(null);

    try {
      const currentNotes = notes;

      const res = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedNotes: currentNotes }),
      });

      const data = await res.json();

      if (data?.success) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === selectedInquiry.id
              ? { ...inq, assignedNotes: currentNotes }
              : inq
          )
        );

        setSelectedInquiry((prev) =>
          prev ? { ...prev, assignedNotes: currentNotes, isRead: prev.isRead } : prev
        );

        setSaveStatus("Saved successfully.");
        // After save, clear the textarea as requested.
        setNotes("");
      } else {
        setSaveStatus(data?.message || "Save failed.");
      }
    } catch (e) {
      console.error(e);
      setSaveStatus("Save failed (network/error).");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Inquiry deleted successfully.", "success");
        fetchInquiries();
      } else {
        showToast(data.message || "Failed to delete inquiry", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to delete inquiry", "error");
    }
  };

  return (
    <div style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", marginBottom: "4px" }}>
          Contact Leads & Inquiries
        </h1>
        <p style={{ fontSize: "14px", color: "#94A3B8" }}>
          Review inquiries submitted via the public contact forms
        </p>
      </div>

      {loading && inquiries.length === 0 ? (
        <p style={{ color: "#94A3B8" }}>Loading leads...</p>
      ) : (
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px", minHeight: 0 }}>
          {/* Master Sidebar (List) */}
          <div style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
            overflowY: "auto", display: "flex", flexDirection: "column"
          }}>
            <div style={{ padding: "16px", borderBottom: "1px solid #F1F5F9", fontWeight: 700, fontSize: "14px", color: "#0F172A" }}>
              Inbox ({inquiries.length} messages)
            </div>
            <div style={{ flex: 1 }}>
              {inquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => handleSelectInquiry(inq)}
                    style={{
                      padding: "16px", borderBottom: "1px solid #F1F5F9", cursor: "pointer",
                      background: isSelected ? "rgba(15,76,129,.05)" : "transparent",
                      borderLeft: isSelected ? "4px solid #0F4C81" : "4px solid transparent",
                      transition: "all .15s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: inq.isRead ? 600 : 800, color: "#0F172A" }}>
                        {inq.name}
                      </span>
                      {!inq.isRead && (
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }} />
                      )}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: inq.isRead ? 500 : 700, color: "#475569", marginBottom: "4px" }}>
                      {inq.subject}
                    </div>
                    <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
              {inquiries.length === 0 && (
                <div style={{ padding: "32px", textAlign: "center", color: "#94A3B8", fontSize: "14px" }}>
                  Inbox is empty
                </div>
              )}
            </div>
          </div>

          {/* Details Frame */}
          {selectedInquiry ? (
            <div style={{
              background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
              padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between",
              overflowY: "auto"
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
                      {selectedInquiry.subject}
                    </h2>
                    <div style={{ fontSize: "13px", color: "#64748B" }}>
                      From: <strong style={{ color: "#0F172A" }}>{selectedInquiry.name}</strong> ({selectedInquiry.email})
                      {selectedInquiry.phone && ` | Phone: ${selectedInquiry.phone}`}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#94A3B8" }}>
                      Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDelete(selectedInquiry.id)}
                      style={{
                        background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "none",
                        borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >Delete</button>
                  </div>
                </div>

                <div style={{
                  background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "12px",
                  padding: "20px", fontSize: "14px", color: "#334155", lineHeight: 1.7,
                  whiteSpace: "pre-line", minHeight: "150px", marginBottom: "32px"
                }}>
                  {selectedInquiry.message}
                </div>
              </div>

              {/* CRM / Administration Notes Section */}
              <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "24px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>
                  CRM Follow-up Notes
                </h3>
                {saveStatus && (
                  <div
                    style={{
                      marginBottom: "12px",
                      background: saveStatus.toLowerCase().includes("saved")
                        ? "rgba(34,197,94,.12)"
                        : "rgba(239,68,68,.12)",
                      border: `1px solid ${saveStatus.toLowerCase().includes("saved") ? "rgba(34,197,94,.25)" : "rgba(239,68,68,.25)"}`,
                      color: saveStatus.toLowerCase().includes("saved") ? "#22c55e" : "#ef4444",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {saveStatus}
                  </div>
                )}

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record follow-up logs, calls made, or status details..."
                  style={{
                    width: "100%", padding: "12px", border: "1px solid #E2E8F0", borderRadius: "8px",
                    minHeight: "100px", fontSize: "13px", fontFamily: "inherit", marginBottom: "12px"
                  }}
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  style={{
                    background: "#0F4C81", color: "#fff", border: "none", borderRadius: "8px",
                    padding: "8px 18px", fontWeight: 600, fontSize: "13px", cursor: "pointer"
                  }}
                >
                  {savingNotes ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8"
            }}>
              Select a message to view details
            </div>
          )}
        </div>
      )}
    </div>
  );
}
