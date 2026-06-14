"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { GoogleSignInButton } from "@/components/ui/GoogleSignInButton";

export function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: "blur(20px)",
        background: "rgba(4, 0, 16, 0.8)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 48px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            className="gradient-brand-text font-display"
            style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            IQ
          </span>
        </Link>

        {/* Auth — wait for Clerk to load before rendering to avoid hydration mismatch */}
        {isLoaded && (
          isSignedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Link
                href="/dashboard"
                className="font-label"
                style={{ fontSize: "11px", color: "#CBD5E1", textDecoration: "none" }}
              >
                Dashboard
              </Link>
              <UserButton
                appearance={{
                  elements: { avatarBox: { width: 34, height: 34 } },
                }}
              />
            </div>
          ) : (
            <GoogleSignInButton size="sm" />
          )
        )}
      </div>
    </nav>
  );
}
