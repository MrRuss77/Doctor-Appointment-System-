import React from "react";

const ManageDoctorsView = () => {
  const doctors = [
    { id: 1, name: "Dr. Suman Adhikari", specialty: "Neurology", patients: 19 },
    { id: 2, name: "Dr. Kiran Thapa", specialty: "Cardiology", patients: 13 },
    { id: 3, name: "Dr. Puja Maharjan", specialty: "Dentist", patients: 7 },
  ];

  return (
    <div className="manage-doctors-view">
      <h2 className="admin-view-title">Manage Doctors</h2>
      
      <div className="manage-list-card">
        <div className="manage-list-header">
          <div className="col-name font-bold">Name</div>
          <div className="col-specialty font-bold">Specialty</div>
          <div className="col-patients font-bold">Patients</div>
          <div className="col-actions text-right">
            <button className="admin-btn-pill blue">Add</button>
          </div>
        </div>
        
        <div className="manage-list-body">
          {doctors.map((doc) => (
            <div key={doc.id} className="manage-list-row">
              <div className="col-name">{doc.name}</div>
              <div className="col-specialty">{doc.specialty}</div>
              <div className="col-patients">{doc.patients}</div>
              <div className="col-actions flex-end gap-10">
                <button className="admin-btn-pill green">Edit</button>
                <button className="admin-btn-pill red">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageDoctorsView;
