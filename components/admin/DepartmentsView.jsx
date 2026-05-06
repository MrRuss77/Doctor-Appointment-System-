import React from "react";

import anesthesiologyImg from "../departments/Anesthiology.png";
import dentistImg from "../departments/dentist.png.png";
import psychiatristImg from "../departments/Physiactrist.png";
import gynecologistImg from "../departments/Gynecologist.png";
import cardiologyImg from "../departments/Cardiology.png";
import neurologyImg from "../departments/Neurology.png";

const DepartmentsView = () => {
  const departments = [
    { 
      id: 1, name: "Anesthiology", desc: "Pain Management, Anesthesia", doctors: 5, 
      icon: <img src={anesthesiologyImg} alt="Anesthiology" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
    },
    { 
      id: 2, name: "Dentist", desc: "Oral Dental Care", doctors: 5, 
      icon: <img src={dentistImg} alt="Dentist" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
    },
    { 
      id: 3, name: "Physiactrist", desc: "Mental Health Treatment", doctors: 5, 
      icon: <img src={psychiatristImg} alt="Physiactrist" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
    },
    { 
      id: 4, name: "Gynecologist", desc: "Female Reproductive System", doctors: 5, 
      icon: <img src={gynecologistImg} alt="Gynecologist" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
    },
    { 
      id: 5, name: "Cardiology", desc: "Heart and Vessels", doctors: 5, 
      icon: <img src={cardiologyImg} alt="Cardiology" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
    },
    { 
      id: 6, name: "Neurology", desc: "Brain and Nerves", doctors: 5, 
      icon: <img src={neurologyImg} alt="Neurology" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
    }
  ];

  return (
    <div className="departments-view">
      <div className="admin-header-row">
        <h2 className="admin-view-title">Departments</h2>
        <button className="admin-btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Department
        </button>
      </div>

      <div className="departments-grid">
        {departments.map((dept) => (
          <div key={dept.id} className="dept-card">
            <div className="dept-card-header">
              <div className="dept-icon" style={{ backgroundColor: "transparent", padding: 0 }}>{dept.icon}</div>
              <div className="dept-actions">
                <button className="action-btn edit" title="Edit">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button className="action-btn delete" title="Delete">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>
            
            <div className="dept-card-body">
              <h3>{dept.name}</h3>
              <p>{dept.desc}</p>
            </div>
            
            <div className="dept-card-footer" style={{ color: "#3b82f6", fontWeight: "600", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>{dept.doctors} Doctors</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsView;
