"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/app/admin/layout";

export default function HeroAdmin() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [heroBadge, setHeroBadge] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroPrimaryCta, setHeroPrimaryCta] = useState("");
  const [heroSecondaryCta, setHeroSecondaryCta] = useState("");

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) {
        setHeroBadge(data.data.heroBadge || "Trusted Healthcare Technology Group — medicxus.com");
        setHeroTitle(data.data.heroTitle || "Empowering Healthcare. Transforming Lives.");
        setHeroSubtitle(data.data.heroSubtitle || "Medicxus Group bridges world-class health education, advanced diagnostics, International Medical and Health care education consultancy.");
        setHeroPrimaryCta(data.data.heroPrimaryCta || "Explore Our Divisions");
        setHeroSecondaryCta(data.data.heroSecondaryCta || "Learn About Us");
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
      heroBadge,
      heroTitle,
      heroSubtitle,
      heroPrimaryCta,
      heroSecondaryCta,
    };

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Homepage Hero configurations saved successfully!", "success");
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
          Hero Section Customizer
        </h1>
        <p style={{ fontSize: "14px", color: "#94A3B8" }}>
          Modify the primary text copy and action callouts featured at the very top of your homepage
        </p>
      </div>

      {loading ? (
        <p style={{ color: "#94A3B8" }}>Loading configurations...</p>
      ) : (
        <form onSubmit={handleSave} style={{ display: "grid", gap: "24px", maxWidth: "800px" }}>
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#EF4444", padding: "16px", borderRadius: "8px", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "grid", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Hero Pills Banner Badge</label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Main Title / Value Proposition</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                />
                <span style={{ fontSize: "11px", color: "#94A3B8" }}>Use full stop or line endings to structure hierarchy.</span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Supporting Subtitle</label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px", minHeight: "100px", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Primary Action Label (Amber Button)</label>
                  <input
                    type="text"
                    value={heroPrimaryCta}
                    onChange={(e) => setHeroPrimaryCta(e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Secondary Action Label (Outline Button)</label>
                  <input
                    type="text"
                    value={heroSecondaryCta}
                    onChange={(e) => setHeroSecondaryCta(e.target.value)}
                    style={{ width: "100%", padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  />
                </div>
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
              {saving ? "Saving configurations..." : "Save Customizer Copy"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
