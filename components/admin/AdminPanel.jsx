import React, { useMemo, useState } from "react";

const statCards = [
  {
    label: "Scheduled today",
    value: "128",
    detail: "16 check-ins completed in the last hour",
    tone: "blue"
  },
  {
    label: "Doctors available",
    value: "24",
    detail: "Coverage is stable across 7 departments",
    tone: "green"
  },
  {
    label: "Pending approvals",
    value: "19",
    detail: "Claims, leave requests, and booking reviews",
    tone: "amber"
  },
  {
    label: "Collections",
    value: "$18.4k",
    detail: "9.2% ahead of last week",
    tone: "slate"
  }
];

const appointments = [
  {
    patient: "Aarav Shrestha",
    department: "Cardiology",
    doctor: "Dr. Arya Dev Rijal",
    time: "09:00 AM",
    status: "Confirmed"
  },
  {
    patient: "Sana Gautam",
    department: "Neurology",
    doctor: "Dr. Russ Karki",
    time: "10:30 AM",
    status: "Pending"
  },
  {
    patient: "Niruta Koirala",
    department: "Pediatrics",
    doctor: "Dr. Subashna Maskey",
    time: "11:15 AM",
    status: "Confirmed"
  },
  {
    patient: "Bibek Sharma",
    department: "Anesthesiology",
    doctor: "Dr. Taufiq Wani",
    time: "01:00 PM",
    status: "Rescheduled"
  },
  {
    patient: "Riya Adhikari",
    department: "Dentistry",
    doctor: "Dr. Alina Gurung",
    time: "02:45 PM",
    status: "Pending"
  }
];

const doctorsOnShift = [
  {
    name: "Dr. Taufiq Wani",
    unit: "Critical Care",
    nextSlot: "12:30 PM",
    patients: 8,
    room: "OT-2"
  },
  {
    name: "Dr. Arya Dev Rijal",
    unit: "Cardiology",
    nextSlot: "04:30 PM",
    patients: 6,
    room: "Cath Lab"
  },
  {
    name: "Dr. Subashna Maskey",
    unit: "Pediatrics",
    nextSlot: "03:00 PM",
    patients: 10,
    room: "Ward B"
  }
];

const alerts = [
  {
    severity: "High",
    title: "Insurance verification backlog",
    detail: "7 patient files are waiting for authorization before billing closes."
  },
  {
    severity: "Medium",
    title: "OT room maintenance",
    detail: "Operation Theatre B is blocked from 5:00 PM to 7:00 PM for calibration."
  },
  {
    severity: "Medium",
    title: "High pediatric demand",
    detail: "Walk-in requests are 22% above the expected Tuesday volume."
  }
];

const activityFeed = [
  { time: "08:45", item: "Front desk confirmed 12 morning bookings." },
  { time: "09:10", item: "Lab reports for 8 patients were uploaded to records." },
  { time: "10:05", item: "Two specialists updated consultation hours." },
  { time: "10:40", item: "Finance cleared yesterday's pending invoices." }
];

const departmentSummary = [
  { name: "Cardiology", volume: "34 visits", occupancy: "92%" },
  { name: "Pediatrics", volume: "29 visits", occupancy: "88%" },
  { name: "Neurology", volume: "18 visits", occupancy: "71%" }
];

const filterOptions = ["All", "Confirmed", "Pending", "Rescheduled"];

