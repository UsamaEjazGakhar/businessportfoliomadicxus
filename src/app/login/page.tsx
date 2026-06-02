"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");

  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Clear any lingering NextAuth error params in the URL
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('error') || url.searchParams.has('callbackUrl')) {
      // Remove query parameters and stay on the login page
      router.replace('/');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      const message = result.error === "CredentialsSignin" ? "Invalid username or password" : result.error;
      setError(message);
    } else {
      router.push("/admin");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername,
          password: signupPassword,
          email: signupEmail,
          name: signupName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSignupError(data?.error || "Registration failed");
        setSignupLoading(false);
        return;
      }

      // After account creation, login automatically.
      const result = await signIn("credentials", {
        username: signupUsername,
        password: signupPassword,
        redirect: false,
      });

      if (result?.error) {
        setSignupError(result.error);
        setSignupLoading(false);
        return;
      }

      router.push("/");
    } catch {
      setSignupError("Registration failed");
      setSignupLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0B1220 0%,#0F2D4F 55%,#0a2540 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle,rgba(20,184,166,.15) 0%,transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "20%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle,rgba(245,158,11,.08) 0%,transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          background: "rgba(255,255,255,.04)",
          border: "1px solid rgba(255,255,255,.1)",
          borderRadius: "24px",
          padding: "48px",
          maxWidth: "420px",
          width: "100%",
          backdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "26px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              margin: "0 auto 16px",
              background: "linear-gradient(135deg,#0F4C81,#14B8A6)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: "24px",
              fontStyle: "italic",
              boxShadow: "0 8px 24px rgba(15,76,129,.35)",
            }}
          >
            M
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.5px",
              marginBottom: "8px",
            }}
          >
            Medic<span style={{ color: "#14B8A6" }}>xus</span> Portal
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,.4)" }}>
            {mode === "login"
              ? "Sign in to continue"
              : "Create an account to continue"}
          </p>
        </div>

        {/* Mode Switch */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.12)",
              background:
                mode === "login" ? "rgba(20,184,166,.18)" : "rgba(255,255,255,.04)",
              color: mode === "login" ? "#14B8A6" : "rgba(255,255,255,.6)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setSignupError("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.12)",
              background:
                mode === "signup" ? "rgba(20,184,166,.18)" : "rgba(255,255,255,.04)",
              color: mode === "signup" ? "#14B8A6" : "rgba(255,255,255,.6)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error */}
        {mode === "login" && error && (
          <div
            style={{
              background: "rgba(239,68,68,.15)",
              border: "1px solid rgba(239,68,68,.3)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        {/* Quick Navigation */}
        <div style={{ marginBottom: 18 }}>
          <button
            type="button"
            onClick={() => {
              // callbackUrl ke through login page par wapas redirect issue ho raha ho to URL clean kar dein
              window.history.replaceState({}, "", "/");
              window.location.assign("/");
            }}


            style={{
              width: "100%",
              padding: "12px 14px",
              background: "rgba(255,255,255,.04)",
              color: "rgba(255,255,255,.85)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            ← Back to Home
          </button>
        </div>

        {/* Form */}
        {mode === "login" ? (
          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,.6)",
                  marginBottom: "8px",
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color .2s",
                }}
                placeholder="Enter your username"
              />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,.6)",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color .2s",
                }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading
                  ? "#94A3B8"
                  : "linear-gradient(135deg,#F59E0B,#D97706)",
                color: "#0B1220",
                borderRadius: "11px",
                fontWeight: 700,
                fontSize: "15px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all .2s",
              }}
            >
              {loading ? "Authenticating..." : "Sign In →"}
            </button>


          </form>
        ) : (
          <form onSubmit={handleSignup}>
            {signupError && (
              <div
                style={{
                  background: "rgba(239,68,68,.15)",
                  border: "1px solid rgba(239,68,68,.3)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  color: "#f87171",
                }}
              >
                {signupError}
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,.6)",
                  marginBottom: "8px",
                }}
              >
                Name
              </label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color .2s",
                }}
                placeholder="Enter your name"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,.6)",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color .2s",
                }}
                placeholder="Enter your email"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,.6)",
                  marginBottom: "8px",
                }}
              >
                Username
              </label>
              <input
                type="text"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color .2s",
                }}
                placeholder="Choose a username"
              />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,.6)",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color .2s",
                }}
                placeholder="Create a password"
              />
            </div>

            <button
              type="submit"
              disabled={signupLoading}
              style={{
                width: "100%",
                padding: "14px",
                background: signupLoading
                  ? "#94A3B8"
                  : "linear-gradient(135deg,#14B8A6,#0F4C81)",
                color: "#fff",
                borderRadius: "11px",
                fontWeight: 800,
                fontSize: "15px",
                border: "none",
                cursor: signupLoading ? "not-allowed" : "pointer",
                transition: "all .2s",
              }}
            >
              {signupLoading ? "Creating..." : "Create Account →"}
            </button>
          </form>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "26px",
            fontSize: "12px",
            color: "rgba(255,255,255,.25)",
          }}
        >
          Medicxus Group © 2026
        </p>
      </div>
    </div>
  );
}

