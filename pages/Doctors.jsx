import React from "react";
import DoctorCard from "../components/DoctorCard";

const doctorData = [
  {
    name: "Dr. Taufiq Wani",
    field: "Anesthesiology",
    specialization: "Chief Consultant Anaesthesiologist",
    qualification: "MBBS, MD (Anaesthesia), Fellowship in Critical Care",
    availability: "Available for consultation today",
    image: "img/IMG_6482.jpg"
  },
  {
    name: "Dr. Arya Dev Rijal",
    field: "Cardiology",
    specialization: "Interventional Cardiologist and Heart Specialist",
    qualification: "MBBS, MD (Internal Medicine), DM Cardiology",
    availability: "Next slot: 4:30 PM",
    image: "img/IMG_6481.jpg"
  },
  {
    name: "Dr. Russ Karki",
    field: "Neurology",
    specialization: "Senior Consultant in Brain and Nerve Disorders",
    qualification: "MBBS, MD, Fellowship in Clinical Neurology",
    availability: "Available tomorrow morning",
    image: "img/IMG_6439.jpg"
  },
  {
    name: "Dr. Subashna Maskey",
    field: "Pediatrics",
    specialization: "Child Health Specialist and Neonatal Care Expert",
    qualification: "MBBS, MD Pediatrics, NICU Certification",
    availability: "Accepting new patients",
    image: "img/FullSizeRender.jpg"
  }
];

const pageContent = {
  home: {
    eyebrow: "Healthcare that feels approachable",
    title: "Hospital experiences built around trust and speed.",
    description:
      "This landing state is ready for hero content, quick actions, and featured services while keeping the same responsive shell."
  },
  doctors: {
    eyebrow: "Our Specialists",
    title: "Meet the doctors behind the care.",
    description:
      "Browse a clean, responsive doctor directory with clickable tabs and room to expand into booking or profile details."
  },
  departments: {
    eyebrow: "Clinical Departments",
    title: "Organize services by department.",
    description:
      "This state can later hold department cards, filters, and service summaries without changing the core layout."
  },
  login: {
    eyebrow: "Secure Access",
    title: "Patient and staff login entry point.",
    description:
      "For now this is a placeholder view so the navigation remains fully interactive while you focus on UI development."
  }
};

const Doctors = ({ activePage }) => {
  const currentPage = pageContent[activePage] || pageContent.doctors;
  const showDoctors = activePage === "doctors";

  return (
    <section className="page-section">
      <div className="page-copy">
        <p className="page-copy__eyebrow">{currentPage.eyebrow}</p>
        <h1>{currentPage.title}</h1>
        <p className="page-copy__description">{currentPage.description}</p>
      </div>

      {showDoctors ? (
        <div className="doctor-grid">
          {doctorData.map((doc) => (
            <DoctorCard key={doc.name} doctor={doc} />
          ))}
        </div>
      ) : (
        <div className="placeholder-panel">
          <h2>{currentPage.eyebrow}</h2>
          <p>
            This section is intentionally interactive already, so you can keep
            building page-by-page without reworking the navigation later.
          </p>
        </div>
      )}
    </section>
  );
};

export default Doctors;
