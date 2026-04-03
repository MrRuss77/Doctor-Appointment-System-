import React, { useState } from "react";

const navItems = [
  { id: "home", label: "Home" },
  { id: "doctors", label: "Doctors" },
  { id: "departments", label: "Departments" },
  { id: "login", label: "Login" }
];

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

const Navbar = ({ activePage, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <button
        type="button"
        className="brand"
        onClick={() => handleNavigate("doctors")}
        aria-label="Go to doctors page"
      >
        <AmbulanceIcon />
        <span>Doctris</span>
      </button>

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
      </div>
    </nav>
  );
};

export default Navbar;
