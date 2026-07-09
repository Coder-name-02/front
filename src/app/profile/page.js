"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect signin if not login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow border-0 rounded-4 p-5 max-w-md mx-auto">
          <h2 className="mb-4 fw-bold text-dark">Access Denied</h2>
          <p className="text-muted mb-4">Please sign in to view your profile details.</p>
          <Link href="/signin" className="btn btn-primary px-5 py-2 shadow-sm rounded-pill">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  const user = session.user || {};
 
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            {/* Header  */}
            <div 
              className="p-5 text-center text-white position-relative" 
              style={{
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)"
              }}
            >
              {/* profile */}
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-md border border-white border-3 mb-3 bg-white text-primary"
                style={{
                  width: "90px",
                  height: "90px",
                  fontSize: "2.25rem",
                  fontWeight: "bold",
                  color: "#764ba2"
                }}
              >
                {user.username 
                  ? user.username.substring(0, 2).toUpperCase() 
                  : user.email?.substring(0, 2).toUpperCase() || "US"}
              </div>
              <h3 className="mb-1 fw-bold">{user.username || "User Profile"}</h3>
              <span className="badge bg-white text-primary rounded-pill px-3 py-1 text-uppercase fw-semibold" style={{ letterSpacing: "1px", fontSize: "0.75rem" }}>
                {user.role || "user"}
              </span>
            </div>

            {/* Profile Info */}
            <div className="card-body p-4 bg-white">
              <h5 className="mb-4 fw-bold text-dark border-bottom pb-2">Profile Details</h5>
              
              <div className="mb-3">
                <label className="text-muted small text-uppercase fw-bold d-block">Username</label>
                <div className="fs-5 fw-semibold text-dark">{user.username || "Not set"}</div>
              </div>

              <div className="mb-3">
                <label className="text-muted small text-uppercase fw-bold d-block">Email Address</label>
                <div className="fs-5 fw-semibold text-dark">{user.email || "Not set"}</div>
              </div>

              <div className="mb-3">
                <label className="text-muted small text-uppercase fw-bold d-block">Role Permissions</label>
                <div className="fs-5 fw-semibold text-dark">
                  <span className="text-capitalize">{user.role || "user"}</span>
                </div>
              </div>

              {user.id && (
                <div className="mb-3">
                  <label className="text-muted small text-uppercase fw-bold d-block">Account ID</label>
                  <div className="text-monospace small text-muted">{user.id}</div>
                </div>
              )}

              {user.created_at && (
                <div className="mb-3">
                  <label className="text-muted small text-uppercase fw-bold d-block">Member Since</label>
                  <div className="fs-6 text-muted">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </div>
                </div>
              )}

              {/* logout Buttons */}
              <div className="d-grid gap-2 mt-5">
                <button 
                  className="btn btn-outline-danger py-2 rounded-pill fw-semibold"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  🚪 Logout Session
                </button>
                <Link href="/" className="btn btn-light py-2 rounded-pill fw-semibold text-muted text-center">
                  🏠 Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
