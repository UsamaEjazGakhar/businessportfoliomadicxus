"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/app/admin/layout";

export default function SettingsAdmin() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Input states (bind values dynamically)
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) {
        // Set state variables
        setSeoTitle(data.data.seoTitle || "Medicxus Group");
        setSeoDescription(data.data.seoDescription || "");
        setSeoKeywords(data.data.seoKeywords || "");
        setContactEmail(data.data.contactEmail || "info@medicxus.com");
        setContactPhone(data.data.contactPhone || "");
        setContactAddress(data.data.contactAddress || "");
        setSocialLinkedin(data.data.socialLinkedin || "");
        setSocialTwitter(data.data.socialTwitter || "");
      }
    } catch {
      setError("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      seoTitle,
      seoDescription,
      seoKeywords,
      contactEmail,
      contactPhone,
      contactAddress,
      socialLinkedin,
      socialTwitter,
    };

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Global system settings saved successfully!", "success");
      } else {
        setError(data.message || "Failed to save settings");
      }
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", marginBottom: "4px" }}>
          Global Settings
        </h1>
        <p style={{ fontSize: "14px", color: "#94A3B8" }}>
          Configure global metadata, search engine optimization keywords, and corporate contact addresses
        </p>
      </div>

      {loading ? (
        <p style={{ color: "#94A3B8" }}>Loading settings...</p>
      ) : (
        <form onSubmit={handleSave} style={{ display: "grid", gap: "24px", maxWidth: "800px" }}>
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#EF4444", padding: "16px", borderRadius: "8px", fontSize: "14px" }}>
              {error}
            </div>
          )}

          {/* SEO Block */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "20px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px" }}>
              Search Engine Optimization (SEO)
            </h3>
            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Global Site Title Prefix</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Meta Description</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px", minHeight: "80px", fontFamily: "inherit" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Keywords (comma separated)</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="e.g. MBBS, healthcare, diagnostics"
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>
            </div>
          </div>

          {/* Contact Block */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "20px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px" }}>
              Corporate Contact Coordinates
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Support Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Contact Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Headquarters Address</label>
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
              />
            </div>
          </div>

          {/* Social Profiles */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "20px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px" }}>
              Social Network Profiles
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>LinkedIn URL</label>
                <input
                  type="url"
                  value={socialLinkedin}
                  onChange={(e) => setSocialLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Twitter / X URL</label>
                <input
                  type="url"
                  value={socialTwitter}
                  onChange={(e) => setSocialTwitter(e.target.value)}
                  placeholder="https://x.com/..."
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: "#0F4C81", color: "#fff", border: "none", borderRadius: "10px",
                padding: "12px 30px", fontWeight: 600, fontSize: "15px", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(15,76,129,.2)",
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? "Saving settings..." : "Save System Config"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
