import React, { useEffect, useMemo, useState } from "react";
import {
  createDepartment,
  deleteDepartment,
  fetchDepartments,
  updateDepartment
} from "../../src/api/client";
import ConfirmDialog from "../ConfirmDialog";

import anesthesiologyImg from "../departments/Anesthiology.png";
import dentistImg from "../departments/dentist.png.png";
import psychiatristImg from "../departments/Physiactrist.png";
import gynecologistImg from "../departments/Gynecologist.png";
import cardiologyImg from "../departments/Cardiology.png";
import neurologyImg from "../departments/Neurology.png";
import orthopedicsImg from "../departments/Orthopedics.png";
import entImg from "../departments/ENT.png";
import pediatricsImg from "../departments/Pediatrics.png";

const iconMap = {
  anesthesiology: anesthesiologyImg,
  dentist: dentistImg,
  psychiatrist: psychiatristImg,
  gynecologist: gynecologistImg,
  cardiology: cardiologyImg,
  neurology: neurologyImg,
  orthopedics: orthopedicsImg,
  ent: entImg,
  pediatrics: pediatricsImg
};

const departmentIconOptions = [
  { label: "Anesthesiology", value: "/components/departments/Anesthiology.png", image: anesthesiologyImg },
  { label: "Cardiology", value: "/components/departments/Cardiology.png", image: cardiologyImg },
  { label: "Neurology", value: "/components/departments/Neurology.png", image: neurologyImg },
  { label: "Pediatrics", value: "/components/departments/Pediatrics.png", image: pediatricsImg },
  { label: "Dentist", value: "/components/departments/dentist.png.png", image: dentistImg },
  { label: "Orthopedics", value: "/components/departments/Orthopedics.png", image: orthopedicsImg },
  { label: "ENT", value: "/components/departments/ENT.png", image: entImg },
  { label: "Gynecologist", value: "/components/departments/Gynecologist.png", image: gynecologistImg },
  { label: "Psychiatrist", value: "/components/departments/Physiactrist.png", image: psychiatristImg }
];

const iconPathMap = Object.fromEntries(
  departmentIconOptions.map((option) => [option.value, option.image])
);

const normalizeDepartmentName = (value = "") =>
  String(value).trim().toLowerCase();

const resolveDepartmentIcon = (department) =>
  iconPathMap[department.icon] || department.icon || iconMap[normalizeDepartmentName(department.name)] || null;

const emptyDepartmentDraft = {
  name: "",
  description: "",
  icon: "",
  iconDataUrl: "",
  iconPreviewName: ""
};

