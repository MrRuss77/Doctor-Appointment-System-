import dotenv from "dotenv";
import connectDatabase from "./config/db.js";
import Appointment from "./models/Appointment.js";
import Department from "./models/Department.js";
import Doctor from "./models/Doctor.js";
import Registration from "./models/Registration.js";
import User from "./models/User.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDatabase();

    await Promise.all([
      Appointment.deleteMany({}),
      Registration.deleteMany({}),
      Doctor.deleteMany({}),
      Department.deleteMany({}),
      User.deleteMany({})
    ]);

    const departments = await Department.insertMany([
      {
        name: "Cardiology",
        description: "Heart and blood vessel care"
      },
      {
        name: "Neurology",
        description: "Brain, spine, and nervous system care"
      },
      {
        name: "Pediatrics",
        description: "Healthcare for infants, children, and teenagers"
      }
    ]);

    const users = await User.insertMany([
      {
        firstName: "Prasanna",
        lastName: "Patient",
        email: "prasanna@example.com",
        phone: "9800000001",
        password: "change-this-password",
        role: "patient"
      },
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        phone: "9800000002",
        password: "change-this-password",
        role: "admin"
      }
    ]);

    const doctors = await Doctor.insertMany([
      {
        fullName: "Dr. Arya Dev Rijal",
        email: "arya.rijal@example.com",
        phone: "9801000001",
        department: departments[0]._id,
        specialization: "Interventional Cardiologist",
        qualification: "MBBS, MD, DM Cardiology",
        experienceYears: 10,
        availabilityText: "Available weekdays",
        consultationFee: 1500
      },
      {
        fullName: "Dr. Russ Karki",
        email: "russ.karki@example.com",
        phone: "9801000002",
        department: departments[1]._id,
        specialization: "Clinical Neurologist",
        qualification: "MBBS, MD, Fellowship in Neurology",
        experienceYears: 8,
        availabilityText: "Available Mon-Wed-Fri",
        consultationFee: 1800
      }
    ]);

    await Registration.create({
      user: users[0]._id,
      registrationNumber: "REG-1001",
      status: "active",
      emergencyContactName: "Family Contact",
      emergencyContactPhone: "9802000001"
    });

    await Appointment.create({
      patient: users[0]._id,
      doctor: doctors[0]._id,
      department: departments[0]._id,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: "confirmed",
      reason: "Chest pain consultation"
    });

    console.log("Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
