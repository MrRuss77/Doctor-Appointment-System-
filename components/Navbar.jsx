import React, { useState } from "react";

const AmbulanceIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true" className="brand-icon">
    <path
      d="M10 18h28c3.3 0 6 2.7 6 6v2h6.6c2.1 0 4.1 1.1 5.2 2.9l4.2 6.8V46c0 2.2-1.8 4-4 4h-2.4a8 8 0 0 1-15.2 0H25.6a8 8 0 0 1-15.2 0H8c-2.2 0-4-1.8-4-4V24c0-3.3 2.7-6 6-6Zm6 32a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm30 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM17 24v8h6v6h6v-6h6v-8h-6v-6h-6v6h-6Zm29 8h8.7l-2.5-4H46v4Z"
      fill="currentColor"
    />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
  </svg>
);

const Navbar = ({ activePage, onNavigate, authUser, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isAdmin = authUser?.role === "admin";
  const isDoctor = authUser?.role === "doctor";
  const isPatient = authUser?.role === "patient";
  const canOpenDoctorPanel = isDoctor || isAdmin;

  const navItems = [
    { id: "home", label: "Home" },
    { id: "doctors", label: "Doctors" },
    { id: "departments", label: "Departments" },
    ...(!authUser ? [{ id: "login", label: "Login" }] : [])
  ];

  const displayName =
    `${authUser?.firstName || ""} ${authUser?.lastName || ""}`.trim() ||
    authUser?.name ||
    "User";

  const handleNavigate = (page) => {
    onNavigate?.(page);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout?.();
    setMenuOpen(false);
    setProfileOpen(false);
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

        {canOpenDoctorPanel && (
          <div className="nav-panel-actions">
            <button
              type="button"
              className="nav-cta nav-cta--doctor"
              onClick={() => handleNavigate("doctor")}
            >
              Doctor Panel
            </button>

            {isAdmin && (
              <button
                type="button"
                className="nav-cta nav-cta--admin"
                onClick={() => handleNavigate("admin")}
              >
                Admin Panel
              </button>
            )}
          </div>
        )}

        {authUser && isAdmin && (
          <div className="nav-utility">
            <button
              type="button"
              className="admin-profile-button"
              onClick={handleLogoutClick}
            >
              <span className="admin-profile-button__avatar">
                <UserIcon />
              </span>

              <span className="admin-profile-button__copy">
                <strong>{displayName}</strong>
                <small>Admin</small>
              </span>
            </button>
          </div>
        )}

        {authUser && isDoctor && !isAdmin && (
          <div className="nav-utility">
            <button
              type="button"
              className="nav-user-pill"
              onClick={handleLogoutClick}
            >
              Doctor portal
            </button>
          </div>
        )}

        {authUser && isPatient && (
          <div className="nav-utility nav-profile-wrap">
            <button
              type="button"
              className="profile-menu-button"
              onClick={() => setProfileOpen((current) => !current)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <span className="profile-menu-button__avatar">
                <UserIcon />
              </span>

              <span>User</span>

              <span
                className={`profile-menu-button__chevron ${
                  profileOpen ? "open" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {profileOpen && (
              <div className="profile-dropdown" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleNavigate("patient-profile")}
                >
                  My Profile
                </button>

                <button type="button" role="menuitem" onClick={handleLogoutClick}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;