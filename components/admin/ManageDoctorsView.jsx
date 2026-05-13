import React, { useEffect, useState } from "react";
import {
  deleteDoctor,
  fetchDoctors,
  updateDoctor
} from "../../src/api/client";

const ManageDoctorsView = () => {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctorId, setEditingDoctorId] = useState("");
  const [drafts, setDrafts] = useState({});
  const [feedback, setFeedback] = useState("");
  const [busyId, setBusyId] = useState("");
  const [openMenuId, setOpenMenuId] = useState("");

  const loadDoctors = async () => {
    const data = await fetchDoctors();
    setDoctors(data);
  };

  useEffect(() => {
    loadDoctors().catch((error) => setFeedback(error.message));
  }, []);

  useEffect(() => {
    const handleWindowClick = () => {
      setOpenMenuId("");
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const startEditing = (doctor) => {
    setEditingDoctorId(doctor._id);
    setDrafts((current) => ({
      ...current,
      [doctor._id]: {
        fullName: doctor.fullName,
        specialization: doctor.specialization
      }
    }));
  };

  const handleDraftChange = (doctorId, field, value) => {
    setDrafts((current) => ({
      ...current,
      [doctorId]: {
        ...current[doctorId],
        [field]: value
      }
    }));
  };

  const handleSave = async (doctor) => {
    const draft = drafts[doctor._id];
    if (!draft) {
      return;
    }

    setBusyId(doctor._id);
    setFeedback("");

    try {
      const updatedDoctor = await updateDoctor(doctor._id, {
        ...doctor,
        fullName: draft.fullName.trim(),
        specialization: draft.specialization.trim()
      });

      setDoctors((current) =>
        current.map((item) => (item._id === doctor._id ? updatedDoctor : item))
      );
      setEditingDoctorId("");
      setOpenMenuId("");
      setFeedback("Doctor updated successfully.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (doctorId) => {
    setBusyId(doctorId);
    setFeedback("");

    try {
      await deleteDoctor(doctorId);
      setDoctors((current) => current.filter((doctor) => doctor._id !== doctorId));
      setOpenMenuId("");
      setFeedback("Doctor deleted successfully.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="manage-doctors-view">
      <div className="admin-section-head">
        <div>
          <h2 className="admin-view-title">Manage Doctors</h2>
          <p className="admin-section-subtitle">Keep doctor profiles accurate and easy to review.</p>
        </div>
      </div>

      {feedback ? <p className="admin-feedback">{feedback}</p> : null}

      <div className="manage-list-card">
        <div className="manage-list-header">
          <div className="col-name font-bold">Name</div>
          <div className="col-specialty font-bold">Specialty</div>
          <div className="col-patients font-bold">Fee</div>
          <div className="col-actions text-right font-bold">Actions</div>
        </div>

        <div className="manage-list-body">
          {doctors.length > 0 ? (
            doctors.map((doctor) => {
              const isEditing = editingDoctorId === doctor._id;
              const draft = drafts[doctor._id] || {};

              return (
                <div key={doctor._id} className="manage-list-row manage-list-row--stackable">
                  <div className="col-name">
                    {isEditing ? (
                      <input
                        className="admin-input"
                        value={draft.fullName || ""}
                        onChange={(event) => handleDraftChange(doctor._id, "fullName", event.target.value)}
                      />
                    ) : (
                      <>
                        <div className="manage-primary">{doctor.fullName}</div>
                        <div className="manage-secondary">{doctor.department?.name || "No department"}</div>
                      </>
                    )}
                  </div>
                  <div className="col-specialty">
                    {isEditing ? (
                      <input
                        className="admin-input"
                        value={draft.specialization || ""}
                        onChange={(event) =>
                          handleDraftChange(doctor._id, "specialization", event.target.value)
                        }
                      />
                    ) : (
                      <div className="manage-primary">{doctor.specialization}</div>
                    )}
                  </div>
                  <div className="col-patients">
                    <div className="manage-primary">
                      Rs. {Number(doctor.consultationFee || 0).toLocaleString()}
                    </div>
                    <div className="manage-secondary">{doctor.availabilityText}</div>
                  </div>
                  <div className="col-actions col-actions--responsive">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="admin-btn-pill green"
                          onClick={() => handleSave(doctor)}
                          disabled={busyId === doctor._id}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="admin-btn-pill"
                          onClick={() => setEditingDoctorId("")}
                          disabled={busyId === doctor._id}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div className="admin-actions-menu">
                        <button
                          type="button"
                          className="admin-actions-menu__trigger"
                          aria-haspopup="menu"
                          aria-expanded={openMenuId === doctor._id}
                          onClick={(event) => {
                            event.stopPropagation();
                            setOpenMenuId((current) => (current === doctor._id ? "" : doctor._id));
                          }}
                          disabled={busyId === doctor._id}
                        >
                          Actions
                          <span className="admin-actions-menu__chevron" aria-hidden="true">▾</span>
                        </button>

                        {openMenuId === doctor._id ? (
                          <div
                            className="admin-actions-menu__dropdown"
                            role="menu"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="admin-actions-menu__item"
                              onClick={() => {
                                startEditing(doctor);
                                setOpenMenuId("");
                              }}
                            >
                              Edit Doctor
                            </button>
                            <button
                              type="button"
                              className="admin-actions-menu__item"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(doctor.email || "");
                                  setFeedback("Doctor email copied.");
                                } catch (_error) {
                                  window.prompt("Copy doctor email", doctor.email || "");
                                }
                                setOpenMenuId("");
                              }}
                            >
                              Copy Email
                            </button>
                            <button
                              type="button"
                              className="admin-actions-menu__item admin-actions-menu__item--danger"
                              onClick={() => handleDelete(doctor._id)}
                            >
                              Delete Doctor
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="admin-empty-state">No doctors found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDoctorsView;
