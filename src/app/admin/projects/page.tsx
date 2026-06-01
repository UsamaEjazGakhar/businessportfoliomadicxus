"use client";

import { useToast } from "@/app/admin/layout";

import { useState, useEffect } from "react";

interface Division {
  id: string;
  title: string;
}

interface Project {
  id: string;
  divisionId: string;
  division: { title: string; slug: string };
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  targetUrl: string;
  status: "ACTIVE" | "IN_DEVELOPMENT" | "MAINTENANCE" | "REDIRECTED";
  category: string;
  sortOrder: number;
  clickCount: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [divisionId, setDivisionId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [status, setStatus] = useState<Project["status"]>("ACTIVE");
  const [category, setCategory] = useState("Education");
  const [sortOrder, setSortOrder] = useState(0);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
const [error, setError] = useState("");

  const { showToast, confirmDelete } = useToast();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, divRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/divisions")
      ]);
      const projData = await projRes.json();
      const divData = await divRes.json();

      if (projData.success) setProjects(projData.data);
      if (divData.success) setDivisions(divData.data);
    } catch {
      setError("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    if (divisions.length === 0) {
      setError('No divisions available. Cannot create project.');
      return;
    }
    setEditingProject(null);
    setDivisionId(divisions[0]?.id || "");
    setTitle("");
    setSlug("");
    setDescription("");
    setThumbnailUrl("/uploads/placeholder.png");
    setTargetUrl("");
    setStatus("ACTIVE");
    setCategory("Education");
    setSortOrder(0);
    setSeoTitle("");
    setSeoDescription("");
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setDivisionId(proj.divisionId);
    setTitle(proj.title);
    setSlug(proj.slug);
    setDescription(proj.description);
    setThumbnailUrl(proj.thumbnailUrl);
    setTargetUrl(proj.targetUrl);
    setStatus(proj.status);
    setCategory(proj.category);
    setSortOrder(proj.sortOrder);
    setSeoTitle(proj.seoTitle || "");
    setSeoDescription(proj.seoDescription || "");
    setError("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Basic client‑side validation
    if (!title.trim() || title.length < 2) {
      setError("Title must be at least 2 characters.");
      setSaving(false);
      return;
    }
    if (!slug.trim() || slug.length < 2) {
      setError("Slug must be at least 2 characters.");
      setSaving(false);
      return;
    }
    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      setSaving(false);
      return;
    }
    // URL validation removed – any string is allowed

    if (!divisionId) {
      setError("Division must be selected.");
      setSaving(false);
      return;
    }

      // Ensure target URL has protocol
      let finalUrl = targetUrl.trim();
      if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }

      const payload = {
        divisionId,
        title,
        slug,
        description,
        thumbnailUrl,
        targetUrl: finalUrl,
        status,
        category,
        sortOrder,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      };

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        showToast("Project saved successfully.", "success");
        fetchData();
      } else {
        // API validation errors (Zod)
        if (data.errors && Array.isArray(data.errors)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const msgs = (data.errors as any[]).map((e) => e.message).join('; ');
          setError(msgs);
          showToast(msgs, "error");
        } else {
          setError(data.message || "An error occurred while saving");
          showToast(data.message || "Failed to save project", "error");
        }
      }
    } catch {
      setError("Failed to save project");
      showToast("Failed to save project", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    confirmDelete(
      "Are you sure you want to delete this project?",
      async () => {
        try {
          const res = await fetch(`/api/projects/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          const data = await res.json();
          if (data.success) {
            showToast("Project deleted successfully.", "success");
            fetchData();
          } else {
            showToast(data.message || "Failed to delete project", "error");
          }
        } catch (e) {
          console.error(e);
          showToast("Failed to delete project", "error");
        }
      }
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", marginBottom: "4px" }}>
            Project Showcase Grid
          </h1>
          <p style={{ fontSize: "14px", color: "#94A3B8" }}>
            Manage and track exit links, click statistics, and division portfolios
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={divisions.length === 0}
          style={{
            background: "#0F4C81", color: "#fff", border: "none", borderRadius: "10px",
            padding: "10px 20px", fontWeight: 600, fontSize: "14px", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(15,76,129,.2)",
            opacity: divisions.length === 0 ? 0.5 : 1
          }}
        >
          + Add New Project
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#94A3B8" }}>Loading projects...</p>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E2E8F0", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Title</th>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Division</th>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Category</th>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Status</th>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Click Analytics</th>
                <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "16px 12px" }}>
                    <div style={{ fontWeight: 600, color: "#0F172A" }}>{proj.title}</div>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>{proj.targetUrl}</div>
                  </td>
                  <td style={{ padding: "16px 12px", color: "#475569" }}>{proj.division?.title || "None"}</td>
                  <td style={{ padding: "16px 12px", color: "#475569" }}>{proj.category}</td>
                  <td style={{ padding: "16px 12px" }}>
                    <span style={{
                      fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "100px",
                      background: proj.status === "ACTIVE" ? "rgba(34,197,94,.1)" :
                                  proj.status === "IN_DEVELOPMENT" ? "rgba(245,158,11,.1)" :
                                  proj.status === "MAINTENANCE" ? "rgba(239,68,68,.1)" : "rgba(148,163,184,.1)",
                      color: proj.status === "ACTIVE" ? "#22c55e" :
                             proj.status === "IN_DEVELOPMENT" ? "#F59E0B" :
                             proj.status === "MAINTENANCE" ? "#EF4444" : "#94A3B8"
                    }}>
                      {proj.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "16px 12px", fontWeight: 700, color: "#0F4C81" }}>
                    📊 {proj.clickCount} clicks
                  </td>
                  <td style={{ padding: "16px 12px", textAlign: "right" }}>
                    <button
                      onClick={() => openEditModal(proj)}
                      style={{
                        background: "none", border: "none", color: "#0F4C81", fontWeight: 600,
                        cursor: "pointer", marginRight: "12px", fontSize: "14px"
                      }}
                    >Edit</button>
                    <button
                      onClick={() => handleDelete(proj.id)}
                      style={{
                        background: "none", border: "none", color: "#EF4444", fontWeight: 600,
                        cursor: "pointer", fontSize: "14px"
                      }}
                    >Delete</button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#94A3B8" }}>
                    No projects found. Add your first project using the button above.
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
            background: "#fff", borderRadius: "16px", width: "550px", padding: "32px",
            maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginBottom: "20px" }}>
              {editingProject ? "Edit Project" : "Create New Project"}
            </h3>
            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#EF4444", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Business Division</label>
                  <select
                    value={divisionId}
                    onChange={(e) => setDivisionId(e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  >
                    {divisions.map((d) => (
                      <option key={d.id} value={d.id}>{d.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Category Taxonomy</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingProject) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }
                  }}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
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
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px", minHeight: "80px", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Target Destination URL (Redirect)</label>
                <input
                  type="text"
                  required
                  placeholder="Enter target URL"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Project["status"])}
                    style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="IN_DEVELOPMENT">In Development</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="REDIRECTED">Redirected</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  />
                </div>
              </div>

              <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "16px", marginTop: "16px", marginBottom: "24px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", marginBottom: "12px" }}>SEO Meta Overrides</h4>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>SEO Title override</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    style={{ width: "100%", padding: "8px", border: "1px solid #E2E8F0", borderRadius: "6px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>SEO Description override</label>
                  <input
                    type="text"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    style={{ width: "100%", padding: "8px", border: "1px solid #E2E8F0", borderRadius: "6px" }}
                  />
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
