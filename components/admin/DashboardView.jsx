import React, { useEffect, useMemo, useState } from "react";
import {
  fetchAppointments,
  fetchDepartments,
  fetchDoctors,
  fetchUsers,
  respondToAppointment
} from "../../src/api/client";
import CustomStatusDropdown from "./CustomStatusDropdown";

const formatDateTime = (value) => {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
};

const DashboardView = ({ onOpenManageDoctors }) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadAppointments = async () => {
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (appointmentId, nextStatus) => {
    const previousAppointments = appointments;
    setBusyId(appointmentId);
    setError("");
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
    } catch (err) {
      setAppointments(previousAppointments);
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const [appointmentData, doctorData, departmentData, userData] = await Promise.all([
          fetchAppointments(),
          fetchDoctors(),
          fetchDepartments(),
          fetchUsers()
        ]);

        if (!active) {
          return;
        }

        setAppointments(appointmentData);
        setDoctors(doctorData);
        setDepartments(departmentData);
        setUsers(userData);
        setError("");
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError.message);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const todayKey = new Date().toDateString();
    const appointmentsToday = appointments.filter((item) => {
      const appointmentDate = new Date(item.appointmentDate);
      return !Number.isNaN(appointmentDate.getTime()) && appointmentDate.toDateString() === todayKey;
    }).length;

    return [
      { label: "Total Doctors", value: doctors.length || 0 },
      { label: "Appointments Today", value: appointmentsToday },
      { label: "Departments", value: departments.length || 0 },
      {
        label: "Total Patients",
        value: users.filter((user) => user.role === "patient").length || 0
      }
    ];
  }, [appointments, doctors.length, departments.length, users]);

  const recentActivity = useMemo(
    () =>
      [...appointments]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5),
    [appointments]
  );

  const doctorsOnDuty = useMemo(
    () =>
      doctors
        .filter((doctor) => doctor.isActive !== false)
        .slice(0, 4)
        .map((doctor, index) => ({
          id: doctor._id,
          name: doctor.fullName,
          specialty: doctor.department?.name || doctor.specialization,
          room: `Room ${String(index + 1).padStart(2, "0")}`
        })),
    [doctors]
  );

  return (
    <>
      <h2 className="admin-view-title">Dashboard Overview</h2>

      {error ? <p className="admin-feedback admin-feedback--error">{error}</p> : null}

      <div className="dashboard-stats">
        {metrics.map((metric) => (
          <div key={metric.label} className="stat-card">
            <div className="stat-info">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section__header">
          <h3>Recent Activity</h3>
          <span>{recentActivity.length} latest updates</span>
        </div>
        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity._id} className="activity-item">
                <div className="activity-details">
                  <strong>
                    {activity.patient?.firstName} {activity.patient?.lastName} with {activity.doctor?.fullName}
                  </strong>
                  <span>{formatDateTime(activity.appointmentDate)}</span>
                </div>
                <CustomStatusDropdown
                  compact
                  value={String(activity.status || "pending").toLowerCase()}
                  onChange={(nextStatus) => handleStatusChange(activity._id, nextStatus)}
                  disabled={busyId === activity._id}
                />
              </div>
            ))
          ) : (
            <p className="admin-empty-state">No appointment activity yet.</p>
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section__header">
          <h3>Doctors on Duty</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span>Active specialists</span>
            <button
              type="button"
              className="admin-btn-pill green"
              onClick={() => onOpenManageDoctors?.()}
            >
              Add Doctor
            </button>
          </div>
        </div>
        <div className="activity-list">
          {doctorsOnDuty.length > 0 ? (
            doctorsOnDuty.map((doctor) => (
              <div key={doctor.id} className="activity-item">
                <div className="activity-details">
                  <strong>{doctor.name}</strong>
                  <span>{doctor.specialty}</span>
                </div>
                <div className="status-pill grey">{doctor.room}</div>
              </div>
            ))
          ) : (
            <p className="admin-empty-state">No doctors available yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardView;
