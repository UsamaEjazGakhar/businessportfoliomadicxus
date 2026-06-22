"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/app/admin/layout";

interface PrescriptionSubmission {
  id: string;
  doctorName: string;
  doctorQualifications: string;
  pmdcRegNumber: string;
  uidAmb: string;
  timings: string;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  date?: string;
  rxContent?: string;
  adviceContent?: string;
  isRead: boolean;
  assignedNotes?: string;
  createdAt: string;
}

export default function PrescriptionsAdmin() {
  const [submissions, setSubmissions] = useState<PrescriptionSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<PrescriptionSubmission | null>(null);
  const { showToast, confirmDelete } = useToast();
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/prescription-submissions");
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data);
        if (data.data.length > 0 && !selectedSubmission) {
          setSelectedSubmission(data.data[0]);
          setNotes(data.data[0].assignedNotes || "");
        }
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubmission = (submission: PrescriptionSubmission) => {
    setSelectedSubmission(submission);
    setNotes(submission.assignedNotes || "");
    if (!submission.isRead) {
      markAsRead(submission.id);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/prescription-submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, isRead: true } : s));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedSubmission) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/prescription-submissions/${selectedSubmission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedNotes: notes }),
      });
      if (res.ok) {
        showToast("Notes saved successfully!", "success");
        setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, assignedNotes: notes } : s));
      }
    } catch (error) {
      showToast("Failed to save notes", "error");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = (id: string) => {
    confirmDelete("Are you sure you want to delete this prescription submission?", async () => {
      try {
        const res = await fetch(`/api/prescription-submissions/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          showToast("Submission deleted successfully!", "success");
          await fetchSubmissions();
          if (selectedSubmission?.id === id) {
            setSelectedSubmission(null);
            setNotes("");
          }
        }
      } catch (error) {
        showToast("Failed to delete submission", "error");
      }
    });
  };

  return (
    <div style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", marginBottom: "4px" }}>
          Prescription Submissions
        </h1>
        <p style={{ fontSize: "14px", color: "#94A3B8" }}>
          Review and manage all prescription submissions
        </p>
      </div>

      {loading && submissions.length === 0 ? (
        <p style={{ color: "#94A3B8" }}>Loading submissions...</p>
      ) : (
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px", minHeight: 0 }}>
          {/* Master Sidebar (List) */}
          <div style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
            overflowY: "auto", display: "flex", flexDirection: "column"
          }}>
            <div style={{ padding: "16px", borderBottom: "1px solid #F1F5F9", fontWeight: 700, fontSize: "14px", color: "#0F172A" }}>
              Submissions ({submissions.length})
            </div>
            <div style={{ flex: 1 }}>
              {submissions.map((submission) => {
                const isActive = selectedSubmission?.id === submission.id;
                return (
                  <div
                    key={submission.id}
                    onClick={() => handleSelectSubmission(submission)}
                    style={{
                      padding: "16px", borderBottom: "1px solid #F1F5F9", cursor: "pointer",
                      background: isActive ? "rgba(15,76,129,.05)" : "transparent",
                      borderLeft: isActive ? "4px solid #0F4C81" : "4px solid transparent",
                      transition: "all .15s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "14px", fontWeight: submission.isRead ? 600 : 800, color: "#0F172A" }}>
                        {submission.patientName || "Unnamed Patient"}
                      </span>
                      {!submission.isRead && (
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }} />
                      )}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: submission.isRead ? 500 : 700, color: "#475569", marginBottom: "4px" }}>
                      {submission.date || "No Date"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
              {submissions.length === 0 && (
                <div style={{ padding: "32px", textAlign: "center", color: "#94A3B8", fontSize: "14px" }}>
                  No submissions yet
                </div>
              )}
            </div>
          </div>

          {/* Details Frame */}
          {selectedSubmission ? (
            <div style={{
              background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
              padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between",
              overflowY: "auto"
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                  <div>
                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
                      Prescription
                    </h2>
                    <div style={{ fontSize: "13px", color: "#64748B" }}>
                      For: <strong style={{ color: "#0F172A" }}>{selectedSubmission.patientName || "Unnamed Patient"}</strong>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#94A3B8" }}>
                      Received: {new Date(selectedSubmission.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDelete(selectedSubmission.id)}
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
                  whiteSpace: "pre-line", minHeight: "150px", marginBottom: "24px"
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Patient Name</label>
                      <p style={{ margin: "4px 0 0 0", color: "#1E293B" }}>{selectedSubmission.patientName || "-"}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Patient Age</label>
                      <p style={{ margin: "4px 0 0 0", color: "#1E293B" }}>{selectedSubmission.patientAge || "-"}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Patient Gender</label>
                      <p style={{ margin: "4px 0 0 0", color: "#1E293B" }}>{selectedSubmission.patientGender || "-"}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date</label>
                      <p style={{ margin: "4px 0 0 0", color: "#1E293B" }}>{selectedSubmission.date || "-"}</p>
                    </div>
                  </div>

                  {selectedSubmission.rxContent && (
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>Rx</h3>
                      <p style={{ margin: 0, whiteSpace: "pre-line", color: "#1E293B" }}>{selectedSubmission.rxContent}</p>
                    </div>
                  )}
                  {selectedSubmission.adviceContent && (
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>Advice</h3>
                      <p style={{ margin: 0, whiteSpace: "pre-line", color: "#1E293B" }}>{selectedSubmission.adviceContent}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* CRM / Administration Notes Section */}
              <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "24px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>
                  CRM Follow-up Notes
                </h3>

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
                    padding: "8px 18px", fontWeight: 600, fontSize: "13px", cursor: savingNotes ? "not-allowed" : "pointer",
                    opacity: savingNotes ? 0.7 : 1
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
              Select a submission to view details
            </div>
          )}
        </div>
      )}
    </div>
  );
}
