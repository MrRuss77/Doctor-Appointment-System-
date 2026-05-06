import React, { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import Departments from "./Departments";
import LoginCard from "../components/auth/LoginCard";
import OtpCard from "../components/auth/OtpCard";
import RegisterCard from "../components/auth/RegisterCard";
import ResetPasswordCard from "../components/auth/ResetPasswordCard";
import {
  createAppointment,
  createUser,
  fetchDoctors,
  fetchUsers,
  loginUser,
  requestPasswordReset,
  verifyOtpCode
} from "../src/api/client";

const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const fallbackDoctorData = [
  {
    name: "Dr. Aavash Shrestha",
    field: "Anesthesiology",
    specialization: "Chief Consultant in Anaesthesia and Critical Care",
    qualification: "MBBS, MD (Anaesthesia), Fellowship in Critical Care",
    availability: "Available for consultation today",
    image: "img/Screenshot 2026-05-06 013524.png"
  },
  {
    name: "Dr. Kiran Thapa",
    field: "Cardiology",
    specialization: "Interventional Cardiologist and Heart Specialist",
    qualification: "MBBS, MD (Internal Medicine), DM Cardiology",
    availability: "Next slot: 4:30 PM",
    image: "img/Screenshot 2026-05-06 013553.png"
  },
  {
    name: "Dr. Suman Adhikari",
    field: "Neurology",
    specialization: "Senior Consultant in Brain and Nerve Disorders",
    qualification: "MBBS, MD, Fellowship in Clinical Neurology",
    availability: "Available tomorrow morning",
    image: "img/Screenshot 2026-04-29 230035.png"
  },
  {
    name: "Dr. Neha Pradhan",
    field: "Pediatrics",
    specialization: "Child Health Specialist and Neonatal Care Expert",
    qualification: "MBBS, MD Pediatrics, NICU Certification",
    availability: "Accepting new patients",
    image: "img/Screenshot 2026-04-29 230142.png"
  },
  {
    name: "Dr. Puja Maharjan",
    field: "Dentist",
    specialization: "Chief Consultant Surgeon for planned and urgent procedures",
    qualification: "BDS, MDS, Fellowship in Restorative Dentistry",
    availability: "Available for booking today",
    image: "img/Screenshot 2026-04-29 230232.png"
  },
  {
    name: "Dr. Rajesh Sharma",
    field: "Orthopedics",
    specialization: "Bone, joint, and musculoskeletal treatment specialist",
    qualification: "MBBS, MS Orthopedics, Fellowship in Sports Injury Care",
    availability: "Next slot: 1:15 PM",
    image: "img/Screenshot 2026-04-29 230051.png"
  },
  {
    name: "Dr. Bishal Gurung",
    field: "ENT",
    specialization: "Ear, Nose, Throat and Head & Neck Surgery Specialist",
    qualification: "MBBS, MS ENT",
    availability: "Available this evening",
    image: "img/Screenshot 2026-04-29 230104.png"
  },
  {
    name: "Dr. Nischal Joshi",
    field: "Gynecologist",
    specialization: "Senior Consultant Gynecologist and Obstetrician",
    qualification: "MBBS, MD Obstetrics & Gynecology",
    availability: "Consultation support all day",
    image: "img/Screenshot 2026-04-29 230248.png"
  },
  {
    name: "Dr. Anil Bista",
    field: "Psychiatrist",
    specialization: "Mental Health and Behavioral Sciences Expert",
    qualification: "MBBS, MD Psychiatry",
    availability: "Available tomorrow morning",
    image: "img/Screenshot 2026-04-29 230035.png"
  }
];

const pageContent = {
  home: {
    eyebrow: "Healthcare that feels approachable",
    title: "Hospital experiences built around trust and speed.",
    description:
      "This landing state is ready for hero content, quick actions, and featured services while keeping the same responsive shell."
  },
  doctors: {
    eyebrow: "MediCare Specialists",
    title: "Meet the doctors behind your hospital care.",
    description:
      "Browse consultants, review specialties, and book appointments through a clear hospital-style experience."
  },
  departments: {
    eyebrow: "",
    title: "",
    description: ""
  },
  login: {
    eyebrow: "MediCare Access",
    title: "Login",
    description:
      "Secure patient login, password reset, and OTP verification."
  }
};

const emptyBookingForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  gender: "",
  age: "",
  date: "",
  time: "",
  message: ""
};

