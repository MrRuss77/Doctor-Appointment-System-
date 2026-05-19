import React, { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import ConfirmDialog from "../components/ConfirmDialog";
import Departments from "./Departments";
import LoginCard from "../components/auth/LoginCard";
import OtpCard from "../components/auth/OtpCard";
import RegisterCard from "../components/auth/RegisterCard";
import ResetPasswordCard from "../components/auth/ResetPasswordCard";
import {
  createAppointment,
  createUser,
  fetchAppointments,
  fetchDoctorAvailability,
  fetchDoctors,
  fetchUsers,
  loginUser,
  requestPasswordReset,
  sendOtp,
  verifyOtpCode
} from "../src/api/client";

const createFallbackAvatar = (name = "Doctor") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <rect width="240" height="240" rx="36" fill="#dbeafe" />
      <circle cx="120" cy="88" r="42" fill="#ffffff" />
      <path d="M56 194c12-28 35-46 64-46s52 18 64 46" fill="#ffffff" />
      <text x="120" y="220" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#31508f">
        ${String(name).replace(/^Dr\.\s*/i, "").trim().slice(0, 1).toUpperCase() || "D"}
      </text>
    </svg>
  `)}`;

const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const fallbackDoctorData = [
  {
    "name": "Dr. Aavash Shrestha",
    "field": "Anesthesiology",
    "specialization": "Chief Consultant in Anaesthesia and Critical Care",
    "qualification": "MBBS, MD (Anaesthesia), Fellowship in Critical Care",
    "availability": "Available for consultation today",
    "image": "img/Screenshot 2026-05-06 013524.png"
  },
  {
    "name": "Dr. Pratiksha Rana",
    "field": "Anesthesiology",
    "specialization": "Pain Management Specialist",
    "qualification": "MBBS, MD (Anaesthesia)",
    "availability": "Next slot: 10:00 AM",
    "image": "img/IMG_6439.jpg"
  },
  {
    "name": "Dr. Sandeep Basnet",
    "field": "Anesthesiology",
    "specialization": "Pediatric Anesthesiologist",
    "qualification": "MBBS, MD (Anaesthesia)",
    "availability": "Available tomorrow",
    "image": "img/IMG_6481.jpg"
  },
  {
    "name": "Dr. Puja Maharjan",
    "field": "Dentist",
    "specialization": "Chief Consultant Surgeon for planned and urgent procedures",
    "qualification": "BDS, MDS, Fellowship in Restorative Dentistry",
    "availability": "Available for booking today",
    "image": "img/Screenshot 2026-04-29 230232.png"
  },
  {
    "name": "Dr. Suman Karki",
    "field": "Dentist",
    "specialization": "Orthodontist",
    "qualification": "BDS, MDS (Orthodontics)",
    "availability": "Next slot: 2:00 PM",
    "image": "img/IMG_6482.jpg"
  },
  {
    "name": "Dr. Anisha Shrestha",
    "field": "Dentist",
    "specialization": "Pediatric Dentist",
    "qualification": "BDS, MDS (Pediatric Dentistry)",
    "availability": "Available Thursday",
    "image": "img/FullSizeRender.jpg"
  },
  {
    "name": "Dr. Anil Bista",
    "field": "Psychiatrist",
    "specialization": "Mental Health and Behavioral Sciences Expert",
    "qualification": "MBBS, MD Psychiatry",
    "availability": "Available tomorrow morning",
    "image": "img/Screenshot 2026-04-29 230035.png"
  },
  {
    "name": "Dr. Manisha Koirala",
    "field": "Psychiatrist",
    "specialization": "Child and Adolescent Psychiatrist",
    "qualification": "MBBS, MD Psychiatry",
    "availability": "Next slot: 1:30 PM",
    "image": "img/image.png.jpeg"
  },
  {
    "name": "Dr. Bikash Thapa",
    "field": "Psychiatrist",
    "specialization": "Addiction Psychiatrist",
    "qualification": "MBBS, MD Psychiatry",
    "availability": "Available next week",
    "image": "img/Screenshot 2026-05-06 013524.png"
  },
  {
    "name": "Dr. Nischal Joshi",
    "field": "Gynecologist",
    "specialization": "Senior Consultant Gynecologist and Obstetrician",
    "qualification": "MBBS, MD Obstetrics & Gynecology",
    "availability": "Consultation support all day",
    "image": "img/Screenshot 2026-04-29 230248.png"
  },
  {
    "name": "Dr. Sunita Sharma",
    "field": "Gynecologist",
    "specialization": "Reproductive Endocrinologist",
    "qualification": "MBBS, MD Obstetrics & Gynecology",
    "availability": "Next slot: 11:15 AM",
    "image": "img/IMG_6439.jpg"
  },
  {
    "name": "Dr. Roshni Rai",
    "field": "Gynecologist",
    "specialization": "Maternal-Fetal Medicine Specialist",
    "qualification": "MBBS, MD Obstetrics & Gynecology",
    "availability": "Available Wednesday",
    "image": "img/IMG_6481.jpg"
  },
  {
    "name": "Dr. Kiran Thapa",
    "field": "Cardiology",
    "specialization": "Interventional Cardiologist and Heart Specialist",
    "qualification": "MBBS, MD (Internal Medicine), DM Cardiology",
    "availability": "Next slot: 4:30 PM",
    "image": "img/Screenshot 2026-05-06 013553.png"
  },
  {
    "name": "Dr. Ramesh Pandey",
    "field": "Cardiology",
    "specialization": "Electrophysiologist",
    "qualification": "MBBS, MD, DM Cardiology",
    "availability": "Next slot: 9:00 AM",
    "image": "img/IMG_6482.jpg"
  },
  {
    "name": "Dr. Anjali Gurung",
    "field": "Cardiology",
    "specialization": "Non-Invasive Cardiologist",
    "qualification": "MBBS, MD, Fellowship in Cardiology",
    "availability": "Available tomorrow",
    "image": "img/FullSizeRender.jpg"
  },
  {
    "name": "Dr. Prakash Khatri",
    "field": "Neurology",
    "specialization": "Senior Consultant Neurologist",
    "qualification": "MBBS, MD, DM Neurology",
    "availability": "Next slot: 10:30 AM",
    "image": "img/image.png.jpeg"
  },
  {
    "name": "Dr. Nirmala Adhikari",
    "field": "Neurology",
    "specialization": "Epilepsy Specialist",
    "qualification": "MBBS, MD, DM Neurology",
    "availability": "Available Friday",
    "image": "img/Screenshot 2026-04-29 230051.png"
  },
  {
    "name": "Dr. Susan Maharjan",
    "field": "Neurology",
    "specialization": "Stroke Specialist",
    "qualification": "MBBS, MD, Fellowship in Stroke",
    "availability": "Next slot: 3:00 PM",
    "image": "img/Screenshot 2026-04-29 230104.png"
  },
  {
    "name": "Dr. Neha Pradhan",
    "field": "Pediatrics",
    "specialization": "Child Health Specialist and Neonatal Care Expert",
    "qualification": "MBBS, MD Pediatrics, NICU Certification",
    "availability": "Accepting new patients",
    "image": "img/Screenshot 2026-04-29 230142.png"
  },
  {
    "name": "Dr. Bimal Shrestha",
    "field": "Pediatrics",
    "specialization": "Pediatric Pulmonologist",
    "qualification": "MBBS, MD Pediatrics",
    "availability": "Next slot: 12:00 PM",
    "image": "img/IMG_6439.jpg"
  },
  {
    "name": "Dr. Karuna Thapa",
    "field": "Pediatrics",
    "specialization": "Pediatric Cardiologist",
    "qualification": "MBBS, MD Pediatrics, Fellowship in Cardiology",
    "availability": "Available Saturday",
    "image": "img/IMG_6481.jpg"
  },
  {
    "name": "Dr. Rajesh Sharma",
    "field": "Orthopedics",
    "specialization": "Bone, joint, and musculoskeletal treatment specialist",
    "qualification": "MBBS, MS Orthopedics, Fellowship in Sports Injury Care",
    "availability": "Next slot: 1:15 PM",
    "image": "img/Screenshot 2026-04-29 230051.png"
  },
  {
    "name": "Dr. Dinesh Karki",
    "field": "Orthopedics",
    "specialization": "Joint Replacement Surgeon",
    "qualification": "MBBS, MS Orthopedics",
    "availability": "Available tomorrow",
    "image": "img/IMG_6482.jpg"
  },
  {
    "name": "Dr. Smriti Joshi",
    "field": "Orthopedics",
    "specialization": "Pediatric Orthopedist",
    "qualification": "MBBS, MS Orthopedics",
    "availability": "Next slot: 10:45 AM",
    "image": "img/FullSizeRender.jpg"
  },
  {
    "name": "Dr. Bishal Gurung",
    "field": "ENT",
    "specialization": "Ear, Nose, Throat and Head & Neck Surgery Specialist",
    "qualification": "MBBS, MS ENT",
    "availability": "Available this evening",
    "image": "img/Screenshot 2026-04-29 230104.png"
  },
  {
    "name": "Dr. Asmita Rai",
    "field": "ENT",
    "specialization": "Rhinology Specialist",
    "qualification": "MBBS, MS ENT",
    "availability": "Next slot: 2:30 PM",
    "image": "img/image.png.jpeg"
  },
  {
    "name": "Dr. Suman Poudel",
    "field": "ENT",
    "specialization": "Otology Specialist",
    "qualification": "MBBS, MS ENT",
    "availability": "Available Monday",
    "image": "img/Screenshot 2026-04-29 230232.png"
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
  bloodGroup: "",
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
  nmcNumber: doctor.nmcNumber || "",
  availability: doctor.availabilityText || "Schedule not updated",
  availabilitySlots: Array.isArray(doctor.availabilitySlots) ? doctor.availabilitySlots : [],
  consultationFee: Number(doctor.consultationFee || 0),
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

const formatAvailabilityDate = (value) => {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    weekday: "short"
  });
};

const formatTimeLabel = (timeValue) => {
  const [hours, minutes] = String(timeValue || "").split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return timeValue;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${normalizedHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const toMinutes = (timeValue) => {
  const [hours, minutes] = String(timeValue || "").split(":").map(Number);
  return hours * 60 + minutes;
};

const fromMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const buildProfilePrefill = (user) => {
  if (!user) {
    return {};
  }

  return {
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    phone: user.phone || "",
    email: user.email || ""
  };
};

const getUserId = (user) => String(user?._id || user?.id || "").trim();

const Doctors = ({ activePage, onNavigate, doctorFilter, authUser, onLoginSuccess, onBack }) => {
  const [loginView, setLoginView] = useState("login");
  const [authMessage, setAuthMessage] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [resetPayload, setResetPayload] = useState(null);

  const [doctors, setDoctors] = useState(fallbackDoctorData);
  const [doctorsError, setDoctorsError] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorTab, setDoctorTab] = useState("specialization");
  const [selectedDoctorSlots, setSelectedDoctorSlots] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  const [bookingForm, setBookingForm] = useState(emptyBookingForm);
  const [bookingBusy, setBookingBusy] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingDialog, setBookingDialog] = useState({ isOpen: false, type: "success", message: "" });

  const currentPage = pageContent[activePage] || pageContent.doctors;
  const showDoctors = activePage === "doctors";
  const showLogin = activePage === "login";
  const showDepartments = activePage === "departments";

  useEffect(() => {
    let isActive = true;

    const loadDoctors = async () => {
      try {
        const doctorRecords = await fetchDoctors(doctorSearch);

        if (!isActive) {
          return;
        }

        if (doctorRecords.length > 0) {
          setDoctorsError("");
          setDoctors(doctorRecords.map(mapDoctorRecord));
        } else {
          const normalizedSearch = doctorSearch.trim().toLowerCase();
          const fallbackDoctors = normalizedSearch
            ? fallbackDoctorData.filter((doctor) =>
                [
                  doctor.name,
                  doctor.field,
                  doctor.specialization,
                  doctor.qualification,
                  doctor.availability
                ]
                  .join(" ")
                  .toLowerCase()
                  .includes(normalizedSearch)
              )
            : fallbackDoctorData;

          setDoctors(fallbackDoctors);
          setDoctorsError(doctorSearch.trim() && fallbackDoctors.length === 0 ? "No doctors found." : "No doctors found in database. Showing sample doctors from catalog instead.");
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        const normalizedSearch = doctorSearch.trim().toLowerCase();
        const fallbackDoctors = normalizedSearch
          ? fallbackDoctorData.filter((doctor) =>
              [
                doctor.name,
                doctor.field,
                doctor.specialization,
                doctor.qualification,
                doctor.availability
              ]
                .join(" ")
                .toLowerCase()
                .includes(normalizedSearch)
            )
          : fallbackDoctorData;

        setDoctors(fallbackDoctors);
        setDoctorsError(`Backend doctors are unavailable right now. Showing sample doctors instead.`);
      }
    };

    const searchTimer = setTimeout(loadDoctors, doctorSearch.trim() ? 250 : 0);

    return () => {
      isActive = false;
      clearTimeout(searchTimer);
    };
  }, [doctorSearch]);

  useEffect(() => {
    setSelectedDoctor(null);
    setDoctorTab("specialization");
    setBookingForm(emptyBookingForm);
    setBookingMessage("");
  }, [doctorFilter]);

  useEffect(() => {
    if (!selectedDoctor?.backendId) {
      setSelectedDoctorSlots([]);
      setDoctorAppointments([]);
      setAvailabilityMessage("");
      return;
    }

    let isActive = true;

    const loadBookingData = async () => {
      setAvailabilityMessage("Refreshing doctor availability...");

      try {
        const [availability, appointments] = await Promise.all([
          fetchDoctorAvailability(selectedDoctor.backendId),
          fetchAppointments({ doctor: selectedDoctor.backendId })
        ]);

        if (!isActive) {
          return;
        }

        setSelectedDoctorSlots(Array.isArray(availability.slots) ? availability.slots : []);
        setDoctorAppointments(Array.isArray(appointments) ? appointments : []);
        setAvailabilityMessage("");
      } catch (error) {
        if (!isActive) {
          return;
        }

        setSelectedDoctorSlots(selectedDoctor.availabilitySlots || []);
        setDoctorAppointments([]);
        setAvailabilityMessage(error.message || "Could not refresh live availability.");
      }
    };

    loadBookingData();
    const refreshTimer = window.setInterval(loadBookingData, 30000);

    return () => {
      isActive = false;
      window.clearInterval(refreshTimer);
    };
  }, [selectedDoctor]);

  const bookedSlotKeys = React.useMemo(() => {
    return new Set(
      doctorAppointments
        .filter((appointment) => ["pending", "confirmed"].includes(String(appointment.status || "").toLowerCase()))
        .map((appointment) => {
          const date = new Date(appointment.appointmentDate);

          if (Number.isNaN(date.getTime())) {
            return "";
          }

          const dateKey = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
          ].join("-");
          const timeKey = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
          return `${dateKey}T${timeKey}`;
        })
        .filter(Boolean)
    );
  }, [doctorAppointments]);

  const slotMap = React.useMemo(() => {
    if (!selectedDoctorSlots) {
      return new Map();
    }

    return selectedDoctorSlots.reduce((map, slot) => {
      if (!slot?.date || !slot?.startTime || !slot?.endTime) {
        return map;
      }

      const existing = map.get(slot.date) || [];
      const startMinutes = toMinutes(slot.startTime);
      const endMinutes = toMinutes(slot.endTime);

      if (
        Number.isNaN(startMinutes) ||
        Number.isNaN(endMinutes) ||
        startMinutes >= endMinutes
      ) {
        return map;
      }

      for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
        const time = fromMinutes(minutes);
        const key = `${slot.date}T${time}`;
        existing.push({
          key,
          date: slot.date,
          time,
          endTime: slot.endTime,
          note: slot.note || "",
          isAvailable: slot.isAvailable !== false,
          isBooked: bookedSlotKeys.has(key)
        });
      }

      existing.sort((left, right) => left.time.localeCompare(right.time));
      map.set(slot.date, existing);
      return map;
    }, new Map());
  }, [selectedDoctorSlots, bookedSlotKeys]);

  const availableDates = React.useMemo(
    () => Array.from(slotMap.keys()).sort((left, right) => left.localeCompare(right)),
    [slotMap]
  );

  const slotsForSelectedDate = React.useMemo(
    () => (bookingForm.date ? slotMap.get(bookingForm.date) || [] : []),
    [slotMap, bookingForm.date]
  );

  const selectableSlots = React.useMemo(
    () => slotsForSelectedDate.filter((slot) => slot.isAvailable && !slot.isBooked),
    [slotsForSelectedDate]
  );

  useEffect(() => {
    if (!selectedDoctor) {
      return;
    }

    setBookingForm((current) => ({
      ...current,
      date: availableDates.includes(current.date) ? current.date : availableDates[0] || "",
      time: (() => {
        const nextDate = availableDates.includes(current.date) ? current.date : availableDates[0] || "";
        const dateSlots = nextDate ? slotMap.get(nextDate) || [] : [];
        const currentSlot = dateSlots.find(
          (slot) => slot.time === current.time && slot.isAvailable && !slot.isBooked
        );

        return currentSlot?.time || dateSlots.find((slot) => slot.isAvailable && !slot.isBooked)?.time || "";
      })()
    }));
  }, [selectedDoctor, availableDates, slotMap]);

  useEffect(() => {
    if (!bookingForm.date) {
      return;
    }

    if (selectableSlots.length === 0) {
      setBookingForm((current) => ({ ...current, time: "" }));
      return;
    }

    if (!selectableSlots.some((slot) => slot.time === bookingForm.time)) {
      setBookingForm((current) => ({ ...current, time: selectableSlots[0].time }));
    }
  }, [selectableSlots, bookingForm.date, bookingForm.time]);

  const clearStatus = () => {
    setAuthMessage("");
    setResetEmailError("");
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
    setSelectedDoctorSlots(doctor.availabilitySlots || []);
    setDoctorAppointments([]);
    setAvailabilityMessage("");
    setBookingForm({
      ...emptyBookingForm,
      ...buildProfilePrefill(authUser)
    });
    setBookingMessage("");
  };

  const closeBooking = () => {
    setSelectedDoctor(null);
    setDoctorTab("specialization");
    setSelectedDoctorSlots([]);
    setDoctorAppointments([]);
    setAvailabilityMessage("");
    setBookingForm(emptyBookingForm);
    setBookingMessage("");
  };

  const clearDoctorSearch = () => {
    setDoctorSearch("");
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

  const handleRequestOtp = async (email) => {
    if (authBusy) {
      return;
    }

    setAuthBusy(true);

    try {
      const response = await sendOtp({ email });
      setResetPayload({ email });
      setLoginView("otp");
      setAuthMessage(response.message);
      setResetEmailError("");
    } catch (error) {
      setAuthMessage("");
      setResetEmailError(error.message);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleUpdatePassword = async (passwords) => {
    if (authBusy) {
      return;
    }

    if (!resetPayload?.email) {
      setAuthMessage("Start password reset first so we know which account to update.");
      return;
    }

    setAuthBusy(true);

    try {
      const response = await requestPasswordReset({
        email: resetPayload.email,
        password: passwords.password,
        confirmPassword: passwords.verifyPassword
      });
      setAuthMessage(response.message);
      setLoginView("login");
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
      const response = await createUser({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        role: "patient"
      });

      setAuthMessage(response.message || "Registration successful. Please login.");
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
      setAuthMessage("OTP verified successfully. Please enter your new password.");
      setLoginView("new-password");
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

    if (!resetPayload?.email) {
      setAuthMessage("Please submit your email first.");
      return;
    }

    setAuthBusy(true);

    try {
      const response = await sendOtp({ email: resetPayload.email });
      setAuthMessage(response.message);
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
    const authUserId = getUserId(authUser);
    const authFullName = `${authUser?.firstName || ""} ${authUser?.lastName || ""}`.trim();
    const isLoggedInPatient =
      authUser?.role === "patient" &&
      authUserId &&
      bookingForm.fullName.trim().toLowerCase() === authFullName.toLowerCase() &&
      bookingForm.email.trim().toLowerCase() === String(authUser.email || "").trim().toLowerCase() &&
      bookingForm.phone.trim() === String(authUser.phone || "").trim();

    if (isLoggedInPatient) {
      return { ...authUser, _id: authUserId };
    }

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

    if (!bookingForm.date || !bookingForm.time) {
      setBookingMessage("Please choose an available date and time slot.");
      return;
    }

    const selectedSlot = slotsForSelectedDate.find((slot) => slot.time === bookingForm.time);

    if (!selectedSlot || !selectedSlot.isAvailable || selectedSlot.isBooked) {
      setBookingMessage("Please choose an available, unbooked time slot.");
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

      const response = await createAppointment({
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
          `Blood Group: ${bookingForm.bloodGroup || "not provided"}`,
          `Age: ${bookingForm.age.trim() || "not provided"}`
        ].join(" | ")
      });

      const refreshedAppointments = await fetchAppointments({ doctor: selectedDoctor.backendId });
      setDoctorAppointments(Array.isArray(refreshedAppointments) ? refreshedAppointments : []);
      setBookingMessage(response.message || "Appointment booked successfully.");
      setBookingDialog({
        isOpen: true,
        type: "success",
        message: "Appointment Booked Successfully!"
      });
      setBookingForm({
        ...emptyBookingForm,
        ...buildProfilePrefill(authUser),
        date: bookingForm.date,
        time: ""
      });
    } catch (error) {
      setBookingMessage(error.message);
      setBookingDialog({
        isOpen: true,
        type: "error",
        message: "Booking Failed. Please try again."
      });
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
        step="email"
        onBackToLogin={() => {
          clearStatus();
          setLoginView("login");
        }}
        onSubmitEmail={handleRequestOtp}
        resetEmailError={resetEmailError}
        onDismissResetEmailError={() => setResetEmailError("")}
      />
    ),
    "new-password": (
      <ResetPasswordCard
        step="password"
        onBackToLogin={() => {
          clearStatus();
          setLoginView("login");
        }}
        onSubmitPasswords={handleUpdatePassword}
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
                src={selectedDoctor.image || createFallbackAvatar(selectedDoctor.name)}
                alt={selectedDoctor.name}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = createFallbackAvatar(selectedDoctor.name);
                }}
              />

              <div className="doctor-booking__header">
                <h2>{selectedDoctor.name}</h2>
                <p className="doctor-booking__field">{selectedDoctor.field}</p>
                {selectedDoctor.nmcNumber ? (
                  <p className="doctor-booking__nmc">NMC No: {selectedDoctor.nmcNumber}</p>
                ) : null}
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
              <div className="appointment-fee" aria-live="polite">
                Consultation Fee: Rs. {Number(selectedDoctor.consultationFee || 0).toLocaleString()}
              </div>

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
                    className="appointment-select appointment-select--green"
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
                  <span>Blood Group</span>
                  <select
                    className="appointment-select appointment-select--orange"
                    value={bookingForm.bloodGroup}
                    onChange={(event) => updateBookingField("bloodGroup", event.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
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

                <div className="appointment-slot-picker appointment-field--full">
                  <div className="appointment-slot-picker__header">
                    <span>Available Slots*</span>
                    {availabilityMessage ? <small>{availabilityMessage}</small> : null}
                  </div>

                  {availableDates.length > 0 ? (
                    <>
                      <div className="appointment-day-list" role="tablist" aria-label="Available appointment days">
                        {availableDates.map((dateValue) => (
                          <button
                            key={dateValue}
                            type="button"
                            role="tab"
                            aria-selected={bookingForm.date === dateValue}
                            className={bookingForm.date === dateValue ? "active" : ""}
                            onClick={() => updateBookingField("date", dateValue)}
                          >
                            {formatAvailabilityDate(dateValue)}
                          </button>
                        ))}
                      </div>

                      <div className="appointment-time-grid" aria-label="Available appointment times">
                        {slotsForSelectedDate.length > 0 ? (
                          slotsForSelectedDate.map((slot) => {
                            const disabled = !slot.isAvailable || slot.isBooked;
                            const isSelected = bookingForm.time === slot.time && !disabled;

                            return (
                              <button
                                key={slot.key}
                                type="button"
                                className={[
                                  "appointment-time-slot",
                                  isSelected ? "active" : "",
                                  disabled ? "disabled" : ""
                                ].filter(Boolean).join(" ")}
                                disabled={disabled}
                                onClick={() => updateBookingField("time", slot.time)}
                                title={slot.isBooked ? "Already booked" : slot.note || "Available"}
                              >
                                <strong>{formatTimeLabel(slot.time)}</strong>
                                <span>{slot.isBooked ? "Booked" : slot.isAvailable ? "Available" : "Unavailable"}</span>
                              </button>
                            );
                          })
                        ) : (
                          <p className="appointment-slot-picker__empty">No times available for this day.</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="appointment-slot-picker__empty">No available dates have been published by this doctor.</p>
                  )}
                </div>

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
            <div style={{ position: "relative", width: "100%", maxWidth: "600px", margin: "20px 0 30px 0" }}>
              <svg style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#e0f2fe" }} viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="search"
                placeholder="Search by doctor, department, or specialization..."
                value={doctorSearch}
                onChange={(event) => setDoctorSearch(event.target.value)}
                style={{ width: "100%", padding: "16px 20px 16px 55px", borderRadius: "30px", border: "none", background: "#3b82f6", color: "white", outline: "none", fontSize: "16px", fontWeight: "500", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)" }}
              />
              <style>{`
                input[type="search"]::-webkit-search-cancel-button { display: none; }
                input[type="search"]::placeholder { color: #bae6fd; opacity: 1; }
              `}</style>
            </div>
            <div className="glass-backdrop">
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
                      {doctorSearch.trim()
                        ? "No doctors match your search right now."
                        : "No doctors available in this department right now."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )
      ) : showLogin ? (
        <div className="page-panel-shell">
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

      <ConfirmDialog
        isOpen={bookingDialog.isOpen}
        eyebrow="Appointment booking"
        title={bookingDialog.message}
        message={
          bookingDialog.type === "success"
            ? "Your appointment request has been submitted for review."
            : "We could not complete the booking request right now."
        }
        confirmLabel={bookingDialog.type === "success" ? "OK" : "Try Again"}
        cancelLabel=""
        confirmTone={bookingDialog.type === "success" ? "neutral" : "danger"}
        onCancel={() => setBookingDialog((current) => ({ ...current, isOpen: false }))}
        onConfirm={() => setBookingDialog((current) => ({ ...current, isOpen: false }))}
      />
    </section>
  );
};

export default Doctors;
