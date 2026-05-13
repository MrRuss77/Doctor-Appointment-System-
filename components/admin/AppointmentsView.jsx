import React, { useEffect, useMemo, useState } from "react";
import {
  deleteAppointment,
  fetchAppointments,
  respondToAppointment
} from "../../src/api/client";
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

const AppointmentsView = () => {
  const [appointments, setAppointments] = useState([]);
  const [busyId, setBusyId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      await respondToAppointment(appointmentId, {
        status: nextStatus,
        adminReply:
          nextStatus === "confirmed"
            ? "Appointment confirmed by admin."
            : nextStatus === "cancelled"
              ? "Appointment cancelled by admin."
              : "Appointment kept pending for review.",
        respondedByRole: "admin"
      });
      await loadAppointments();
      setFeedback("Appointment status updated successfully.");
    } catch (error) {
      setAppointments(previousAppointments);
      setFeedback(error.message);
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (appointmentId) => {
    setBusyId(appointmentId);
    setFeedback("");

    try {
      await deleteAppointment(appointmentId);
      setAppointments((current) => current.filter((item) => item._id !== appointmentId));
      setFeedback("Appointment deleted successfully.");
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
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
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
          <div className="col-patients font-bold">Date & Time</div>
          <div className="col-name font-bold">Status</div>
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
                <div className="col-patients">
                  <div className="manage-primary">{formatDate(appointment.appointmentDate)}</div>
                  <div className="manage-secondary">{formatTime(appointment.appointmentDate)}</div>
                </div>
                <div className="col-name col-status">
                  <CustomStatusDropdown
                    value={String(appointment.status || "pending").toLowerCase()}
                    onChange={(nextStatus) => handleStatusChange(appointment._id, nextStatus)}
                    disabled={busyId === appointment._id}
                  />
                </div>
                <div className="col-actions col-actions--responsive">
                  <button
                    type="button"
                    className="admin-btn-pill red"
                    onClick={() => handleDelete(appointment._id)}
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
    </div>
  );
};

export default AppointmentsView;