const normalizeDepartment = (department) => {
  const departmentMap = {
    anesthiology: "anesthesiology",
    dentist: "dentist",
    physiactrist: "psychiatrist",
    gynecologist: "gynecologist",
    cardiology: "cardiology",
    neurology: "neurology",
    pediatrics: "pediatrics",
    orthopedics: "orthopedics",
    ent: "ent"
  };

  const normalizedDepartment = department.toLowerCase();
  return departmentMap[normalizedDepartment] || normalizedDepartment;
};

const parseName = (fullName) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "Patient",
    lastName: parts.slice(1).join(" ") || "User"
  };
};

const mapDoctorRecord = (doctor) => ({
  name: doctor.fullName,
  field: doctor.department?.name || "General",
  specialization: doctor.specialization || "Not specified",
  qualification: doctor.qualification || "Not specified",
  availability: doctor.availabilityText || "Schedule not updated",
  image: doctor.image || "",
  backendId: doctor._id,
  departmentId: doctor.department?._id
});

const getMessageColor = (message) => {
  if (!message) {
    return "#1f2937";
  }

  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("success") ||
    normalizedMessage.includes("welcome") ||
    normalizedMessage.includes("sent")
  ) {
    return "#166534";
  }

  return "#dc2626";
};

const demoPatientUser = {
  firstName: "Prasanna",
  lastName: "Patient",
  email: "prasanna@example.com",
  role: "patient"
};

