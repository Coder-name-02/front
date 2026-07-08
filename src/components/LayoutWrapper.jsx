"use client";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "../lib/CartContext";

export default function LayoutWrapper({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <SessionProvider>
      <CartProvider>
        <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
          {/* Top Navbar */}
          <Navbar onToggleSidebar={toggleSidebar} />
        {/* Main Body Section */}
        <div className="d-flex flex-grow-1" style={{ position: "relative" }}>
          {/* Navigation Sidebar */}
          <Sidebar isOpen={sidebarOpen} />
          {/* Content Viewport (Main Content + Footer) */}
          <div className="d-flex flex-column flex-grow-1 min-vw-0">
            <main className="p-4 flex-grow-1 bg-light">
              {children}
            </main>
            {/* Bottom Footer */}
            <Footer />
          </div>
        </div>
      </div>
      </CartProvider>
    </SessionProvider>
  );
}