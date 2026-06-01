"use client";

import { useState } from "react";
import { useToast } from "@/app/admin/layout";

export default function BlogsAdmin() {
  const { showToast } = useToast();
  const [blogs] = useState([
    {
      id: "1",
      title: "The Evolution of Hospital Management Systems",
      author: "Dr. Bilal Siddiqui",
      category: "Healthcare Technology",
      status: "Published",
      publishedAt: "2026-05-15",
      readTime: "5 min read",
    },
    {
      id: "2",
      title: "Guiding Medical Students: Preparing for MBBS Abroad",
      author: "Prof. Sarah Khan",
      category: "Education Consultancy",
      status: "Draft",
      publishedAt: "N/A",
      readTime: "8 min read",
    },
    {
      id: "3",
      title: "Why Automation is Critical for Modern Diagnostics Labs",
      author: "Engr. Usman Ghafoor",
      category: "Diagnostics / Lab Automation",
      status: "Published",
      publishedAt: "2026-05-10",
      readTime: "4 min read",
    },
  ]);

  // State for create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newContent, setNewContent] = useState("");

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);

  // Update blogs list dynamically with explicit type
  const [blogList, setBlogList] = useState<Blog[]>(blogs);

  const handleCreateSave = () => {
    if (!newTitle.trim() || newTitle.length < 2) {
      showToast("Title must be at least 2 characters.", "error");
      return;
    }
    if (!newAuthor.trim()) {
      showToast("Author is required.", "error");
      return;
    }
    const newBlog = {
      id: (blogList.length + 1).toString(),
      title: newTitle,
      author: newAuthor,
      category: newCategory || "General",
      status: "Draft",
      publishedAt: "N/A",
      readTime: `${Math.ceil(newContent.split(" ").length / 200)} min read`,
    };
    setBlogList([...blogList, newBlog]);
    setShowCreateModal(false);
    // Reset fields
    setNewTitle("");
    setNewAuthor("");
    setNewCategory("");
    setNewContent("");
    showToast("Blog post created successfully.", "success");
  };

  // Handle preview modal with explicit types
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
  const handlePreview = (blog: Blog) => {
    setPreviewBlog(blog);
  };
  const closePreview = () => setPreviewBlog(null);

  // Handle edit modal save
  const handleEditSave = () => {
    if (!editBlog) return;
    setBlogList(blogList.map(b => b.id === editBlog.id ? editBlog : b));
    setShowEditModal(false);
    setEditBlog(null);
    showToast("Blog status updated.", "success");
  };

  // Render create modal when needed
  const renderCreateModal = showCreateModal && (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", width: "400px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: 600, color: "#0F172A" }}>Write New Blog Post</h2>
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #E2E8F0", borderRadius: "6px" }}
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Author"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #E2E8F0", borderRadius: "6px" }}
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Category (optional)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #E2E8F0", borderRadius: "6px" }}
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <textarea
            placeholder="Content"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={6}
            style={{ width: "100%", padding: "8px", border: "1px solid #E2E8F0", borderRadius: "6px", resize: "vertical" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button
            onClick={() => setShowCreateModal(false)}
            style={{ background: "#e5e7eb", color: "#111", border: "none", borderRadius: "6px", padding: "8px 12px", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateSave}
            style={{ background: "#0F4C81", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 12px", cursor: "pointer" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {renderCreateModal}
      {previewBlog && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", width: "400px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
            <h2 style={{ marginBottom: "16px", fontSize: "20px", fontWeight: 600, color: "#0F172A" }}>{previewBlog.title}</h2>
            <p style={{ marginBottom: "12px" }}>Author: {previewBlog.author}</p>
            <p style={{ marginBottom: "12px" }}>Category: {previewBlog.category}</p>
            <p style={{ marginBottom: "12px" }}>Status: {previewBlog.status}</p>
            <button onClick={closePreview} style={{ background: "#e5e7eb", border: "none", borderRadius: "6px", padding: "8px 12px", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
      {showEditModal && editBlog && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", width: "300px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
            <h3 style={{ marginBottom: "12px" }}>Edit Status</h3>
            <select value={editBlog.status} onChange={e => setEditBlog({ ...editBlog, status: e.target.value })} style={{ width: "100%", padding: "8px", marginBottom: "12px" }}>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={() => setShowEditModal(false)} style={{ background: "#e5e7eb", border: "none", borderRadius: "6px", padding: "8px 12px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleEditSave} style={{ background: "#0F4C81", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 12px", cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", marginBottom: "4px" }}>
            Corporate Blog Editor
          </h1>
          <p style={{ fontSize: "14px", color: "#94A3B8" }}>
            Publish updates, research summaries, and education consultant guide articles
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: "#0F4C81", color: "#fff", border: "none", borderRadius: "10px",
            padding: "10px 20px", fontWeight: 600, fontSize: "14px", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(15,76,129,.2)",
          }}
        >
          + Write New Post
        </button>
      </div>

      <div style={{ background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "12px", padding: "16px", marginBottom: "28px", color: "#B45309", fontSize: "14px", fontWeight: 500 }}>
        ⚠️ <strong>Notice:</strong> The Blog database entities are under schema optimization. Form submissions are running in preview mode.
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E2E8F0", textAlign: "left" }}>
              <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Post Title</th>
              <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Author</th>
              <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Category</th>
              <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Read Time</th>
              <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogList.map((blog: Blog) => (
              <tr key={blog.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "16px 12px" }}>
                  <div style={{ fontWeight: 600, color: "#0F172A" }}>{blog.title}</div>
                  <div style={{ fontSize: "12px", color: "#94A3B8" }}>Published: {blog.publishedAt}</div>
                </td>
                <td style={{ padding: "16px 12px", color: "#475569" }}>{blog.author}</td>
                <td style={{ padding: "16px 12px", color: "#475569" }}>{blog.category}</td>
                <td style={{ padding: "16px 12px", color: "#475569" }}>{blog.readTime}</td>
                <td style={{ padding: "16px 12px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "100px",
                    background: blog.status === "Published" ? "rgba(34,197,94,.1)" : "rgba(148,163,184,.1)",
                    color: blog.status === "Published" ? "#22c55e" : "#94A3B8"
                  }}>
                    {blog.status}
                  </span>
                </td>
                <td style={{ padding: "16px 12px", textAlign: "right" }}>
                  <button
                    onClick={() => handlePreview(blog)}
                    style={{
                      background: "none", border: "none", color: "#0F4C81", fontWeight: 600,
                      cursor: "pointer", fontSize: "14px"
                    }}
                  >Preview</button>
                  <button
                    onClick={() => { setEditBlog({ ...blog }); setShowEditModal(true); }}
                    style={{ marginLeft: "8px", background: "none", border: "none", color: "#0F4C81", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}
                  >Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
