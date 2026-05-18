import React, { useEffect, useMemo, useState } from "react";
import {
  deleteAppointment,
  fetchAppointments,
  respondToAppointment
} from "../../src/api/client";
import ConfirmDialog from "../ConfirmDialog";
import CustomStatusDropdown, { STATUS_OPTIONS } from "./CustomStatusDropdown";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

const formatTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "No time";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit"
  });
};

const FilterDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "rejected", label: "Rejected" },
    { value: "completed", label: "Completed" }
  ];
  const currentOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={`admin-status-dropdown ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)} style={{ minWidth: '130px', background: 'white' }}>
      <div className="custom-dropdown-trigger">
        {currentOption.label}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      {isOpen && (
        <div className="custom-dropdown-menu">
          {options.map((option) => (
            <div key={option.value} className={`custom-dropdown-item ${option.value === value ? "selected" : ""}`} onClick={() => onChange(option.value)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AppointmentsView = () => {
  const [appointments, setAppointments] = useState([]);
  const [busyId, setBusyId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadAppointments = async () => {
    const data = await fetchAppointments();
    setAppointments(data);
  };

  useEffect(() => {
    loadAppointments().catch((error) => setFeedback(error.message));
  }, []);

  const recentActivity = useMemo(
    () =>
      appointments
        .slice()
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 4),
    [appointments]
  );

  const filteredAppointments = useMemo(() => {
    if (statusFilter === "all") {
      return appointments;
    }

    return appointments.filter(
      (appointment) => String(appointment.status || "pending").toLowerCase() === statusFilter
    );
  }, [appointments, statusFilter]);

  const handleStatusChange = async (appointmentId, nextStatus) => {
    const previousAppointments = appointments;
    setBusyId(appointmentId);
    setFeedback("");
    setAppointments((current) =>
      current.map((item) =>
        item._id === appointmentId ? { ...item, status: nextStatus } : item
      )
    );

    try {
      const response = await respondToAppointment(appointmentId, {
        status: nextStatus,
        adminReply:
          nextStatus === "confirmed"
            ? "Appointment confirmed by admin."
            : nextStatus === "cancelled"
              ? "Appointment cancelled by admin."
              : "Appointment kept pending for review.",
        respondedByRole: "admin"
      });
      setAppointments((current) =>
        current.map((item) => (item._id === appointmentId ? { ...item, ...response } : item))
      );
      setFeedback(response.message || "Appointment status updated successfully.");
    } catch (error) {
      setAppointments(previousAppointments);
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
      const response = await deleteAppointment(deleteTarget._id);
      setAppointments((current) => current.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
      setFeedback(response.message || "Appointment deleted successfully.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="manage-appointments-view">
      <div className="admin-section-head">
        <div>
          <h2 className="admin-view-title">Appointments</h2>
          <p className="admin-section-subtitle">Review bookings, update status, and remove invalid requests.</p>
        </div>
        <label className="admin-toolbar-filter">
          <span>Status Filter</span>
          <FilterDropdown value={statusFilter} onChange={setStatusFilter} />
        </label>
      </div>

      {feedback ? <p className="admin-feedback">{feedback}</p> : null}

      <div className="dashboard-section">
        <div className="dashboard-section__header">
          <h3>Recent Activity</h3>
          <span>{recentActivity.length} latest records</span>
        </div>
        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((item) => (
              <div key={item._id} className="activity-item">
                <div className="activity-details">
                  <strong>
                    {item.patient?.firstName} {item.patient?.lastName}
                  </strong>
                  <span>
                    {item.doctor?.fullName} on {formatDate(item.appointmentDate)}
                  </span>
                </div>
                <CustomStatusDropdown
                  compact
                  value={String(item.status || "pending").toLowerCase()}
                  onChange={(nextStatus) => handleStatusChange(item._id, nextStatus)}
                  disabled={busyId === item._id}
                />
              </div>
            ))
          ) : (
            <p className="admin-empty-state">No recent appointment activity.</p>
          )}
        </div>
      </div>

      <div className="manage-list-card">
        <div className="manage-list-header manage-list-header--appointments">
          <div className="col-name font-bold">Patient</div>
          <div className="col-specialty font-bold">Doctor</div>
          <div className="col-specialty font-bold">Date & Time</div>
          <div className="col-status font-bold">Status</div>
          <div className="col-actions text-right font-bold">Actions</div>
        </div>

        <div className="manage-list-body">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="manage-list-row manage-list-row--stackable">
                <div className="col-name">
                  <div className="manage-primary">
                    {appointment.patient?.firstName} {appointment.patient?.lastName}
                  </div>
                  <div className="manage-secondary">{appointment.patient?.email || "No email"}</div>
                </div>
                <div className="col-specialty">
                  <div className="manage-primary">{appointment.doctor?.fullName || "Unknown doctor"}</div>
                  <div className="manage-secondary">{appointment.department?.name || "No department"}</div>
                </div>
                <div className="col-specialty">
                  <div className="manage-primary">{formatDate(appointment.appointmentDate)}</div>
                  <div className="manage-secondary">{formatTime(appointment.appointmentDate)}</div>
                </div>
                <div className="col-status">
                  <CustomStatusDropdown
                    compact
                    value={String(appointment.status || "pending").toLowerCase()}
                    onChange={(nextStatus) => handleStatusChange(appointment._id, nextStatus)}
                    disabled={busyId === appointment._id}
                  />
                </div>
                <div className="col-actions col-actions--responsive">
                  <button
                    type="button"
                    className="admin-btn-pill red"
                    onClick={() => setDeleteTarget(appointment)}
                    disabled={busyId === appointment._id}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="admin-empty-state">No appointments found for this filter.</p>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        eyebrow="Appointment record"
        title="Delete this appointment?"
        message={
          deleteTarget
            ? `This will permanently remove the booking for ${deleteTarget.patient?.firstName || "the patient"} with ${deleteTarget.doctor?.fullName || "the selected doctor"}.`
            : ""
        }
        confirmLabel="Delete Appointment"
        cancelLabel="Cancel"
        confirmTone="danger"
        onCancel={closeDeleteDialog}
        onConfirm={handleDelete}
        busy={busyId === deleteTarget?._id}
      />
    </div>
  );
};

export default AppointmentsView;
