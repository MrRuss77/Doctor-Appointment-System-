import React, { useMemo, useState } from "react";

const quickActions = [
  {
    label: "Book appointment",
    page: "doctors",
    detail: "Choose a specialist and reserve your slot online."
  },
  {
    label: "Find a doctor",
    page: "doctors",
    detail: "Browse top specialists across every department."
  },
  {
    label: "Departments",
    page: "departments",
    detail: "Explore services from cardiology to dental care."
  },
  {
    label: "View appointment",
    page: "admin",
    detail: "Track requests and approvals from the admin panel."
  }
];

const serviceHighlights = [
  {
    title: "Same-day scheduling",
    text: "Fast booking for urgent checkups without the usual call-back loop."
  },
  {
    title: "Verified specialists",
    text: "Doctor cards include department, specialization, and qualification details."
  },
  {
    title: "Simple patient flow",
    text: "Login, registration, reset password, OTP verification, and booking all stay in one app."
  }
];

const trustStats = [
  { value: "24/7", label: "Booking access" },
  { value: "5+", label: "Specialties ready" },
  { value: "1", label: "Unified patient flow" }
];

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="action-icon">
    <rect x="3" y="5" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
    <path d="M7 3v4M17 3v4M3 9h18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2M15 17h2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-icon">
    <path d="M7.2 3.5c.5-.5 1.3-.6 1.9-.2l2.2 1.5c.7.5.9 1.4.5 2.1l-1 1.8a1 1 0 0 0 .1 1.1 15.5 15.5 0 0 0 3.3 3.3 1 1 0 0 0 1.1.1l1.8-1c.7-.4 1.6-.2 2.1.5l1.5 2.2c.4.6.3 1.4-.2 1.9l-1.4 1.4c-.8.8-2 1.1-3 .8-2.9-.9-5.6-2.7-8-5.1s-4.2-5.1-5.1-8c-.3-1 .1-2.2.8-3l1.4-1.4Z" fill="currentColor" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-icon">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

function Home({ onNavigate, authUser, welcomeName }) {
  const [activeAction, setActiveAction] = useState("");

  const heroMessage = useMemo(() => {
    if (authUser?.role === "admin") {
      return "Admin controls are available from your dashboard.";
    }
    if (welcomeName) {
      return `Welcome back, ${welcomeName}. Your next booking is only a few clicks away.`;
    }
    return "Book appointments, discover departments, and manage care with a calmer patient experience.";
  }, [authUser?.role, welcomeName]);

  const handleActionClick = (action) => {
    setActiveAction(action.label);

    if (action.page === "admin" && authUser?.role !== "admin") {
      onNavigate?.("login");
      return;
    }

    onNavigate?.(action.page);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Digital Care Platform</p>
            <h1>Doctor appointments that feel clear, fast, and reliable.</h1>
            <p className="hero-text">{heroMessage}</p>

            {welcomeName ? (
              <p className="welcome-banner">Welcome {welcomeName}</p>
            ) : null}

            <div className="hero-actions">
              <button
                type="button"
                className="hero-primary-action"
                onClick={() => onNavigate?.("doctors")}
              >
                Book now
              </button>
              <button
                type="button"
                className="hero-secondary-action"
                onClick={() => onNavigate?.("departments")}
              >
                Explore departments
              </button>
            </div>

            <div className="hero-stats">
              {trustStats.map((item) => (
                <article key={item.label} className="hero-stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>

          {/* ✅ CLEANED HERO MEDIA (ONLY VIDEO LEFT) */}
          <div className="hero-media">
            <video
              className="hero-video"
              src="/hero-video.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>
      </section>

      <section className="actions-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Quick access</p>
            <h2>Everything important stays one tap away.</h2>
          </div>
        </div>

        <section className="actions-grid">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={
                activeAction === action.label ? "action-card selected" : "action-card"
              }
              onClick={() => handleActionClick(action)}
            >
              <span className="action-card__icon-wrap">
                <CalendarIcon />
              </span>
              <span className="action-card__text">
                <strong>{action.label}</strong>
                <small>{action.detail}</small>
              </span>
            </button>
          ))}
        </section>
      </section>

      <section className="highlights-section">
        {serviceHighlights.map((item) => (
          <article key={item.title} className="highlight-card">
            <p className="section-kicker">{item.title}</p>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <footer className="footer-bar">
        <div className="footer-inner">
          <div className="footer-item">
            <PhoneIcon />
            <span>Contact Us: +977 9767353425 | 01-4234231</span>
          </div>
          <div className="footer-item">
            <GlobeIcon />
            <span>www.doctris.np.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;