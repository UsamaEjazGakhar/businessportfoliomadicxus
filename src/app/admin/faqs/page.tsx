"use client";

import { useToast } from "@/app/admin/layout";

import { useState, useEffect } from "react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export default function FaqsAdmin() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  // Form states
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/faqs", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setFaqs(data.data);
      } else {
        setError(data.message || "Failed to fetch FAQs");
      }
    } catch {
      setError("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setSortOrder(0);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (faq: Faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setSortOrder(faq.sortOrder);
    setError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Basic validation
    if (!question.trim() || question.length < 5) {
      setError("Question must be at least 5 characters.");
      setSaving(false);
      return;
    }
    if (!answer.trim() || answer.length < 10) {
      setError("Answer must be at least 10 characters.");
      setSaving(false);
      return;
    }

    const payload = { question, answer, sortOrder };

    try {
      const url = editingFaq ? `/api/faqs/${editingFaq.id}` : "/api/faqs";
      const method = editingFaq ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        // Reset form fields
        setQuestion("");
        setAnswer("");
        setSortOrder(0);
        fetchFaqs();
        showToast('FAQ saved successfully.', 'success');
      } else {
        // Handle validation errors from Zod (array of issues)
        if (data.errors && Array.isArray(data.errors)) {
          const msgs = data.errors.map((e: any) => e.message).join('; ');
          setError(msgs);
          showToast(msgs, 'error');
        } else {
          setError(data.message || "An error occurred while saving");
          showToast(data.message || "Failed to save FAQ", "error");
        }
      }
    } catch {
      setError("Failed to save FAQ");
      showToast("Failed to save FAQ", "error");
    } finally {
      setSaving(false);
    }

  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        showToast("FAQ deleted successfully.", "success");
        fetchFaqs();
      } else {
        showToast(data.message || "Failed to delete FAQ", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to delete FAQ", "error");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", marginBottom: "4px" }}>
            FAQs Manager
          </h1>
          <p style={{ fontSize: "14px", color: "#94A3B8" }}>
            Manage the list of Frequently Asked Questions shown on the public site
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            background: "#0F4C81", color: "#fff", border: "none", borderRadius: "10px",
            padding: "10px 20px", fontWeight: 600, fontSize: "14px", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(15,76,129,.2)",
          }}
        >
          + Add New FAQ
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#94A3B8" }}>Loading FAQs...</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {faqs.map((faq) => (
            <div key={faq.id} style={{
              background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
              padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              gap: "20px"
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", background: "rgba(15,76,129,0.08)", color: "#0F4C81", fontWeight: 700, padding: "2px 8px", borderRadius: "100px" }}>
                    Order: {faq.sortOrder}
                  </span>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
                    {faq.question}
                  </h3>
                </div>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
                  {faq.answer}
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
                <button
                  onClick={() => openEditModal(faq)}
                  style={{
                    background: "none", border: "none", color: "#0F4C81", fontWeight: 600,
                    cursor: "pointer", fontSize: "14px"
                  }}
                >Edit</button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  style={{
                    background: "none", border: "none", color: "#EF4444", fontWeight: 600,
                    cursor: "pointer", fontSize: "14px"
                  }}
                >Delete</button>
              </div>
            </div>
          ))}
          {faqs.length === 0 && (
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "32px", textAlign: "center", color: "#94A3B8" }}>
              No FAQs created yet. Create one using the button above.
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.3)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", width: "500px", padding: "32px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginBottom: "20px" }}>
              {editingFaq ? "Edit FAQ" : "Create New FAQ"}
            </h3>
            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#EF4444", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Question</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Answer</label>
                <textarea
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px", minHeight: "120px", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Sort Order</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ background: "#F1F5F9", color: "#475569", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ background: "#0F4C81", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
