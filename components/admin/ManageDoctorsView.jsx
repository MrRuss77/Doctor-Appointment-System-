import React, { useEffect, useState } from "react";
import {
  createDoctor,
  deleteDoctor,
  fetchDepartments,
  fetchDoctors,
  updateDoctor
} from "../../src/api/client";
import ConfirmDialog from "../ConfirmDialog";

const createFallbackAvatar = (name = "Doctor") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="24" fill="#e2e8f0" />
      <circle cx="60" cy="42" r="18" fill="#ffffff" />
      <path d="M28 94c8-20 23-30 32-30s24 10 32 30" fill="#ffffff" />
      <text x="60" y="106" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#31508f">
        ${String(name).trim().charAt(0).toUpperCase() || "D"}
      </text>
    </svg>
  `)}`;

const emptyDoctorForm = {
  fullName: "",
  email: "",
  phone: "",
  department: "",
  specialization: "",
  qualification: "",
  experienceYears: "",
  availabilityText: "",
  consultationFee: "",
  imageDataUrl: "",
  imagePreviewName: ""
};

const ManageDoctorsView = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingDoctorId, setEditingDoctorId] = useState("");
  const [drafts, setDrafts] = useState({});
  const [feedback, setFeedback] = useState("");
  const [busyId, setBusyId] = useState("");
  const [openMenuId, setOpenMenuId] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState(emptyDoctorForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadDoctors = async () => {
    const data = await fetchDoctors();
    setDoctors(data);
  };

  const loadDepartments = async () => {
    const data = await fetchDepartments();
    setDepartments(data || []);
  };

  useEffect(() => {
    Promise.all([loadDoctors(), loadDepartments()]).catch((error) => setFeedback(error.message));
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
        specialization: doctor.specialization,
        consultationFee: doctor.consultationFee || ""
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

  const handleNewDoctorChange = (field, value) => {
    setNewDoctor((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleDoctorPhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      handleNewDoctorChange("imageDataUrl", "");
      handleNewDoctorChange("imagePreviewName", "");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFeedback("Doctor photo must be a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setFeedback("Doctor photo must be smaller than 4MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setNewDoctor((current) => ({
        ...current,
        imageDataUrl: String(reader.result || ""),
        imagePreviewName: file.name
      }));
      setFeedback("");
    };
    reader.onerror = () => setFeedback("Could not read the selected photo.");
    reader.readAsDataURL(file);
  };

  const resetAddForm = () => {
    setNewDoctor(emptyDoctorForm);
    setIsAddFormOpen(false);
  };

  const validateNewDoctor = () => {
    if (!newDoctor.fullName.trim()) {
      return "Please enter the doctor's full name.";
    }

    if (!newDoctor.email.trim()) {
      return "Please enter the doctor's email.";
    }

    if (!newDoctor.phone.trim()) {
      return "Please enter the doctor's phone number.";
    }

    if (!newDoctor.department) {
      return departments.length > 0
        ? "Please choose a department for this doctor."
        : "Departments are not loaded yet. Please check the backend and try again.";
    }

    if (!newDoctor.specialization.trim()) {
      return "Please enter the doctor's specialization.";
    }

    return "";
  };

  const handleCreateDoctor = async (event) => {
    event.preventDefault();

    const validationMessage = validateNewDoctor();

    if (validationMessage) {
      setFeedback(validationMessage);
      return;
    }

    setBusyId("create");
    setFeedback("");

    try {
      const createdDoctor = await createDoctor({
        fullName: newDoctor.fullName.trim(),
        email: newDoctor.email.trim(),
        phone: newDoctor.phone.trim(),
        department: newDoctor.department,
        specialization: newDoctor.specialization.trim(),
        qualification: newDoctor.qualification.trim(),
        experienceYears: newDoctor.experienceYears ? Number(newDoctor.experienceYears) : 0,
        availabilityText: newDoctor.availabilityText.trim(),
        consultationFee: newDoctor.consultationFee ? Number(newDoctor.consultationFee) : 0,
        imageDataUrl: newDoctor.imageDataUrl
      });

      setDoctors((current) => [createdDoctor, ...current]);
      resetAddForm();
      setFeedback(createdDoctor.message || "Doctor created successfully.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusyId("");
    }
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
        specialization: draft.specialization.trim(),
        consultationFee: draft.consultationFee ? Number(draft.consultationFee) : 0
      });

      setDoctors((current) =>
        current.map((item) => (item._id === doctor._id ? updatedDoctor : item))
      );
      setEditingDoctorId("");
      setOpenMenuId("");
      setFeedback(updatedDoctor.message || "Doctor updated successfully.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusyId("");
    }
  };

  const closeDeleteDialog = () => {
    if (busyId) {
      return;
    }

    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) {
      return;
    }

    setBusyId(deleteTarget._id);
    setFeedback("");

    try {
      const response = await deleteDoctor(deleteTarget._id);
      setDoctors((current) => current.filter((doctor) => doctor._id !== deleteTarget._id));
      setOpenMenuId("");
      setDeleteTarget(null);
      setFeedback(response.message || "Doctor deleted successfully.");
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
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setIsAddFormOpen((current) => !current)}
          disabled={busyId === "create"}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Doctor
        </button>
      </div>

      {feedback ? <p className="admin-feedback">{feedback}</p> : null}

      {isAddFormOpen ? (
        <form className="doctor-create-panel" onSubmit={handleCreateDoctor} noValidate>
          <div className="doctor-create-panel__header">
            <div>
              <h3>Add Doctor</h3>
              <p>New doctors are saved to MongoDB and receive a linked doctor login account.</p>
            </div>
            <button type="button" className="admin-btn-pill" onClick={resetAddForm}>
              Close
            </button>
          </div>

          <div className="doctor-create-grid">
            <label className="admin-field">
              <span>Full name</span>
              <input
                className="admin-input"
                value={newDoctor.fullName}
                onChange={(event) => handleNewDoctorChange("fullName", event.target.value)}
                placeholder="Dr. Maya Karki"
              />
            </label>
            <label className="admin-field">
              <span>Email</span>
              <input
                type="email"
                className="admin-input"
                value={newDoctor.email}
                onChange={(event) => handleNewDoctorChange("email", event.target.value)}
                placeholder="maya.karki@example.com"
              />
            </label>
            <label className="admin-field">
              <span>Phone</span>
              <input
                className="admin-input"
                value={newDoctor.phone}
                onChange={(event) => handleNewDoctorChange("phone", event.target.value)}
                placeholder="9801000028"
              />
            </label>
            <label className="admin-field">
              <span>Department</span>
              <select
                className="admin-select"
                value={newDoctor.department}
                onChange={(event) => handleNewDoctorChange("department", event.target.value)}
                disabled={departments.length === 0}
              >
                <option value="">
                  {departments.length > 0 ? "Select department" : "Departments unavailable"}
                </option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field admin-field--wide">
              <span>Specialization</span>
              <input
                className="admin-input"
                value={newDoctor.specialization}
                onChange={(event) => handleNewDoctorChange("specialization", event.target.value)}
                placeholder="Senior Consultant Cardiologist"
              />
            </label>
            <label className="admin-field">
              <span>Qualification</span>
              <input
                className="admin-input"
                value={newDoctor.qualification}
                onChange={(event) => handleNewDoctorChange("qualification", event.target.value)}
                placeholder="MBBS, MD"
              />
            </label>
            <label className="admin-field">
              <span>Experience</span>
              <input
                type="number"
                min="0"
                className="admin-input"
                value={newDoctor.experienceYears}
                onChange={(event) => handleNewDoctorChange("experienceYears", event.target.value)}
                placeholder="5"
              />
            </label>
            <label className="admin-field">
              <span>Fee</span>
              <input
                type="number"
                min="0"
                className="admin-input"
                value={newDoctor.consultationFee}
                onChange={(event) => handleNewDoctorChange("consultationFee", event.target.value)}
                placeholder="1500"
              />
            </label>
            <label className="admin-field admin-field--wide">
              <span>Availability text</span>
              <input
                className="admin-input"
                value={newDoctor.availabilityText}
                onChange={(event) => handleNewDoctorChange("availabilityText", event.target.value)}
                placeholder="No availability added yet"
              />
            </label>
            <label className="admin-field admin-field--wide">
              <span>Doctor photo</span>
              <input
                type="file"
                className="admin-input admin-file-input"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleDoctorPhotoChange}
              />
            </label>
          </div>

          {newDoctor.imageDataUrl ? (
            <div className="doctor-photo-preview">
              <img src={newDoctor.imageDataUrl} alt="Selected doctor" />
              <span>{newDoctor.imagePreviewName}</span>
            </div>
          ) : null}

          <div className="doctor-create-actions">
            <button type="button" className="admin-btn-pill" onClick={resetAddForm}>
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary" disabled={busyId === "create"}>
              {busyId === "create" ? "Adding..." : "Save Doctor"}
            </button>
          </div>
        </form>
      ) : null}

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
                      <div className="manage-doctor-cell">
                        {doctor.image ? (
                          <img
                            className="manage-doctor-avatar"
                            src={doctor.image}
                            alt={doctor.fullName}
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = createFallbackAvatar(doctor.fullName);
                            }}
                          />
                        ) : (
                          <span className="manage-doctor-avatar manage-doctor-avatar--initial">
                            {doctor.fullName?.charAt(0)?.toUpperCase() || "D"}
                          </span>
                        )}
                        <div>
                          <div className="manage-primary">{doctor.fullName}</div>
                          <div className="manage-secondary">{doctor.department?.name || "No department"}</div>
                        </div>
                      </div>
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
                    {isEditing ? (
                      <input
                        type="number"
                        className="admin-input"
                        value={draft.consultationFee || ""}
                        onChange={(event) =>
                          handleDraftChange(doctor._id, "consultationFee", event.target.value)
                        }
                      />
                    ) : (
                      <div className="manage-primary">
                        Rs. {Number(doctor.consultationFee || 0).toLocaleString()}
                      </div>
                    )}
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
                              onClick={() => {
                                setDeleteTarget(doctor);
                                setOpenMenuId("");
                              }}
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        eyebrow="Doctor record"
        title="Delete this doctor?"
        message={
          deleteTarget
            ? `This will remove ${deleteTarget.fullName} from the doctors list. The action will be blocked if this doctor still has active appointments.`
            : ""
        }
        confirmLabel="Delete Doctor"
        cancelLabel="Cancel"
        confirmTone="danger"
        onCancel={closeDeleteDialog}
        onConfirm={handleDelete}
        busy={busyId === deleteTarget?._id}
      />
    </div>
  );
};

export default ManageDoctorsView;
