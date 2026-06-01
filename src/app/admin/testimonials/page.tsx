"use client";




import { useState, useEffect } from "react";
import { useToast } from "@/app/admin/layout";

interface Testimonial {
  id: string;
  authorName: string;
  role: string;
  company: string | null;
  content: string;
  rating: number;
  avatarUrl: string | null;
  isApproved: boolean;
  createdAt: string;
}

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const { showToast, confirmDelete } = useToast();

  // Form states
  const [authorName, setAuthorName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/testimonials?all=true");
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch {
      setError("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (test: Testimonial) => {
    try {
      const payload = {
        authorName: test.authorName,
        role: test.role,
        company: test.company,
        content: test.content,
        rating: test.rating,
        avatarUrl: test.avatarUrl,
        isApproved: !test.isApproved,
      };

      const res = await fetch(`/api/testimonials/${test.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        fetchTestimonials();
      } else {
        showToast(data.message || "Failed to update approval", "error");
      }
    } catch {
      showToast("Failed to update testimonial", "error");
    }
  };

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setAuthorName("");
    setRole("");
    setCompany("");
    setContent("");
    setRating(5);
    setAvatarUrl("/uploads/placeholder-user.png");
    setIsApproved(true);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (test: Testimonial) => {
    setEditingTestimonial(test);
    setAuthorName(test.authorName);
    setRole(test.role);
    setCompany(test.company || "");
    setContent(test.content);
    setRating(test.rating);
    setAvatarUrl(test.avatarUrl || "");
    setIsApproved(test.isApproved);
    setError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      authorName,
      role,
      company: company || null,
      content,
      rating,
      avatarUrl: avatarUrl || null,
      isApproved,
    };

    try {
      const url = editingTestimonial
        ? `/api/testimonials/${editingTestimonial.id}`
        : "/api/testimonials";
      const method = editingTestimonial ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchTestimonials();
      } else {
        setError(data.message || "An error occurred while saving");
      }
    } catch {
      setError("Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    confirmDelete(
      "Are you sure you want to delete this testimonial?",
      async () => {
        try {
          const res = await fetch(`/api/testimonials/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          const data = await res.json();
          if (data.success) {
            showToast("Testimonial deleted successfully.", "success");
            fetchTestimonials();
          } else {
            showToast(data.message || "Failed to delete testimonial", "error");
          }
        } catch (e) {
          console.error(e);
          showToast("Failed to delete testimonial", "error");
        }
      }
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", marginBottom: "4px" }}>
            Testimonials & Trust Panel
          </h1>
          <p style={{ fontSize: "14px", color: "#94A3B8" }}>
            Review, approve, and edit recommendations from hospital directors, students, and partners
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
          + Add New Testimonial
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#94A3B8" }}>Loading testimonials...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {testimonials.map((test) => (
            <div key={test.id} style={{
              background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
              padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(0,0,0,.02)"
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx} style={{ color: idx < test.rating ? "#F59E0B" : "#E2E8F0", fontSize: "16px" }}>★</span>
                    ))}
                  </div>
                  <button
                    onClick={() => toggleApproval(test)}
                    style={{
                      border: "none", borderRadius: "100px", padding: "4px 12px", fontSize: "12px", fontWeight: 700,
                      cursor: "pointer",
                      background: test.isApproved ? "rgba(34,197,94,.1)" : "rgba(245,158,11,.1)",
                      color: test.isApproved ? "#22c55e" : "#F59E0B",
                    }}
                  >
                    {test.isApproved ? "Approved" : "Pending Approval"}
                  </button>
                </div>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, marginBottom: "20px", fontStyle: "italic" }}>
                  &ldquo;{test.content}&rdquo;
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", margin: 0 }}>{test.authorName}</h4>
                  <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>
                    {test.role} {test.company ? `at ${test.company}` : ""}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => openEditModal(test)}
                    style={{ background: "none", border: "none", color: "#0F4C81", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(test.id)}
                    style={{ background: "none", border: "none", color: "#EF4444", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
                  >Delete</button>
                </div>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "32px", textAlign: "center", color: "#94A3B8", gridColumn: "1 / -1" }}>
              No testimonials created yet.
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
              {editingTestimonial ? "Edit Testimonial" : "Create New Testimonial"}
            </h3>
            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#EF4444", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Author Name</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Role / Title</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Director"
                    style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Company / Affiliate</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. City Hospital"
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Testimonial Content</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px", minHeight: "100px", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Rating (Stars)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value) || 5)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "24px" }}>
                  <input
                    type="checkbox"
                    id="isApproved"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                  <label htmlFor="isApproved" style={{ fontSize: "14px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>Approved & Public</label>
                </div>
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
