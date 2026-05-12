const buildFutureDate = (daysAhead) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const buildAvailabilitySlots = (slotDefinitions) =>
  slotDefinitions.map((slot) => ({
    date: buildFutureDate(slot.daysAhead),
    startTime: slot.startTime,
    endTime: slot.endTime,
    isAvailable: slot.isAvailable !== false,
    note: slot.note || ""
  }));

export const departmentCatalog = [
  {
    name: "Anesthesiology",
    description: "Anaesthesia, perioperative care, and critical care support",
    icon: "/components/departments/Anesthiology.png"
  },
  {
    name: "Cardiology",
    description: "Heart and blood vessel care",
    icon: "/components/departments/Cardiology.png"
  },
  {
    name: "Neurology",
    description: "Brain, spine, and nervous system care",
    icon: "/components/departments/Neurology.png"
  },
  {
    name: "Pediatrics",
    description: "Healthcare for infants, children, and teenagers",
    icon: "/components/departments/Pediatrics.png"
  },
  {
    name: "Dentist",
    description: "Dental care, oral surgery, and restorative treatments",
    icon: "/components/departments/dentist.png.png"
  },
  {
    name: "Orthopedics",
    description: "Bone, joint, muscle, and sports injury treatment",
    icon: "/components/departments/Orthopedics.png"
  },
  {
    name: "ENT",
    description: "Ear, nose, throat, and head and neck specialist care",
    icon: "/components/departments/ENT.png"
  },
  {
    name: "Gynecologist",
    description: "Women’s health, obstetrics, and gynecology services",
    icon: "/components/departments/Gynecologist.png"
  },
  {
    name: "Psychiatrist",
    description: "Mental health, emotional wellbeing, and behavioural care",
    icon: "/components/departments/Physiactrist.png"
  }
];

export const platformUserCatalog = [
  {
    firstName: "Prasanna",
    lastName: "Patient",
    email: "prasanna@gmail.com",
    phone: "9800000001",
    password: "prasanna",
    role: "patient"
  },
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@gmail.com",
    phone: "9800000002",
    password: "admin01",
    role: "admin"
  }
];

export const doctorDefaultPassword = "doctor01";