const Doctors = ({ activePage, onNavigate, doctorFilter, authUser, onLoginSuccess, onBack }) => {
  const [loginView, setLoginView] = useState("login");
  const [authMessage, setAuthMessage] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [resetPayload, setResetPayload] = useState(null);

  const [doctors, setDoctors] = useState(fallbackDoctorData);
  const [doctorsError, setDoctorsError] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorTab, setDoctorTab] = useState("specialization");

  const [bookingForm, setBookingForm] = useState(emptyBookingForm);
  const [bookingBusy, setBookingBusy] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  const currentPage = pageContent[activePage] || pageContent.doctors;
  const showDoctors = activePage === "doctors";
  const showLogin = activePage === "login";
  const showDepartments = activePage === "departments";

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorRecords = await fetchDoctors();
        setDoctorsError("");

        if (doctorRecords.length > 0) {
          setDoctors(doctorRecords.map(mapDoctorRecord));
        } else {
          setDoctors(fallbackDoctorData);
          setDoctorsError("No doctors found yet. Showing sample doctors.");
        }
      } catch (error) {
        setDoctors(fallbackDoctorData);
        setDoctorsError(`Backend doctors are unavailable right now. Showing sample doctors instead.`);
      }
    };

    loadDoctors();
  }, []);

  useEffect(() => {
    setSelectedDoctor(null);
    setDoctorTab("specialization");
    setBookingForm(emptyBookingForm);
    setBookingMessage("");
  }, [doctorFilter]);

  const clearStatus = () => {
    setAuthMessage("");
  };

  const exitAuthFlow = () => {
    setLoginView("login");
    setResetPayload(null);
    clearStatus();
    onNavigate?.("home");
  };

  const openBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorTab("specialization");
    setBookingForm(emptyBookingForm);
    setBookingMessage("");
  };

  const closeBooking = () => {
    setSelectedDoctor(null);
    setDoctorTab("specialization");
    setBookingForm(emptyBookingForm);
    setBookingMessage("");
  };

  const filteredDoctors = doctorFilter
    ? doctors.filter((doctor) =>
        doctor.field.toLowerCase().includes(doctorFilter.toLowerCase())
      )
    : doctors;

  const handleDepartmentSelect = (department) => {
    onNavigate?.("doctors", {
      department: normalizeDepartment(department)
    });
  };

  const handleLogin = async (credentials) => {
    if (authBusy) {
      return;
    }

    const normalizedEmail = credentials.email.trim().toLowerCase();

    if (normalizedEmail === "prasanna@example.com" && credentials.password === "patient123") {
      onLoginSuccess?.(demoPatientUser);
      setAuthMessage("Login successful. Welcome Prasanna Patient.");
      setLoginView("login");
      onNavigate?.("home");
      return;
    }

    setAuthBusy(true);

    try {
      const response = await loginUser(credentials);
      const fullName = `${response.user.firstName} ${response.user.lastName}`.trim();
      onLoginSuccess?.(response.user);
      setAuthMessage(`Login successful. Welcome ${fullName}.`);
      setLoginView("login");
      onNavigate?.("home");
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleReset = async (payload) => {
    if (authBusy) {
      return;
    }

    setAuthBusy(true);

    const requestPayload = {
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      confirmPassword: payload.verifyPassword
    };

    try {
      const response = await requestPasswordReset(requestPayload);
      setResetPayload(requestPayload);
      setLoginView("otp");
      setAuthMessage(`${response.message} OTP code: ${response.otp}`);
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleRegister = async (payload) => {
    if (authBusy) {
      return;
    }

    setAuthBusy(true);

    try {
      await createUser({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        role: "patient"
      });

      setAuthMessage("Registration successful. Please login with your new account.");
      setLoginView("login");
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleOtpSubmit = async (otpCode) => {
    if (authBusy) {
      return;
    }

    if (!resetPayload?.email) {
      setAuthMessage("Start password reset first so we know which account to verify.");
      return;
    }

    setAuthBusy(true);

    try {
      await verifyOtpCode({ email: resetPayload.email, otp: otpCode });
      setAuthMessage("OTP verified successfully. Please login with your new password.");
      setLoginView("login");
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleResendOtp = async () => {
    if (authBusy) {
      return;
    }

    if (!resetPayload) {
      setAuthMessage("Please submit the reset form first.");
      return;
    }

    setAuthBusy(true);

    try {
      const response = await requestPasswordReset(resetPayload);
      setAuthMessage(`A new OTP has been sent. OTP code: ${response.otp}`);
    } catch (error) {
      setAuthMessage(error.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const updateBookingField = (field, value) => {
    setBookingForm((current) => ({
      ...current,
      [field]: value
    }));
    setBookingMessage("");
  };

  const ensurePatient = async () => {
    const users = await fetchUsers();
    const normalizedEmail = bookingForm.email.trim().toLowerCase();
    const normalizedPhone = bookingForm.phone.trim();

    const existingUser = users.find((user) => {
      if (normalizedEmail) {
        return user.email?.toLowerCase() === normalizedEmail;
      }

      return user.phone?.trim() === normalizedPhone;
    });

    if (existingUser) {
      return existingUser;
    }

    const { firstName, lastName } = parseName(bookingForm.fullName);

    return createUser({
      firstName,
      lastName,
      email: normalizedEmail || `patient.${Date.now()}@local.test`,
      phone: normalizedPhone,
      password: "temporary-password",
      role: "patient",
      address: bookingForm.address.trim(),
      gender: bookingForm.gender
    });
  };

  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();

    if (bookingBusy) {
      return;
    }

    const requiredFields = [
      bookingForm.fullName,
      bookingForm.phone,
      bookingForm.address,
      bookingForm.gender,
      bookingForm.date,
      bookingForm.time
    ];

    if (requiredFields.some((field) => !field.trim())) {
      setBookingMessage("Please fill all required fields before submitting.");
      return;
    }

    if (!selectedDoctor?.backendId || !selectedDoctor.departmentId) {
      setBookingMessage("This doctor is not synced with backend yet. Please choose a doctor from API data.");
      return;
    }

    const appointmentDate = new Date(`${bookingForm.date}T${bookingForm.time}:00`);

    if (Number.isNaN(appointmentDate.getTime())) {
      setBookingMessage("Please select a valid date and time.");
      return;
    }

    setBookingBusy(true);

    try {
      const patient = await ensurePatient();

      await createAppointment({
        patient: patient._id,
        doctor: selectedDoctor.backendId,
        department: selectedDoctor.departmentId,
        appointmentDate: appointmentDate.toISOString(),
        status: "pending",
        reason: bookingForm.message.trim() || "General consultation",
        notes: [
          `Requested by: ${bookingForm.fullName.trim()}`,
          `Phone: ${bookingForm.phone.trim()}`,
          `Email: ${bookingForm.email.trim() || "not provided"}`,
          `Address: ${bookingForm.address.trim()}`,
          `Gender: ${bookingForm.gender}`,
          `Age: ${bookingForm.age.trim() || "not provided"}`
        ].join(" | ")
      });

      setBookingMessage("Appointment booked successfully.");
      setBookingForm(emptyBookingForm);
    } catch (error) {
      setBookingMessage(error.message);
    } finally {
      setBookingBusy(false);
    }
  };

  const loginCardBody = {
    login: (
      <LoginCard
        onForgotPassword={() => {
          clearStatus();
          setLoginView("reset");
        }}
        onRegister={() => {
          clearStatus();
          setLoginView("register");
        }}
        onLogin={handleLogin}
        onBack={exitAuthFlow}
      />
    ),
    register: (
      <RegisterCard
        onRegister={handleRegister}
        onBackToLogin={() => {
          clearStatus();
          setLoginView("login");
        }}
      />
    ),
    reset: (
      <ResetPasswordCard
        onBackToLogin={() => {
          clearStatus();
          setLoginView("login");
        }}
        onReset={handleReset}
      />
    ),
    otp: (
      <OtpCard
        onResendCode={handleResendOtp}
        onSubmitOtp={handleOtpSubmit}
      />
    )
  };

  return (
    <section className={`page-section ${showDepartments ? "departments-page" : ""}`}>
      <div
        className="page-copy"
        style={
          showLogin
            ? { display: "none" }
            : showDepartments
              ? { display: "none" }
              : undefined
        }
      >
        {showDoctors && !selectedDoctor ? (
          <button
            type="button"
            className="page-copy__back"
            onClick={onBack}
            aria-label="Go back"
          >
            <BackIcon />
          </button>
        ) : null}
        <p className="page-copy__eyebrow">{currentPage.eyebrow}</p>
        <h1>{currentPage.title}</h1>
        <p className="page-copy__description">{currentPage.description}</p>
      </div>

      {showDoctors ? (
        selectedDoctor ? (
          <article className="doctor-booking">
            <button type="button" className="doctor-booking__back" onClick={closeBooking}>
              <BackIcon />
            </button>

            <div className="doctor-booking__top">
              <img
                className="doctor-booking__image"
                src={selectedDoctor.image}
                alt={selectedDoctor.name}
              />

              <div className="doctor-booking__header">
                <h2>{selectedDoctor.name}</h2>
                <p className="doctor-booking__field">{selectedDoctor.field}</p>
              </div>
            </div>

            <div className="doctor-booking__divider" />

            <div className="doctor-booking__tabs" role="tablist" aria-label={`${selectedDoctor.name} details`}>
              <button
                type="button"
                role="tab"
                aria-selected={doctorTab === "specialization"}
                className={doctorTab === "specialization" ? "active" : ""}
                onClick={() => setDoctorTab("specialization")}
              >
                Specialization
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={doctorTab === "qualification"}
                className={doctorTab === "qualification" ? "active" : ""}
                onClick={() => setDoctorTab("qualification")}
              >
                Qualification
              </button>
            </div>

            <p className="doctor-booking__detail">
              {doctorTab === "specialization"
                ? selectedDoctor.specialization
                : selectedDoctor.qualification}
            </p>

            <div className="appointment-panel">
              <h3>Book Appointment</h3>

              <form className="appointment-form" onSubmit={handleAppointmentSubmit}>
                <label className="appointment-field">
                  <span>Full Name*</span>
                  <input
                    type="text"
                    value={bookingForm.fullName}
                    onChange={(event) => updateBookingField("fullName", event.target.value)}
                  />
                </label>

                <label className="appointment-field">
                  <span>Phone Number*</span>
                  <input
                    type="text"
                    value={bookingForm.phone}
                    onChange={(event) => updateBookingField("phone", event.target.value)}
                  />
                </label>

                <label className="appointment-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(event) => updateBookingField("email", event.target.value)}
                  />
                </label>

                <label className="appointment-field">
                  <span>Address*</span>
                  <input
                    type="text"
                    value={bookingForm.address}
                    onChange={(event) => updateBookingField("address", event.target.value)}
                  />
                </label>

                <label className="appointment-field">
                  <span>Gender*</span>
                  <select
                    value={bookingForm.gender}
                    onChange={(event) => updateBookingField("gender", event.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="appointment-field">
                  <span>Age</span>
                  <input
                    type="number"
                    min="0"
                    value={bookingForm.age}
                    onChange={(event) => updateBookingField("age", event.target.value)}
                  />
                </label>

                <label className="appointment-field">
                  <span>Pick a Date*</span>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(event) => updateBookingField("date", event.target.value)}
                  />
                </label>

                <label className="appointment-field">
                  <span>Time*</span>
                  <input
                    type="time"
                    value={bookingForm.time}
                    onChange={(event) => updateBookingField("time", event.target.value)}
                  />
                </label>

                <div className="appointment-field appointment-field--spacer" aria-hidden="true" />

                <label className="appointment-field appointment-field--full">
                  <span>Message</span>
                  <textarea
                    rows="3"
                    placeholder="Enter your message here..."
                    value={bookingForm.message}
                    onChange={(event) => updateBookingField("message", event.target.value)}
                  />
                </label>

                <div className="appointment-actions">
                  <button type="submit" disabled={bookingBusy}>
                    {bookingBusy ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>

              {bookingMessage ? (
                <p className={`auth-card__message ${getMessageColor(bookingMessage) === "#166534" ? "auth-card__message--success" : "auth-card__message--error"}`} style={{ marginTop: "14px" }}>{bookingMessage}</p>
              ) : null}
            </div>
          </article>
        ) : (
          <>
            {doctorsError ? (
              <p className="auth-card__message auth-card__message--error" style={{ margin: "0 0 6px" }}>{doctorsError}</p>
            ) : null}
            <div className="doctor-grid">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doc) => (
                  <DoctorCard
                    key={doc.backendId || doc.name}
                    doctor={doc}
                    onBookAppointment={openBooking}
                  />
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px" }}>
                  <p style={{ fontSize: "18px", color: "#64748b" }}>
                    No doctors available in this department right now.
                  </p>
                </div>
              )}
            </div>
          </>
        )
      ) : showLogin ? (
        <div className="page-panel-shell">
          <button
            type="button"
            className="page-copy__back"
            onClick={onBack}
            aria-label="Go back"
          >
            <BackIcon />
          </button>

          <div
            className={`placeholder-panel auth-panel auth-panel--${loginView}`}
            style={{
              maxWidth: "480px",
              width: "100%",
              margin: "0 auto",
              padding: "24px"
            }}
          >
            <div className="auth-panel__card">
              {loginCardBody[loginView]}
              {authMessage ? (
                <p className={`auth-card__message ${getMessageColor(authMessage) === "#166534" ? "auth-card__message--success" : "auth-card__message--error"}`} style={{ margin: "16px 0 0", textAlign: "center" }}>
                  {authBusy ? "Working... " : ""}
                  {authMessage}
                </p>
              ) : authBusy ? (
                <p className="auth-card__message" style={{ margin: "16px 0 0", textAlign: "center" }}>
                  Working...
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : showDepartments ? (
        <div className="page-panel-shell">
          <button
            type="button"
            className="page-copy__back"
            onClick={onBack}
            aria-label="Go back"
          >
            <BackIcon />
          </button>
          <Departments onSelectDepartment={handleDepartmentSelect} />
        </div>
      ) : (
        <div className="placeholder-panel">
          <h2>{currentPage.eyebrow}</h2>
          <p>
            This section is intentionally interactive already, so you can keep
            building page-by-page without reworking the navigation later.
          </p>
        </div>
      )}
    </section>
  );
};

export default Doctors;
