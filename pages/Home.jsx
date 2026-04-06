import React, { useState } from "react";

const quickActions = [
  "Book appointment",
  "Find a doctor",
  "Contact Us",
  "View appointment",
  "Departments",
  "Book an appointment"
];

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="action-icon">
    <rect
      x="3"
      y="5"
      width="18"
      height="16"
      rx="2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M7 3v4M17 3v4M3 9h18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2M15 17h2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-icon">
    <path
      d="M7.2 3.5c.5-.5 1.3-.6 1.9-.2l2.2 1.5c.7.5.9 1.4.5 2.1l-1 1.8a1 1 0 0 0 .1 1.1 15.5 15.5 0 0 0 3.3 3.3 1 1 0 0 0 1.1.1l1.8-1c.7-.4 1.6-.2 2.1.5l1.5 2.2c.4.6.3 1.4-.2 1.9l-1.4 1.4c-.8.8-2 1.1-3 .8-2.9-.9-5.6-2.7-8-5.1s-4.2-5.1-5.1-8c-.3-1 .1-2.2.8-3l1.4-1.4Z"
      fill="currentColor"
    />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-icon">
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
);

function Home() {
  const [activeAction, setActiveAction] = useState("");

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Trusted Dental Care</p>
            <h1>Modern care with a familiar, simple experience.</h1>
            <p className="hero-text">
              Book appointments, find doctors, explore departments, and manage
              your visits in one clear interface.
            </p>
          </div>

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
        <section className="actions-grid" aria-label="Quick actions">
          {quickActions.map((label) => (
            <button
              key={label}
              type="button"
              className={
                activeAction === label ? "action-card selected" : "action-card"
              }
              onClick={() => setActiveAction(label)}
            >
              <CalendarIcon />
              <span>{label}</span>
            </button>
          ))}
        </section>
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
