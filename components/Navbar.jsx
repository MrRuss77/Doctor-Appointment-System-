import React, { useState } from "react";

const AmbulanceIcon = () => (
  <svg
    viewBox="0 0 64 64"
    aria-hidden="true"
    className="brand-icon"
  >
    <path
      d="M10 18h28c3.3 0 6 2.7 6 6v2h6.6c2.1 0 4.1 1.1 5.2 2.9l4.2 6.8V46c0 2.2-1.8 4-4 4h-2.4a8 8 0 0 1-15.2 0H25.6a8 8 0 0 1-15.2 0H8c-2.2 0-4-1.8-4-4V24c0-3.3 2.7-6 6-6Zm6 32a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm30 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 24v8h6v6h6v-6h6v-8h-6v-6h-6v6h-6Zm29 8h8.7l-2.5-4H46v4Z"
      fill="currentColor"
    />
  </svg>
);

const Navbar = ({ activePage, onNavigate, authUser, onLogout, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { id: "home", label: "Home" },
    { id: "doctors", label: "Doctors" },
    { id: "departments", label: "Departments" },
    ...(authUser && authUser.role !== "admin" ? [{ id: "logout", label: "Logout" }] : []),
    ...(!authUser ? [{ id: "login", label: "Login" }] : [])
  ];

  const handleNavigate = (page) => {
    if (page === "logout") {
      onLogout?.();
      setMenuOpen(false);
      return;
    }

    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand-area">
        <button
          type="button"
          className="brand"
          onClick={() => handleNavigate("home")}
          aria-label="Go to home page"
        >
          <span className="brand-icon-shell">
            <AmbulanceIcon />
          </span>
          <span className="brand-copy">
            <strong>MediCare</strong>
            <small>Doctor Appointment Booking System</small>
          </span>
        </button>
      </div>

      <button
        type="button"
        className="menu-toggle"
        onClick={() => setMenuOpen((current) => !current)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>

        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-link ${activePage === item.id ? "active" : ""}`}
            onClick={() => handleNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '20px' }}>
          <button 
            type="button" 
            className="nav-cta" 
            style={{ padding: '10px 20px', background: '#bae6fd', color: '#0369a1', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
            onClick={() => handleNavigate("doctor")}
          >
            Doctor Panel
          </button>
          <button 
            type="button" 
            className="nav-cta" 
            style={{ padding: '10px 20px', background: '#0ea5e9', color: 'white', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
            onClick={() => handleNavigate("admin")}
          >
            Admin Panel
          </button>
        </div>

        {authUser && authUser.role === "admin" && (
          <div className="nav-utility" style={{ marginLeft: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => handleNavigate("logout")}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#3b82f6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
                <strong style={{ fontSize: "14px", color: "#1e293b" }}>{authUser.name || "Subashna"}</strong>
                <small style={{ fontSize: "11px", color: "#64748b" }}>Admin</small>
              </div>
            </div>
          </div>
        )}
        {authUser && authUser.role !== "admin" && (
          <div className="nav-utility">
            <div className="nav-user-pill" aria-label="Current signed in user">
              <span>Patient portal</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
