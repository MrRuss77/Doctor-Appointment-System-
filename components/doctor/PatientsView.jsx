import React, { useEffect, useMemo, useState } from "react";
import { PatientDetailsModal } from "./DoctorModals";
import { fetchAppointments } from "../../src/api/client";

const normalizeName = (value = "") =>
  String(value)
    .replace(/^dr\.?\s*/i, "")
    .trim()
    .toLowerCase();

const fallbackPatientHistory = [
  {
    date: "2026-04-25",
    visitLabel: "Visit #2",
    diagnosis: "Hypertension",
    remarks: "Patient complained of occasional chest discomfort. ECG performed, results normal.",
    prescription: "Amlodipine 5mg - Once daily, Aspirin 75mg - Once daily"
  },
  {
    date: "2026-03-25",
    visitLabel: "Visit #1",
    diagnosis: "Hypertension",
    remarks: "Initial diagnosis.",
    prescription: "Lifestyle changes advised with blood pressure monitoring."
  }
];

const PatientsView = ({ authUser, doctorProfile }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [openMenuId, setOpenMenuId] = useState("");

  useEffect(() => {
    let active = true;

    fetchAppointments(doctorProfile?._id ? { doctor: doctorProfile._id } : {})
      .then((data) => {
        if (active) {
          setAppointments(data || []);
        }
      })
      .catch(() => {
        if (active) {
          setAppointments([]);
        }
      });

    return () => {
      active = false;
    };
  }, [doctorProfile?._id]);

  useEffect(() => {
    const handleWindowClick = () => {
      setOpenMenuId("");
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const copyPatientDetail = async (value) => {
    if (!value || value === "Not provided") {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
    } catch (_error) {
      window.prompt("Copy this value", value);
    }
  };

  const patients = useMemo(() => {
    const doctorId = String(doctorProfile?._id || "");
    const authEmail = String(authUser?.email || "").trim().toLowerCase();
    const authFullName = normalizeName(
      [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ") || authUser?.name || ""
    );

    const relevantAppointments = appointments.filter((appointment) => {
      const appointmentDoctorId = String(appointment.doctor?._id || appointment.doctor || "");
      const doctorEmail = String(appointment.doctor?.email || "").trim().toLowerCase();
      const doctorName = normalizeName(appointment.doctor?.fullName || "");

      if (doctorId && appointmentDoctorId && doctorId === appointmentDoctorId) {
        return true;
      }

      if (authEmail && doctorEmail && authEmail === doctorEmail) {
        return true;
      }

      if (authFullName && doctorName && authFullName === doctorName) {
        return true;
      }

      return false;
    });

    const patientMap = new Map();

    relevantAppointments.forEach((appointment) => {
      const noteParts = String(appointment.notes || "")
        .split("|")
        .map((part) => part.trim());
      const getValue = (label) =>
        noteParts.find((part) => part.toLowerCase().startsWith(`${label.toLowerCase()}:`))
          ?.split(":")
          .slice(1)
          .join(":")
          .trim() || "";

      const patient = appointment.patient || {};
      const id = patient._id || patient.email || appointment._id;

      if (!patientMap.has(id)) {
        patientMap.set(id, {
          id,
          name: `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Patient",
          age: getValue("Age") || "Not provided",
          gender: getValue("Gender") || patient.gender || "Not provided",
          bloodGroup: getValue("Blood Group") || "Not provided",
          phone: getValue("Phone") || patient.phone || "Not provided",
          email: patient.email || "Not provided",
          history: []
        });
      }

      const patientRecord = patientMap.get(id);
      patientRecord.history.push({
        date: appointment.appointmentDate
          ? new Date(appointment.appointmentDate).toISOString().slice(0, 10)
          : "Not scheduled",
        visitLabel: `Visit #${patientRecord.history.length + 1}`,
        diagnosis: appointment.reason || "General consultation",
        remarks: appointment.notes || "No remarks provided.",
        prescription: appointment.prescription || appointment.treatment || "Prescription not added yet."
      });
    });

    return Array.from(patientMap.values()).map((patient) => ({
      ...patient,
      history: patient.history.length > 0 ? patient.history.reverse() : fallbackPatientHistory
    }));
  }, [appointments, authUser, doctorProfile?._id]);

  return (
    <div className="patients-view">
      <h2 className="doctor-view-title">Patient List</h2>
      
      <div className="patients-table-container">
        <table className="patients-table">
          <colgroup>
            <col className="patients-col-patient" />
            <col className="patients-col-age" />
            <col className="patients-col-gender" />
            <col className="patients-col-blood" />
            <col className="patients-col-actions" />
          </colgroup>
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
            {patients.length > 0 ? (
              patients.map((pt) => (
                <tr key={pt.id}>
                  <td>{pt.name}</td>
                  <td>{pt.age}</td>
                  <td>{pt.gender}</td>
                  <td>{pt.bloodGroup}</td>
                  <td className="actions">
                    <div className="patient-actions-menu">
                      <button
                        type="button"
                        className="patient-actions-menu__trigger"
                        aria-haspopup="menu"
                        aria-expanded={openMenuId === pt.id}
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenMenuId((current) => (current === pt.id ? "" : pt.id));
                        }}
                      >
                        Actions
                        <span className="patient-actions-menu__chevron" aria-hidden="true">▾</span>
                      </button>

                      {openMenuId === pt.id ? (
                        <div
                          className="patient-actions-menu__dropdown"
                          role="menu"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="patient-actions-menu__item"
                            onClick={() => {
                              setSelectedPatient(pt);
                              setOpenMenuId("");
                            }}
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            className="patient-actions-menu__item"
                            onClick={async () => {
                              await copyPatientDetail(pt.phone);
                              setOpenMenuId("");
                            }}
                          >
                            Copy Phone
                          </button>
                          <button
                            type="button"
                            className="patient-actions-menu__item"
                            onClick={async () => {
                              await copyPatientDetail(pt.email);
                              setOpenMenuId("");
                            }}
                          >
                            Copy Email
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="doctor-empty-cell">No patients available for this doctor yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedPatient && <PatientDetailsModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}
    </div>
  );
};

export default PatientsView;
