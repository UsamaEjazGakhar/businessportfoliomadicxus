"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.message || "Failed to submit inquiry");
      }
    } catch {
      setError("An error occurred while submitting your inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <label style={{
          display: "block", fontSize: "14px", fontWeight: 600, color: "#0F172A",
          marginBottom: "8px",
        }}>Your Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          minLength={2}
          placeholder="John Doe"
          style={{
            width: "100%", padding: "12px 16px", border: "1px solid #E2E8F0",
            borderRadius: "10px", fontSize: "14px", fontFamily: "inherit",
            transition: "all .2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#0F4C81"}
          onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{
          display: "block", fontSize: "14px", fontWeight: 600, color: "#0F172A",
          marginBottom: "8px",
        }}>Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="john@example.com"
          style={{
            width: "100%", padding: "12px 16px", border: "1px solid #E2E8F0",
            borderRadius: "10px", fontSize: "14px", fontFamily: "inherit",
            transition: "all .2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#0F4C81"}
          onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{
          display: "block", fontSize: "14px", fontWeight: 600, color: "#0F172A",
          marginBottom: "8px",
        }}>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
          style={{
            width: "100%", padding: "12px 16px", border: "1px solid #E2E8F0",
            borderRadius: "10px", fontSize: "14px", fontFamily: "inherit",
            transition: "all .2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#0F4C81"}
          onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{
          display: "block", fontSize: "14px", fontWeight: 600, color: "#0F172A",
          marginBottom: "8px",
        }}>Subject *</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          minLength={3}
          placeholder="How can we help?"
          style={{
            width: "100%", padding: "12px 16px", border: "1px solid #E2E8F0",
            borderRadius: "10px", fontSize: "14px", fontFamily: "inherit",
            transition: "all .2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#0F4C81"}
          onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{
          display: "block", fontSize: "14px", fontWeight: 600, color: "#0F172A",
          marginBottom: "8px",
        }}>Message *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          minLength={10}
          placeholder="Tell us more about your inquiry..."
          rows={5}
          style={{
            width: "100%", padding: "12px 16px", border: "1px solid #E2E8F0",
            borderRadius: "10px", fontSize: "14px", fontFamily: "inherit",
            resize: "vertical", transition: "all .2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#0F4C81"}
          onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
        />
      </div>

      {error && (
        <div style={{
          background: "#FEE2E2", border: "1px solid #FCA5A5", color: "#991B1B",
          padding: "12px 16px", borderRadius: "8px", marginBottom: "24px", fontSize: "14px",
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: "#DCFCE7", border: "1px solid #86EFAC", color: "#166534",
          padding: "12px 16px", borderRadius: "8px", marginBottom: "24px", fontSize: "14px",
        }}>
          ✓ Thank you! Your inquiry has been submitted. We&apos;ll be in touch soon.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%", background: loading ? "#999" : "#0F4C81",
          color: "#fff", border: "none", borderRadius: "11px",
          padding: "14px 24px", fontWeight: 700, fontSize: "15px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all .2s", opacity: loading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#0a3a65")}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#0F4C81")}
      >
        {loading ? "Submitting..." : "Send Inquiry →"}
      </button>
    </form>
  );
}