export const doctorCatalog = [
  {
    fullName: "Dr. Aavash Shrestha",
    email: "aavash.shrestha@example.com",
    phone: "9801000001",
    departmentName: "Anesthesiology",
    specialization: "Chief Consultant in Anaesthesia and Critical Care",
    qualification: "MBBS, MD (Anaesthesia), Fellowship in Critical Care",
    experienceYears: 10,
    availabilityText: "Available for consultation today",
    availabilitySlots: buildAvailabilitySlots([
      { daysAhead: 1, startTime: "09:00", endTime: "12:00" },
      { daysAhead: 3, startTime: "13:00", endTime: "16:00" }
    ]),
    consultationFee: 1500,
    image: "/img/Screenshot 2026-05-06 013524.png"
  },
  {
    fullName: "Dr. Kiran Thapa",
    email: "kiran.thapa@example.com",
    phone: "9801000002",
    departmentName: "Cardiology",
    specialization: "Interventional Cardiologist and Heart Specialist",
    qualification: "MBBS, MD (Internal Medicine), DM Cardiology",
    experienceYears: 8,
    availabilityText: "Next slot: 4:30 PM",
    availabilitySlots: buildAvailabilitySlots([
      { daysAhead: 1, startTime: "14:00", endTime: "17:00" },
      { daysAhead: 4, startTime: "10:00", endTime: "13:00" }
    ]),
    consultationFee: 1800,
    image: "/img/Screenshot 2026-05-06 013553.png"
  },
  {
    fullName: "Dr. Suman Adhikari",
    email: "suman.adhikari@example.com",
    phone: "9801000003",
    departmentName: "Neurology",
    specialization: "Senior Consultant in Brain and Nerve Disorders",
    qualification: "MBBS, MD, Fellowship in Clinical Neurology",
    experienceYears: 27,
    availabilityText: "Available tomorrow morning",
    availabilitySlots: buildAvailabilitySlots([
      { daysAhead: 2, startTime: "09:00", endTime: "11:30" },
      { daysAhead: 5, startTime: "15:00", endTime: "17:00" }
    ]),
    consultationFee: 1800,
    image: "/img/Screenshot 2026-04-29 230035.png"
  },
  {
    fullName: "Dr. Neha Pradhan",
    email: "neha.pradhan@example.com",
    phone: "9801000004",
    departmentName: "Pediatrics",
    specialization: "Child Health Specialist and Neonatal Care Expert",
    qualification: "MBBS, MD Pediatrics, NICU Certification",
    experienceYears: 11,
    availabilityText: "Accepting new patients",
    availabilitySlots: buildAvailabilitySlots([
      { daysAhead: 1, startTime: "08:30", endTime: "11:00" },
      { daysAhead: 3, startTime: "12:30", endTime: "15:00" }
    ]),
    consultationFee: 1400,
    image: "/img/Screenshot 2026-04-29 230142.png"
  },
  {
    fullName: "Dr. Puja Maharjan",
    email: "puja.maharjan@example.com",
    phone: "9801000005",
    departmentName: "Dentist",
    specialization: "Chief Consultant Surgeon for planned and urgent procedures",
    qualification: "BDS, MDS, Fellowship in Restorative Dentistry",
    experienceYears: 9,
    availabilityText: "Available for booking today",
    availabilitySlots: buildAvailabilitySlots([
      { daysAhead: 2, startTime: "10:00", endTime: "13:00" },
      { daysAhead: 6, startTime: "09:30", endTime: "12:00" }
    ]),
    consultationFee: 1300,
    image: "/img/Screenshot 2026-04-29 230232.png"
  },
  {
    fullName: "Dr. Rajesh Sharma",
    email: "rajesh.sharma@example.com",
    phone: "9801000006",
    departmentName: "Orthopedics",
    specialization: "Bone, joint, and musculoskeletal treatment specialist",
    qualification: "MBBS, MS Orthopedics, Fellowship in Sports Injury Care",
    experienceYears: 13,
    availabilityText: "Next slot: 1:15 PM",
    availabilitySlots: buildAvailabilitySlots([
      { daysAhead: 1, startTime: "13:00", endTime: "15:30" },
      { daysAhead: 4, startTime: "09:00", endTime: "11:00" }
    ]),
    consultationFee: 1700,
    image: "/img/Screenshot 2026-04-29 230051.png"
  },
  {
    fullName: "Dr. Bishal Gurung",
    email: "bishal.gurung@example.com",
    phone: "9801000007",
    departmentName: "ENT",
    specialization: "Ear, Nose, Throat and Head & Neck Surgery Specialist",
    qualification: "MBBS, MS ENT",
    experienceYears: 12,
    availabilityText: "Available this evening",
    availabilitySlots: buildAvailabilitySlots([
      { daysAhead: 2, startTime: "16:00", endTime: "18:00" },
      { daysAhead: 5, startTime: "11:00", endTime: "13:00" }
    ]),
    consultationFee: 1600,
    image: "/img/Screenshot 2026-04-29 230104.png"
  },
  {
    fullName: "Dr. Nischal Joshi",
    email: "nischal.joshi@example.com",
    phone: "9801000008",
    departmentName: "Gynecologist",
    specialization: "Senior Consultant Gynecologist and Obstetrician",
    qualification: "MBBS, MD Obstetrics & Gynecology",
    experienceYears: 14,
    availabilityText: "Consultation support all day",
    availabilitySlots: buildAvailabilitySlots([
      { daysAhead: 3, startTime: "09:00", endTime: "12:30" },
      { daysAhead: 6, startTime: "14:00", endTime: "17:00" }
    ]),
    consultationFee: 1750,
    image: "/img/Screenshot 2026-04-29 230248.png"
  },
  {
    fullName: "Dr. Anil Bista",
    email: "anil.bista@example.com",
    phone: "9801000009",
    departmentName: "Psychiatrist",
    specialization: "Mental Health and Behavioral Sciences Expert",
    qualification: "MBBS, MD Psychiatry",
    experienceYears: 10,
    availabilityText: "Available tomorrow morning",
    availabilitySlots: buildAvailabilitySlots([
      { daysAhead: 2, startTime: "10:00", endTime: "12:00" },
      { daysAhead: 7, startTime: "15:00", endTime: "17:30" }
    ]),
    consultationFee: 1550,
    image: "/img/Screenshot 2026-04-29 230035.png"
  }
];