const DepartmentsView = () => {
  const [feedback, setFeedback] = useState("");
  const [departments, setDepartments] = useState([]);
  const [busyId, setBusyId] = useState("");
  const [modalState, setModalState] = useState({ isOpen: false, mode: "add", data: null });
  const [modalDraft, setModalDraft] = useState(emptyDepartmentDraft);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const closeDepartmentModal = () => {
    setModalState({ isOpen: false, mode: "add", data: null });
    setModalDraft(emptyDepartmentDraft);
  };

  const loadDepartments = async () => {
    const data = await fetchDepartments();
    setDepartments(data || []);
  };

  useEffect(() => {
    loadDepartments().catch((error) => setFeedback(error.message));
  }, []);

  const decoratedDepartments = useMemo(
    () =>
      departments.map((department) => ({
        ...department,
        iconImage: resolveDepartmentIcon(department)
      })),
    [departments]
  );

  const handleAddDepartment = () => {
    setModalDraft(emptyDepartmentDraft);
    setModalState({ isOpen: true, mode: "add", data: null });
  };

  const handleEditDepartment = (department) => {
    setModalDraft({
      name: department.name || "",
      description: department.description || "",
      icon: department.icon || ""
    });
    setModalState({ isOpen: true, mode: "edit", data: department });
  };

  const handleModalDraftChange = (field, value) => {
    setModalDraft((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleDepartmentIconUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setModalDraft((current) => ({
        ...current,
        iconDataUrl: "",
        iconPreviewName: ""
      }));
      return;
    }

    if (file.type !== "image/png") {
      setFeedback("Department icon must be a PNG image.");
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setFeedback("Department icon must be smaller than 1MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setModalDraft((current) => ({
        ...current,
        icon: "",
        iconDataUrl: String(reader.result || ""),
        iconPreviewName: file.name
      }));
      setFeedback("");
    };
    reader.onerror = () => setFeedback("Could not read the selected icon.");
    reader.readAsDataURL(file);
  };

  const selectedIconPreview = modalDraft.iconDataUrl || iconPathMap[modalDraft.icon] || null;

  const handleSaveModal = async () => {
    const { name, description, icon } = modalDraft;

    if (!name || !name.trim()) return;

    if (modalState.mode === "add") {
      setBusyId("create");
      setFeedback("");
      try {
        const response = await createDepartment({
          name: name.trim(),
          description: description.trim(),
          icon,
          iconDataUrl: modalDraft.iconDataUrl
        });
        setDepartments((current) => [response, ...current]);
        setFeedback(response.message || "Department created successfully.");
      } catch (error) {
        setFeedback(error.message);
      } finally {
        setBusyId("");
      }
    } else {
      const department = modalState.data;
      setBusyId(department._id);
      setFeedback("");
      try {
        const response = await updateDepartment(department._id, {
          ...department,
          name: name.trim(),
          description: description.trim(),
          icon,
          iconDataUrl: modalDraft.iconDataUrl
        });
        setDepartments((current) => current.map((item) => (item._id === department._id ? response : item)));
        setFeedback(response.message || "Department updated successfully.");
      } catch (error) {
        setFeedback(error.message);
      } finally {
        setBusyId("");
      }
    }
    closeDepartmentModal();
  };



  const closeDeleteDialog = () => {
    if (busyId) {
      return;
    }

    setDeleteTarget(null);
  };

  const handleDeleteDepartment = async () => {
    if (!deleteTarget?._id) {
      return;
    }

    setBusyId(deleteTarget._id);
    setFeedback("");

    try {
      const response = await deleteDepartment(deleteTarget._id);
      setDepartments((current) => current.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
      setFeedback(response.message || "Department deleted successfully.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="departments-view">
      <div className="admin-header-row">
        <h2 className="admin-view-title">Departments</h2>
        <button className="admin-btn-primary" onClick={handleAddDepartment} disabled={busyId === "create"}>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          {busyId === "create" ? "Adding..." : "Add Department"}
        </button>
      </div>

      {feedback ? <p className="admin-feedback">{feedback}</p> : null}

      <div className="departments-grid">
        {decoratedDepartments.map((dept) => (
          <div key={dept._id} className="dept-card">
            <div className="dept-card-header">
              <div className="dept-icon" style={{ backgroundColor: "transparent", padding: 0 }}>
                {dept.iconImage ? (
                  <img
                    src={dept.iconImage}
                    alt={dept.name}
                    style={{ width: "32px", height: "32px", objectFit: "contain" }}
                  />
                ) : (
                  <span>{dept.name?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div className="dept-actions dept-actions--inline">
                <button
                  type="button"
                  className="dept-action-btn dept-action-btn--edit"
                  onClick={() => handleEditDepartment(dept)}
                  title="Edit"
                  disabled={busyId === dept._id}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button
                  type="button"
                  className="dept-action-btn dept-action-btn--delete"
                  onClick={() => setDeleteTarget(dept)}
                  title="Delete"
                  disabled={busyId === dept._id}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            </div>

            <div className="dept-card-body">
              <h3>{dept.name}</h3>
              <p>{dept.description || "No description added yet."}</p>
            </div>

            <div className="dept-card-footer" style={{ color: "#3b82f6", fontWeight: "600", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>{dept.doctorCount || 0} Doctors</span>
            </div>
          </div>
        ))}
      </div>

      {modalState.isOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="modal-content" style={{ background: 'white', borderRadius: '24px', width: '450px', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', position: 'relative' }}>
            <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', color: '#10233d', fontWeight: '800' }}>
              {modalState.mode === "add" ? "Add Department" : "Edit Department"}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>Department Name</label>
              <input
                type="text"
                className="admin-input"
                value={modalDraft.name}
                onChange={(event) => handleModalDraftChange("name", event.target.value)}
                autoFocus
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>Description</label>
              <textarea
                className="admin-input"
                value={modalDraft.description}
                onChange={(event) => handleModalDraftChange("description", event.target.value)}
                style={{ minHeight: '100px', resize: 'vertical', paddingTop: '12px' }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#334155' }}>Department Icon</label>
              <select
                className="admin-select"
                value={modalDraft.icon}
                onChange={(event) => {
                  handleModalDraftChange("icon", event.target.value);
                  handleModalDraftChange("iconDataUrl", "");
                  handleModalDraftChange("iconPreviewName", "");
                }}
              >
                <option value="">Use department initial</option>
                {departmentIconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="file"
                className="admin-input admin-file-input"
                accept="image/png,.png"
                onChange={handleDepartmentIconUpload}
                style={{ marginTop: '12px' }}
              />
              {selectedIconPreview ? (
                <div className="department-icon-preview">
                  <img src={selectedIconPreview} alt="" aria-hidden="true" />
                  <span>
                    {modalDraft.iconPreviewName ||
                      `${departmentIconOptions.find((option) => option.value === modalDraft.icon)?.label} icon selected`}
                  </span>
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="admin-btn-pill" onClick={closeDepartmentModal} style={{ background: '#f1f5f9', color: '#475569' }}>
                Cancel
              </button>
              <button 
                className="admin-btn-primary" 
                onClick={handleSaveModal}
              >
                Save Department
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        eyebrow="Department record"
        title="Delete this department?"
        message={
          deleteTarget
            ? `This will remove ${deleteTarget.name}. If doctors or active appointments still depend on this department, the backend will stop the deletion.`
            : ""
        }
        confirmLabel="Delete Department"
        cancelLabel="Cancel"
        confirmTone="danger"
        onCancel={closeDeleteDialog}
        onConfirm={handleDeleteDepartment}
        busy={busyId === deleteTarget?._id}
      />
    </div>
  );
};

export default DepartmentsView;
