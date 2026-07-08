"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../lib/CartContext";

export default function Navbar({ onToggleSidebar }) {
  const { data: session, status } = useSession();
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand navbar-light bg-white border-bottom px-3 sticky-top" style={{ height: "57px" }}>
      <div className="d-flex align-items-center w-100 justify-content-between">    
        {/* Left Side: Toggle and Logo */}
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-secondary border-0 me-3"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation drawer"
          >
            ☰
          </button>
          <span className="navbar-brand mb-0 h1 fw-bold text-primary">StoreLogo</span>
        </div>
        {/* Right Side: Action Triggers */}
        <div className="d-flex align-items-center gap-2">
          <Link 
            href="/cart"
            className="btn btn-light position-relative px-3 d-flex align-items-center justify-content-center" 
            aria-label="View Favorites"
            style={{ width: "42px", height: "42px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.171C12.72-3.042 23.333 4.867 8 15"/>
            </svg>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.7rem" }}>
                {cartCount}
              </span>
            )}
          </Link>

          {status === "authenticated" ? (
            <div className="position-relative" ref={dropdownRef}>
              <button
                className="btn p-0 border-0 rounded-circle overflow-hidden d-flex align-items-center justify-content-center text-white shadow-sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  width: "38px",
                  height: "38px",
                  background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                {session.user?.username 
                  ? session.user.username.substring(0, 2).toUpperCase() 
                  : session.user?.email?.substring(0, 2).toUpperCase() || "US"}
              </button>
              {dropdownOpen && (
                <div 
                  className="position-absolute end-0 mt-2 bg-white border rounded shadow p-2" 
                  style={{ zIndex: 1050, minWidth: "200px" }}
                >
                  <div className="px-3 py-2 border-bottom">
                    <div className="fw-bold text-dark text-truncate">{session.user?.username || "User"}</div>
                    <div className="text-muted small text-truncate">{session.user?.email}</div>
                  </div>
                  <Link 
                    href="/profile" 
                    className="dropdown-item d-block w-100 px-3 py-2 text-start text-dark text-decoration-none hover-bg-light"
                    style={{ cursor: "pointer", borderRadius: "4px" }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    👤 View Profile
                  </Link>
                  <button 
                    className="dropdown-item d-block w-100 px-3 py-2 text-start text-danger border-0 bg-transparent"
                    style={{ cursor: "pointer", borderRadius: "4px" }}
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/signin" className="btn btn-primary px-4 shadow-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}