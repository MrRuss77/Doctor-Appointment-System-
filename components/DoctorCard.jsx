import React, { useState } from "react";

const createFallbackAvatar = (name) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#dbe7ff" />
          <stop offset="100%" stop-color="#bfcff2" />
        </linearGradient>
      </defs>
      <rect width="240" height="240" rx="36" fill="url(#bg)" />
      <circle cx="120" cy="90" r="42" fill="#ffffff" fill-opacity="0.85" />
      <path d="M55 196c12-30 38-48 65-48s53 18 65 48" fill="#ffffff" fill-opacity="0.85" />
      <text x="120" y="220" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="700" fill="#38579b">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const DoctorCard = ({ doctor, onBookAppointment }) => {
  const [tab, setTab] = useState("specialization");
  const [imageSrc, setImageSrc] = useState(doctor.image || createFallbackAvatar(doctor.name));

  return (
    <article className="doctor-card">
      <div className="doctor-card__top">
        <div style={{ width: "120px", height: "120px", overflow: "hidden", borderRadius: "50%", border: "4px solid #f1f5f9", flexShrink: 0 }}>
          <img
            className="doctor-card__image"
            src={imageSrc}
            alt={doctor.name}
            onError={() => setImageSrc(createFallbackAvatar(doctor.name))}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div className="doctor-card__content" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <h3>{doctor.name}</h3>
          <p className="doctor-card__field">{doctor.field}</p>
          <p className="doctor-card__availability">{doctor.availability}</p>
          <div className="doctor-card__actions">
            <button
              type="button"
              className="doctor-card__book-link"
              onClick={() => onBookAppointment?.(doctor)}
            >
              Book an appointment
            </button>
            <span className="doctor-card__meta">Patient-ready profile</span>
          </div>
        </div>
      </div>

      <div className="doctor-card__divider" />

      <div className="doctor-card__tabs" role="tablist" aria-label={`${doctor.name} details`}>
        <div className="tabs">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "specialization"}
            className={tab === "specialization" ? "active" : ""}
            onClick={() => setTab("specialization")}
          >
            Specialization
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === "qualification"}
            className={tab === "qualification" ? "active" : ""}
            onClick={() => setTab("qualification")}
          >
            Qualification
          </button>
        </div>
      </div>

      <div className="tab-content">
        {tab === "specialization" && (
          <div>
            <p className="tab-label">Primary Focus</p>
            <p>{doctor.specialization}</p>
          </div>
        )}

        {tab === "qualification" && (
          <div>
            <p className="tab-label">Credentials</p>
            <p>{doctor.qualification}</p>
          </div>
        )}
      </div>
    </article>
  );
};

export default DoctorCard;
