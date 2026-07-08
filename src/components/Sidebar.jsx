// "use client";

// export default function Sidebar({ isOpen }) {
//   return (
//     <aside
//       className="bg-dark text-white border-end"
//       style={{
//         width: isOpen ? "450px" : "0px",
//         transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//         overflow: "hidden",
//         whiteSpace: "nowrap",
//       }}
//     >
//       <div className="p-3" style={{ width: "260px" }}>
//         <p className="text-muted text-uppercase small fw-bold px-2 mb-3">Navigation</p>
//         <ul className="nav nav-pills flex-column gap-1">
//           <li className="nav-item">
//             <a href="/" className="nav-link text-white active">
//               🏠 <span className="ms-2">Home Dashboard</span>
//             </a>
//           </li>
//           <li className="nav-item">
//             <a href="./products" className="nav-link text-white-50 hover-link">
//               📦 <span className="ms-2">Products</span>
//             </a>
//           </li>
//           <li className="nav-item">
//             <a href="#" className="nav-link text-white-50 hover-link">
//               🗂️ <span className="ms-2">Categories</span>
//             </a>
//           </li>
//           <li className="nav-item">
//             <a href="#" className="nav-link text-white-50 hover-link">
//               ✉️ <span className="ms-2">Contact Support</span>
//             </a>
//           </li>
//         </ul>
//       </div>
//     </aside>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import phone from "@/assets/phone.png"
import laptop from "@/assets/laptop.png"
import other from "@/assets/other.png"
import speed from "@/assets/speeddometer.png"
import Link from "next/link";

// 1. Define your menu structure to keep the JSX clean
const menuItems = [
  { 
    id: "dashborad", 
    label: "Dashboard", 
    icon: speed, 
    href: "/dashboard", 
    isDropdown: false 
  },
  { 
    id: "home", 
    label: "Home", 
    icon: "🏠", 
    href: "/", 
    isDropdown: false 
  },
  { 
    id: "phone", 
    label:"Mobile", 
    icon: phone, 
    isDropdown: true,
    subItems: [
      { id: "hawei", label: "Hawei", href: "/hawei" },
      { id: "apple", label: "Apple", href: "/apple" }
    ]
  },
  { 
    id: "desktop", 
    label: "Desktop", 
    icon: laptop, 
    isDropdown: true,
    subItems: [
      { id: "acer", label: "Acer", href: "/acer" },
      { id: "hp", label: "HP", href: "/hp" }
    ]
  },
  { 
    id: "others", 
    label: "Others", 
    icon: other, 
    isDropdown: true,
    subItems: [
      { id: "remax", label: "Remax", href: "/remax" },
      { id: "samsung", label: "Samsung", href: "/samsung" }
    ]
  },
];

export default function Sidebar({ isOpen }) {
  const pathname = usePathname();
  
  // Track which dropdown is currently expanded
  const [openDropdown, setOpenDropdown] = useState(null);

  // Automatically open the dropdown if a subitem is active on initial load
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.isDropdown && item.subItems.some((sub) => sub.href === pathname)) {
        setOpenDropdown(item.id);
      }
    });
  }, [pathname]);

  const { data: session } = useSession();

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.id === "dashborad") {
      return session?.user?.role === "admin";
    }
    return true;
  });

  const handleDropdownToggle = (id) => {
    // If clicking the already open dropdown, close it. Otherwise, open the new one.
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <aside
      className="bg-white border-end sticky-top text-black"
      style={{
        width: isOpen ? "300px" : "0px",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflowX: "hidden",
        overflowY: "auto",
        whiteSpace: "nowrap",
        height: "calc(100vh - 57px)",
        top: "57px",
        alignSelf: "flex-start",
      }}
    >
      <div className="p-3" style={{ width: "260px" }}>
        <p className="text-muted text-uppercase small fw-bold px-2 mb-3">
          Navigation
        </p>
        
        <ul className="nav nav-pills flex-column gap-1">
          {filteredMenuItems.map((item) => (
            <li className="nav-item" key={item.id}>
              
              {/* IF IT IS NOT A DROPDOWN (e.g., Home) */}
              {!item.isDropdown ? (
                <Link
                  href={item.href}
                  className={`nav-link ${
                    pathname === item.href ? "active text-white" : "text-black hover-link"
                  }`}
                >
                  {typeof item.icon === 'string' ? item.icon : <img src={item.icon.src} alt={item.label} width="25" height="25" className="d-inline-block align-text-bottom" />} <span className="ms-2">{item.label}</span>
                </Link>
              ) : ( 
                /* IF IT IS A DROPDOWN (Products, Categories, etc.) */
                <>
                  <div
                    onClick={() => handleDropdownToggle(item.id)}
                    className="nav-link text-black hover-link d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <div>
                      {typeof item.icon === 'string' ? item.icon : <img src={item.icon.src} alt={item.label} width="20" height="20" className="d-inline-block align-text-bottom" />} <span className="ms-2">{item.label}</span>
                    </div>
                    {/* Caret Icon indicating dropdown state */}
    <span style={{ fontSize: "0.8rem", transition: "0.3s", transform: openDropdown === item.id ? "rotate(180deg)" : "rotate(0deg)" }}>
                      ▼
                    </span>
                  </div>
                  {/* Dropdown Content */}
                  <div
                    className="overflow-hidden"
                    style={{
                      maxHeight: openDropdown === item.id ? "200px" : "0px",
                      transition: "max-height 0.3s ease-in-out",
                    }}
                  >
                    <ul className="nav flex-column ms-4 ps-2 border-start border-secondary mt-1 gap-1">
                      {item.subItems.map((subItem) => (
                        <li className="nav-item" key={subItem.id}>
                          <Link
                            href={subItem.href}
                            className={`nav-link small py-1 ${
                              pathname === subItem.href
                                ? "text-primary fw-bold"
                                : "text-black hover-link"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}