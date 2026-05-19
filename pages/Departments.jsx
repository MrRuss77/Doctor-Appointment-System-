import React, { useEffect, useMemo, useState } from "react";
import anesthesiologyImg from "../components/departments/Anesthiology.png";
import cardiacImg from "../components/departments/Cardiology.png";
import dentistImg from "../components/departments/dentist.png.png";
import entImg from "../components/departments/ENT.png";
import gynecologistImg from "../components/departments/Gynecologist.png";
import orthopedicsImg from "../components/departments/Orthopedics.png";
import pediatricsImg from "../components/departments/Pediatrics.png";
import psychiatristImg from "../components/departments/Physiactrist.png";
import neurologyImg from "../components/departments/Neurology.png";
import { fetchDepartments } from "../src/api/client";

const iconMap = {
  "/components/departments/Anesthiology.png": anesthesiologyImg,
  "/components/departments/Cardiology.png": cardiacImg,
  "/components/departments/dentist.png.png": dentistImg,
  "/components/departments/ENT.png": entImg,
  "/components/departments/Gynecologist.png": gynecologistImg,
  "/components/departments/Orthopedics.png": orthopedicsImg,
  "/components/departments/Pediatrics.png": pediatricsImg,
  "/components/departments/Physiactrist.png": psychiatristImg,
  "/components/departments/Neurology.png": neurologyImg
};

const nameIconMap = {
  anesthesiology: anesthesiologyImg,
  anesthiology: anesthesiologyImg,
  dentist: dentistImg,
  psychiatrist: psychiatristImg,
  physiactrist: psychiatristImg,
  gynecologist: gynecologistImg,
  cardiology: cardiacImg,
  neurology: neurologyImg,
  pediatrics: pediatricsImg,
  orthopedics: orthopedicsImg,
  ent: entImg
};

const createDepartmentPlaceholder = (name = "Department") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <rect width="96" height="96" rx="24" fill="#e0f2fe" />
      <text x="48" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#0f172a">
        ${String(name).trim().charAt(0).toUpperCase() || "D"}
      </text>
    </svg>
  `)}`;

const departmentData = [
  { name: "Anesthiology", image: anesthesiologyImg },
  { name: "Dentist", image: dentistImg },
  { name: "Physiactrist", image: psychiatristImg },
  { name: "Gynecologist", image: gynecologistImg },
  { name: "Cardiology", image: cardiacImg },
  { name: "Neurology", image: neurologyImg },
  { name: "Pediatrics", image: pediatricsImg },
  { name: "Orthopedics", image: orthopedicsImg },
  { name: "ENT", desc: "Ear, Nose and Throat", image: entImg }
];

const Departments = ({ onSelectDepartment }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [liveDepartments, setLiveDepartments] = useState([]);

  useEffect(() => {
    let isActive = true;

    fetchDepartments()
      .then((departments) => {
        if (!isActive || !Array.isArray(departments)) {
          return;
        }

        setLiveDepartments(
          departments.map((department) => ({
            name: department.name,
            desc: department.description,
            image:
              iconMap[department.icon] ||
              department.icon ||
              nameIconMap[String(department.name || "").trim().toLowerCase()] ||
              null
          }))
        );
      })
      .catch(() => {
        if (isActive) {
          setLiveDepartments([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const departments = useMemo(
    () => (liveDepartments.length > 0 ? liveDepartments : departmentData),
    [liveDepartments]
  );

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Search Bar */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ position: "relative", width: "400px" }}>
          <svg style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#e0f2fe" }} viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search Departments..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "16px 20px 16px 55px", borderRadius: "30px", border: "none", background: "#3b82f6", color: "white", outline: "none", fontSize: "16px", fontWeight: "500", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)" }}
          />
          <style>{`
            ::placeholder { color: #bae6fd; opacity: 1; }
          `}</style>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginTop: "20px" }}>
        {filtered.map((dept, idx) => (
          <button 
            key={idx}
            onClick={() => onSelectDepartment?.(dept.name)}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "25px", 
              background: "white", 
              border: "2px solid #38bdf8", 
              borderRadius: "40px", 
              padding: "25px 40px", 
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 8px 25px rgba(14, 165, 233, 0.2)"}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}
          >
            {dept.image ? (
              <img
                src={dept.image}
                alt={dept.name}
                style={{ width: "65px", height: "65px", objectFit: "contain" }}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = createDepartmentPlaceholder(dept.name);
                }}
              />
            ) : (
              <span style={{ width: "65px", height: "65px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "18px", background: "#e0f2fe", color: "#0f172a", fontSize: "24px", fontWeight: "800" }}>
                {dept.name?.charAt(0)?.toUpperCase()}
              </span>
            )}
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "20px", color: "#0f172a", fontWeight: "600" }}>{dept.name}</div>
              {dept.desc && <div style={{ fontSize: "14px", color: "#475569", marginTop: "4px", fontWeight: "500" }}>{dept.desc}</div>}
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};

export default Departments;
