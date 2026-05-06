import React, { useState } from "react";
import { PatientDetailsModal } from "./DoctorModals";

const PatientsView = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const patients = [
    { id: 1, name: "Subashna Maskey", age: "20 years", gender: "Female", bloodGroup: "A+", phone: "1234567890", email: "sub@gmail.com" },
    { id: 2, name: "Rean Shrestha", age: "25 years", gender: "Male", bloodGroup: "O+", phone: "1234567891", email: "rean@gmail.com" },
    { id: 3, name: "Mirajan Shrestha", age: "30 years", gender: "Male", bloodGroup: "B+", phone: "1234567892", email: "mirajan@gmail.com" },
    { id: 4, name: "Deepsikha Gautam", age: "22 years", gender: "Female", bloodGroup: "AB+", phone: "1234567893", email: "deepsikha@gmail.com" },
    { id: 5, name: "Anshu Basnet", age: "28 years", gender: "Female", bloodGroup: "O-", phone: "1234567894", email: "anshu@gmail.com" },
  ];

  return (
    <div className="patients-view">
      <h2 className="doctor-view-title">Patient List</h2>
      
      <div className="patients-table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th className="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((pt) => (
              <tr key={pt.id}>
                <td>{pt.name}</td>
                <td>{pt.age}</td>
                <td>{pt.gender}</td>
                <td>{pt.bloodGroup}</td>
                <td className="actions">
                  <button className="btn-view" onClick={() => setSelectedPatient(pt)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPatient && <PatientDetailsModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}
    </div>
  );
};

export default PatientsView;
