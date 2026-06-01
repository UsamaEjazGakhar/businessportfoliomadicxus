"use client";

import { useToast } from "@/app/admin/layout";

import { useState, useEffect } from "react";

type ApiError = { path?: string[]; message: string };

interface Division {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  iconColor: string;
  sortOrder: number;
  _count?: { projects: number };
}

export default function DivisionsAdmin() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🎓");
  const [iconColor, setIconColor] = useState("icon-blue");
  const [sortOrder, setSortOrder] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/divisions", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setDivisions(data.data);
      } else {
        setError(data.message || "Failed to fetch divisions");
      }
    } catch {
      setError("Failed to fetch divisions");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingDivision(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setIcon("🎓");
    setIconColor("icon-blue");
    setSortOrder(0);
    setError("");
    setValidationErrors({});
    setModalOpen(true);
  };

  const openEditModal = (div: Division) => {
    setEditingDivision(div);
    setTitle(div.title);
    setSlug(div.slug);
    setDescription(div.description);
    setIcon(div.icon);
    setIconColor(div.iconColor);
    setSortOrder(div.sortOrder);
    setError("");
    setValidationErrors({});
    setModalOpen(true);
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = { title, slug, description, icon, iconColor, sortOrder };

    try {
      const url = editingDivision
        ? `/api/divisions/${editingDivision.id}`
        : "/api/divisions";
      const method = editingDivision ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchDivisions();
      } else {
        // Populate field-specific errors if provided
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors: Record<string, string> = {};
          (data.errors as ApiError[]).forEach((err) => {
            const field = err.path && err.path[0] ? err.path[0] : 'form';
            fieldErrors[field] = err.message;
          });
          setValidationErrors(fieldErrors);
        }
        const errMsg = data.message || (data.errors ? JSON.stringify(data.errors) : "An error occurred while saving");
        setError(errMsg);
      }
    } catch {
      setError("Failed to save division");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this division? This will cascade-delete all associated projects.")) return;
    try {
      const res = await fetch(`/api/divisions/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Division deleted successfully", "success");
        fetchDivisions();
      } else {
        showToast(data.message || "Failed to delete division", "error");
      }
    } catch {
      showToast("Failed to delete division", "error");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", marginBottom: "4px" }}>
            Business Divisions
          </h1>
          <p style={{ fontSize: "14px", color: "#94A3B8" }}>
            Manage the core business verticals and operational pillars of Medicxus Group
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
          + Add New Division
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#94A3B8" }}>Loading divisions...</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E2E8F0", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Pillar</th>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Title</th>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Slug</th>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Projects Count</th>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Sort Order</th>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {divisions.map((div) => (
                <tr key={div.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "16px 12px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "10px",
                      background: div.iconColor === "icon-blue" ? "rgba(15,76,129,.1)" :
                                  div.iconColor === "icon-teal" ? "rgba(20,184,166,.1)" :
                                  div.iconColor === "icon-amber" ? "rgba(245,158,11,.1)" : "rgba(168,85,247,.1)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px"
                    }}>
                      {div.icon}
                    </div>
                  </td>
                  <td style={{ padding: "16px 12px", fontWeight: 600, color: "#0F172A" }}>{div.title}</td>
                  <td style={{ padding: "16px 12px", color: "#475569" }}>{div.slug}</td>
                  <td style={{ padding: "16px 12px", color: "#475569" }}>{div._count?.projects || 0}</td>
                  <td style={{ padding: "16px 12px", color: "#475569" }}>{div.sortOrder}</td>
                  <td style={{ padding: "16px 12px", textAlign: "right" }}>
                    <button
                      onClick={() => openEditModal(div)}
                      style={{
                        background: "none", border: "none", color: "#0F4C81", fontWeight: 600,
                        cursor: "pointer", marginRight: "12px", fontSize: "14px"
                      }}
                    >Edit</button>
                    <button
                      onClick={() => handleDelete(div.id)}
                      style={{
                        background: "none", border: "none", color: "#EF4444", fontWeight: 600,
                        cursor: "pointer", fontSize: "14px"
                      }}
                    >Delete</button>
                  </td>
                </tr>
              ))}
              {divisions.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#94A3B8" }}>
                    No divisions created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
              {editingDivision ? "Edit Division" : "Create New Division"}
            </h3>
            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#EF4444", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingDivision) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }
                  }}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
                {validationErrors.title && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#EF4444", padding: "8px", borderRadius: "6px", marginTop: "4px", fontSize: "13px" }}>
                    {validationErrors.title}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px", minHeight: "100px", fontFamily: "inherit" }}
                />
                {validationErrors.description && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#EF4444", padding: "8px", borderRadius: "6px", marginTop: "4px", fontSize: "13px" }}>
                    {validationErrors.description}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Icon (Emoji)</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  >
                    <option value="🎓">🎓 Education</option>
                    <option value="🏥">🏥 Healthcare</option>
                    <option value="🔬">🔬 Lab / Precision</option>
                    <option value="💡">💡 Consultancy</option>
                    <option value="🌐">🌐 IT / Global</option>
                    <option value="🏆">🏆 Trophy</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Color Theme</label>
                  <select
                    value={iconColor}
                    onChange={(e) => setIconColor(e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  >
                    <option value="icon-blue">Navy Blue</option>
                    <option value="icon-teal">Teal Green</option>
                    <option value="icon-amber">Amber Orange</option>
                    <option value="icon-purple">Purple</option>
                  </select>
                </div>
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
