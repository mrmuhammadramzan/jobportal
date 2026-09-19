"use client";
/**
 * global-error.tsx — Root layout error boundary.
 * Catches errors thrown by the root layout.tsx itself.
 * Must include its own <html> and <body> since layout may be broken.
 *
 * This is the last line of defence — shown when even the layout crashes.
 */
import React, { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[RozeDesk Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#09090b",
          color: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "400px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem", fontWeight: 900 }}>
              Critical Error
            </h2>
            <p style={{ margin: 0, color: "#a1a1aa", fontSize: "0.875rem", lineHeight: 1.6 }}>
              The application encountered a critical error and cannot recover.
              Please refresh the page.
            </p>
            {error.digest && (
              <p style={{ marginTop: "0.5rem", color: "#71717a", fontSize: "0.75rem" }}>
                ID: {error.digest}
              </p>
            )}
          </div>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #1565ff, #00c9a7)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{ color: "#1565ff", fontSize: "0.875rem", textDecoration: "underline" }}
          >
            Back to Home
          </a>
        </div>
      </body>
    </html>
  );
}