const AdminPanel = () => {
  const [statusFilter, setStatusFilter] = useState("All");

  const visibleAppointments = useMemo(() => {
    if (statusFilter === "All") {
      return appointments;
    }

    return appointments.filter((appointment) => appointment.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="admin-dashboard">
      <section className="admin-topbar">
        <div>
          <p className="admin-topbar__eyebrow">Administration</p>
          <h1>Hospital operations dashboard</h1>
          <p className="admin-topbar__description">
            Review appointments, staffing, operational risk, and department
            performance from a single control surface.
          </p>
        </div>

        <div className="admin-topbar__meta">
          <div className="admin-meta-card">
            <span>Reporting period</span>
            <strong>Today</strong>
          </div>
          <div className="admin-meta-card">
            <span>System status</span>
            <strong>Operational</strong>
          </div>
        </div>
      </section>

      <section className="admin-overview-band">
        <article className="admin-overview-hero">
          <div className="admin-overview-hero__header">
            <div>
              <p className="admin-section-kicker">Executive summary</p>
              <h2>Core hospital activity is on track</h2>
            </div>
            <span className="admin-badge admin-badge--success">Stable operations</span>
          </div>

          <div className="admin-overview-hero__metrics">
            <div>
              <span>Patient wait time</span>
              <strong>12 min</strong>
            </div>
            <div>
              <span>Bed occupancy</span>
              <strong>84%</strong>
            </div>
            <div>
              <span>Claims cleared</span>
              <strong>91%</strong>
            </div>
          </div>
        </article>

        <div className="admin-stats">
          {statCards.map((card) => (
            <article key={card.label} className={`admin-stat-card admin-stat-card--${card.tone}`}>
              <p>{card.label}</p>
              <strong>{card.value}</strong>
              <span>{card.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-layout">
        <div className="admin-layout__main">
          <article className="admin-surface">
            <div className="admin-surface__header">
              <div>
                <p className="admin-section-kicker">Scheduling</p>
                <h2>Appointment queue</h2>
              </div>

              <div className="admin-filter-row" role="tablist" aria-label="Appointment status filters">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={statusFilter === option ? "active" : ""}
                    onClick={() => setStatusFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-table">
              <div className="admin-table__head">
                <span>Patient</span>
                <span>Department</span>
                <span>Doctor</span>
                <span>Time</span>
                <span>Status</span>
              </div>

              <div className="admin-table__body">
                {visibleAppointments.map((appointment) => (
                  <div key={`${appointment.patient}-${appointment.time}`} className="admin-table__row">
                    <span className="admin-table__primary">{appointment.patient}</span>
                    <span>{appointment.department}</span>
                    <span>{appointment.doctor}</span>
                    <span>{appointment.time}</span>
                    <span>
                      <span className={`status-pill status-pill--${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="admin-surface">
            <div className="admin-surface__header">
              <div>
                <p className="admin-section-kicker">Clinical staffing</p>
                <h2>Doctors on duty</h2>
              </div>
              <button type="button" className="admin-action-button">Manage roster</button>
            </div>

            <div className="admin-staff-grid">
              {doctorsOnShift.map((doctor) => (
                <article key={doctor.name} className="admin-staff-card">
                  <div className="admin-staff-card__top">
                    <div>
                      <h3>{doctor.name}</h3>
                      <p>{doctor.unit}</p>
                    </div>
                    <span className="admin-badge admin-badge--neutral">{doctor.room}</span>
                  </div>

                  <dl>
                    <div>
                      <dt>Next slot</dt>
                      <dd>{doctor.nextSlot}</dd>
                    </div>
                    <div>
                      <dt>Patients</dt>
                      <dd>{doctor.patients}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </article>
        </div>

        <aside className="admin-layout__side">
          <article className="admin-surface">
            <div className="admin-surface__header">
              <div>
                <p className="admin-section-kicker">Risk watch</p>
                <h2>Operational alerts</h2>
              </div>
            </div>

            <div className="admin-alert-list">
              {alerts.map((alert) => (
                <article key={alert.title} className="admin-alert-card">
                  <div className="admin-alert-card__top">
                    <h3>{alert.title}</h3>
                    <span className={`admin-badge ${alert.severity === "High" ? "admin-badge--danger" : "admin-badge--warning"}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p>{alert.detail}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="admin-surface">
            <div className="admin-surface__header">
              <div>
                <p className="admin-section-kicker">Departments</p>
                <h2>Service load</h2>
              </div>
            </div>

            <div className="admin-summary-list">
              {departmentSummary.map((department) => (
                <div key={department.name} className="admin-summary-row">
                  <div>
                    <strong>{department.name}</strong>
                    <span>{department.volume}</span>
                  </div>
                  <p>{department.occupancy}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="admin-surface">
            <div className="admin-surface__header">
              <div>
                <p className="admin-section-kicker">Timeline</p>
                <h2>Recent activity</h2>
              </div>
            </div>

            <div className="admin-activity-list">
              {activityFeed.map((entry) => (
                <div key={`${entry.time}-${entry.item}`} className="admin-activity-item">
                  <span className="admin-activity-item__time">{entry.time}</span>
                  <p>{entry.item}</p>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
};

export default AdminPanel;
