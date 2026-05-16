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
    "fullName": "Dr. Aavash Shrestha",
    "email": "aavash.shrestha@example.com",
    "phone": "9801000001",
    "departmentName": "Anesthesiology",
    "specialization": "Chief Consultant in Anaesthesia and Critical Care",
    "qualification": "MBBS, MD (Anaesthesia), Fellowship in Critical Care",
    "experienceYears": 10,
    "availabilityText": "Available for consultation today",
    "consultationFee": 1500,
    "image": "/img/Screenshot 2026-05-16 130624.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Pratiksha Rana",
    "email": "pratiksha.rana@example.com",
    "phone": "9801000010",
    "departmentName": "Anesthesiology",
    "specialization": "Pain Management Specialist",
    "qualification": "MBBS, MD (Anaesthesia)",
    "experienceYears": 6,
    "availabilityText": "Next slot: 10:00 AM",
    "consultationFee": 1200,
    "image": "/img/Screenshot 2026-05-16 130637.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Sandeep Basnet",
    "email": "sandeep.basnet@example.com",
    "phone": "9801000011",
    "departmentName": "Anesthesiology",
    "specialization": "Pediatric Anesthesiologist",
    "qualification": "MBBS, MD (Anaesthesia)",
    "experienceYears": 8,
    "availabilityText": "Available tomorrow",
    "consultationFee": 1300,
    "image": "/img/Screenshot 2026-05-16 130658.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Puja Maharjan",
    "email": "puja.maharjan@example.com",
    "phone": "9801000005",
    "departmentName": "Dentist",
    "specialization": "Chief Consultant Surgeon for planned and urgent procedures",
    "qualification": "BDS, MDS, Fellowship in Restorative Dentistry",
    "experienceYears": 9,
    "availabilityText": "Available for booking today",
    "consultationFee": 1300,
    "image": "/img/Screenshot 2026-05-16 130715.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Suman Karki",
    "email": "suman.karki@example.com",
    "phone": "9801000012",
    "departmentName": "Dentist",
    "specialization": "Orthodontist",
    "qualification": "BDS, MDS (Orthodontics)",
    "experienceYears": 7,
    "availabilityText": "Next slot: 2:00 PM",
    "consultationFee": 1100,
    "image": "/img/Screenshot 2026-05-16 130726.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Anisha Shrestha",
    "email": "anisha.shrestha@example.com",
    "phone": "9801000013",
    "departmentName": "Dentist",
    "specialization": "Pediatric Dentist",
    "qualification": "BDS, MDS (Pediatric Dentistry)",
    "experienceYears": 5,
    "availabilityText": "Available Thursday",
    "consultationFee": 1000,
    "image": "/img/Screenshot 2026-05-16 130749.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Anil Bista",
    "email": "anil.bista@example.com",
    "phone": "9801000009",
    "departmentName": "Psychiatrist",
    "specialization": "Mental Health and Behavioral Sciences Expert",
    "qualification": "MBBS, MD Psychiatry",
    "experienceYears": 10,
    "availabilityText": "Available tomorrow morning",
    "consultationFee": 1550,
    "image": "/img/Screenshot 2026-05-16 130756.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Manisha Koirala",
    "email": "manisha.koirala@example.com",
    "phone": "9801000014",
    "departmentName": "Psychiatrist",
    "specialization": "Child and Adolescent Psychiatrist",
    "qualification": "MBBS, MD Psychiatry",
    "experienceYears": 8,
    "availabilityText": "Next slot: 1:30 PM",
    "consultationFee": 1400,
    "image": "/img/Screenshot 2026-05-16 130805.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Bikash Thapa",
    "email": "bikash.thapa@example.com",
    "phone": "9801000015",
    "departmentName": "Psychiatrist",
    "specialization": "Addiction Psychiatrist",
    "qualification": "MBBS, MD Psychiatry",
    "experienceYears": 12,
    "availabilityText": "Available next week",
    "consultationFee": 1600,
    "image": "/img/Screenshot 2026-05-16 130812.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Nischal Joshi",
    "email": "nischal.joshi@example.com",
    "phone": "9801000008",
    "departmentName": "Gynecologist",
    "specialization": "Senior Consultant Gynecologist and Obstetrician",
    "qualification": "MBBS, MD Obstetrics & Gynecology",
    "experienceYears": 14,
    "availabilityText": "Consultation support all day",
    "consultationFee": 1750,
    "image": "/img/Screenshot 2026-05-16 130827.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Sunita Sharma",
    "email": "sunita.sharma@example.com",
    "phone": "9801000016",
    "departmentName": "Gynecologist",
    "specialization": "Reproductive Endocrinologist",
    "qualification": "MBBS, MD Obstetrics & Gynecology",
    "experienceYears": 9,
    "availabilityText": "Next slot: 11:15 AM",
    "consultationFee": 1500,
    "image": "/img/Screenshot 2026-05-16 130857.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Roshni Rai",
    "email": "roshni.rai@example.com",
    "phone": "9801000017",
    "departmentName": "Gynecologist",
    "specialization": "Maternal-Fetal Medicine Specialist",
    "qualification": "MBBS, MD Obstetrics & Gynecology",
    "experienceYears": 11,
    "availabilityText": "Available Wednesday",
    "consultationFee": 1600,
    "image": "/img/Screenshot 2026-05-16 130930.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Kiran Thapa",
    "email": "kiran.thapa@example.com",
    "phone": "9801000002",
    "departmentName": "Cardiology",
    "specialization": "Interventional Cardiologist and Heart Specialist",
    "qualification": "MBBS, MD (Internal Medicine), DM Cardiology",
    "experienceYears": 8,
    "availabilityText": "Next slot: 4:30 PM",
    "consultationFee": 1800,
    "image": "/img/Screenshot 2026-05-16 130943.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Ramesh Pandey",
    "email": "ramesh.pandey@example.com",
    "phone": "9801000018",
    "departmentName": "Cardiology",
    "specialization": "Electrophysiologist",
    "qualification": "MBBS, MD, DM Cardiology",
    "experienceYears": 12,
    "availabilityText": "Next slot: 9:00 AM",
    "consultationFee": 1900,
    "image": "/img/Screenshot 2026-05-16 130949.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Anjali Gurung",
    "email": "anjali.gurung@example.com",
    "phone": "9801000019",
    "departmentName": "Cardiology",
    "specialization": "Non-Invasive Cardiologist",
    "qualification": "MBBS, MD, Fellowship in Cardiology",
    "experienceYears": 7,
    "availabilityText": "Available tomorrow",
    "consultationFee": 1500,
    "image": "/img/Screenshot 2026-05-16 131723.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Suman Adhikari",
    "email": "suman.adhikari@example.com",
    "phone": "9801000003",
    "departmentName": "Neurology",
    "specialization": "Senior Consultant in Brain and Nerve Disorders",
    "qualification": "MBBS, MD, Fellowship in Clinical Neurology",
    "experienceYears": 27,
    "availabilityText": "Available tomorrow morning",
    "consultationFee": 1800,
    "image": "/img/Screenshot 2026-05-16 131729.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Nirmala Adhikari",
    "email": "nirmala.adhikari@example.com",
    "phone": "9801000020",
    "departmentName": "Neurology",
    "specialization": "Epilepsy Specialist",
    "qualification": "MBBS, MD, DM Neurology",
    "experienceYears": 15,
    "availabilityText": "Available Friday",
    "consultationFee": 1700,
    "image": "/img/Screenshot 2026-05-16 131742.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Susan Maharjan",
    "email": "susan.maharjan@example.com",
    "phone": "9801000021",
    "departmentName": "Neurology",
    "specialization": "Stroke Specialist",
    "qualification": "MBBS, MD, Fellowship in Stroke",
    "experienceYears": 10,
    "availabilityText": "Next slot: 3:00 PM",
    "consultationFee": 1600,
    "image": "/img/Screenshot 2026-05-16 131759.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Neha Pradhan",
    "email": "neha.pradhan@example.com",
    "phone": "9801000004",
    "departmentName": "Pediatrics",
    "specialization": "Child Health Specialist and Neonatal Care Expert",
    "qualification": "MBBS, MD Pediatrics, NICU Certification",
    "experienceYears": 11,
    "availabilityText": "Accepting new patients",
    "consultationFee": 1400,
    "image": "/img/Screenshot 2026-05-16 131810.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Bimal Shrestha",
    "email": "bimal.shrestha@example.com",
    "phone": "9801000022",
    "departmentName": "Pediatrics",
    "specialization": "Pediatric Pulmonologist",
    "qualification": "MBBS, MD Pediatrics",
    "experienceYears": 9,
    "availabilityText": "Next slot: 12:00 PM",
    "consultationFee": 1300,
    "image": "/img/Screenshot 2026-05-16 131817.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Karuna Thapa",
    "email": "karuna.thapa@example.com",
    "phone": "9801000023",
    "departmentName": "Pediatrics",
    "specialization": "Pediatric Cardiologist",
    "qualification": "MBBS, MD Pediatrics, Fellowship in Cardiology",
    "experienceYears": 8,
    "availabilityText": "Available Saturday",
    "consultationFee": 1500,
    "image": "/img/Screenshot 2026-05-16 131850.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Rajesh Sharma",
    "email": "rajesh.sharma@example.com",
    "phone": "9801000006",
    "departmentName": "Orthopedics",
    "specialization": "Bone, joint, and musculoskeletal treatment specialist",
    "qualification": "MBBS, MS Orthopedics, Fellowship in Sports Injury Care",
    "experienceYears": 13,
    "availabilityText": "Next slot: 1:15 PM",
    "consultationFee": 1700,
    "image": "/img/Screenshot 2026-05-16 131900.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Dinesh Karki",
    "email": "dinesh.karki@example.com",
    "phone": "9801000024",
    "departmentName": "Orthopedics",
    "specialization": "Joint Replacement Surgeon",
    "qualification": "MBBS, MS Orthopedics",
    "experienceYears": 16,
    "availabilityText": "Available tomorrow",
    "consultationFee": 1800,
    "image": "/img/Screenshot 2026-05-16 131915.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Smriti Joshi",
    "email": "smriti.joshi@example.com",
    "phone": "9801000025",
    "departmentName": "Orthopedics",
    "specialization": "Pediatric Orthopedist",
    "qualification": "MBBS, MS Orthopedics",
    "experienceYears": 7,
    "availabilityText": "Next slot: 10:45 AM",
    "consultationFee": 1400,
    "image": "/img/Screenshot 2026-05-16 131941.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Bishal Gurung",
    "email": "bishal.gurung@example.com",
    "phone": "9801000007",
    "departmentName": "ENT",
    "specialization": "Ear, Nose, Throat and Head & Neck Surgery Specialist",
    "qualification": "MBBS, MS ENT",
    "experienceYears": 12,
    "availabilityText": "Available this evening",
    "consultationFee": 1600,
    "image": "/img/Screenshot 2026-05-16 131956.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Asmita Rai",
    "email": "asmita.rai@example.com",
    "phone": "9801000026",
    "departmentName": "ENT",
    "specialization": "Rhinology Specialist",
    "qualification": "MBBS, MS ENT",
    "experienceYears": 8,
    "availabilityText": "Next slot: 2:30 PM",
    "consultationFee": 1300,
    "image": "/img/Screenshot 2026-05-16 132006.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  },
  {
    "fullName": "Dr. Suman Poudel",
    "email": "suman.poudel@example.com",
    "phone": "9801000027",
    "departmentName": "ENT",
    "specialization": "Otology Specialist",
    "qualification": "MBBS, MS ENT",
    "experienceYears": 10,
    "availabilityText": "Available Monday",
    "consultationFee": 1400,
    "image": "/img/Screenshot 2026-05-16 132019.png",
    "availabilitySlots": buildAvailabilitySlots([{ daysAhead: 1, startTime: "09:00", endTime: "12:00" }, { daysAhead: 2, startTime: "13:00", endTime: "16:00" }])
  }
];
