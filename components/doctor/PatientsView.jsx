import React, { useEffect, useMemo, useState } from "react";
import { PatientDetailsModal } from "./DoctorModals";
import { addAppointmentFeedback, fetchAppointments } from "../../src/api/client";
import { buildPatientRecords } from "./patientHistory";

const normalizeName = (value = "") =>
  String(value)
    .replace(/^dr\.?\s*/i, "")
    .trim()
    .toLowerCase();

const PatientsView = ({ authUser, doctorProfile }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [openMenuId, setOpenMenuId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [modalFeedbackError, setModalFeedbackError] = useState("");
  const [modalFeedbackSuccess, setModalFeedbackSuccess] = useState("");
  const [feedbackBusy, setFeedbackBusy] = useState(false);

  const loadAppointments = async () => {
    const data = await fetchAppointments(doctorProfile?._id ? { doctor: doctorProfile._id } : {});
    setAppointments(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    let active = true;

    loadAppointments().catch((error) => {
      if (active) {
        setFeedback(error.message);
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

  const copyPatientDetail = async (value, label) => {
    if (!value || value === "Not provided") {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setFeedback(`${label} copied successfully.`);
    } catch (_error) {
      setFeedback(`Clipboard access is unavailable. Please copy this ${label.toLowerCase()} manually: ${value}`);
    }
  };

  const relevantAppointments = useMemo(() => {
    const doctorId = String(doctorProfile?._id || "");
    const authEmail = String(authUser?.email || "").trim().toLowerCase();
    const authFullName = normalizeName(
      [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ") || authUser?.name || ""
    );

    return appointments.filter((appointment) => {
      const appointmentDoctorId = String(appointment.doctor?._id || appointment.doctor || "");
      const doctorEmail = String(appointment.doctor?.email || "").trim().toLowerCase();
      const doctorName = normalizeName(appointment.doctor?.fullName || "");

      if (doctorId && appointmentDoctorId && doctorId === appointmentDoctorId) {
        return true;
      }

      if (authEmail && doctorEmail && authEmail === doctorEmail) {
        return true;
      }

      return authFullName && doctorName && authFullName === doctorName;
    });
  }, [appointments, authUser, doctorProfile?._id]);

  const patients = useMemo(() => buildPatientRecords(relevantAppointments), [relevantAppointments]);

  const refreshSelectedPatient = (patientId, nextAppointments) => {
    const nextPatients = buildPatientRecords(nextAppointments);
    const nextPatient = nextPatients.find((patient) => String(patient.id) === String(patientId)) || null;
    setSelectedPatient(nextPatient);
  };

  const handleSaveFeedback = async (appointmentId, payload) => {
    if (!selectedPatient) {
      return false;
    }

    setFeedbackBusy(true);
    setModalFeedbackError("");
    setModalFeedbackSuccess("");

    try {
      await addAppointmentFeedback(appointmentId, {
        ...payload,
        createdByRole: "doctor"
      });

      const nextAppointments = await fetchAppointments(
        doctorProfile?._id ? { doctor: doctorProfile._id } : {}
      );
      const normalizedAppointments = Array.isArray(nextAppointments) ? nextAppointments : [];

      setAppointments(normalizedAppointments);
      refreshSelectedPatient(selectedPatient.id, normalizedAppointments);
      setModalFeedbackSuccess("Feedback added successfully.");
      return true;
    } catch (error) {
      setModalFeedbackError(error.message);
      return false;
    } finally {
      setFeedbackBusy(false);
    }
  };

  return (
    <div className="patients-view">
      <h2 className="doctor-view-title">Patient List</h2>

      {feedback ? <p className="doctor-feedback" style={{ display: "block" }}>{feedback}</p> : null}
      
      <div className="manage-list-card">
        <div className="manage-list-header manage-list-header--appointments">
          <div className="col-name font-bold">Patient</div>
          <div className="col-specialty font-bold">Age & Gender</div>
          <div className="col-patients font-bold">Blood Group</div>
          <div className="col-actions text-right font-bold">Actions</div>
        </div>
        <div className="manage-list-body">
          {patients.length > 0 ? (
            patients.map((pt) => (
              <div key={pt.id} className="manage-list-row manage-list-row--stackable">
                <div className="col-name">
                  <div className="manage-primary">{pt.name}</div>
                </div>
                <div className="col-specialty">
                  <div className="manage-primary">{pt.age}</div>
                  <div className="manage-secondary">{pt.gender}</div>
                </div>
                <div className="col-patients">
                  <div className="manage-primary">{pt.bloodGroup}</div>
                </div>
                <div className="col-actions col-actions--responsive">
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
                        style={{ right: 0 }}
                      >
                        <button
                          type="button"
                          className="patient-actions-menu__item"
                          onClick={() => {
                            setSelectedPatient(pt);
                            setModalFeedbackError("");
                            setModalFeedbackSuccess("");
                            setOpenMenuId("");
                          }}
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          className="patient-actions-menu__item"
                          onClick={async () => {
                            await copyPatientDetail(pt.phone, "Phone");
                            setOpenMenuId("");
                          }}
                        >
                          Copy Phone
                        </button>
                        <button
                          type="button"
                          className="patient-actions-menu__item"
                          onClick={async () => {
                            await copyPatientDetail(pt.email, "Email");
                            setOpenMenuId("");
                          }}
                        >
                          Copy Email
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="admin-empty-state">No patients available for this doctor yet.</p>
          )}
        </div>
      </div>

      {selectedPatient ? (
        <PatientDetailsModal
          patient={selectedPatient}
          feedbackBusy={feedbackBusy}
          feedbackError={modalFeedbackError}
          feedbackSuccess={modalFeedbackSuccess}
          onSaveFeedback={handleSaveFeedback}
          onClose={() => {
            setSelectedPatient(null);
            setModalFeedbackError("");
            setModalFeedbackSuccess("");
          }}
        />
      ) : null}
    </div>
  );
};

export default PatientsView;
