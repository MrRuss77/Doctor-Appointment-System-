import dotenv from "dotenv";
import connectDatabase from "./config/db.js";
import Appointment from "./models/Appointment.js";
import { departmentCatalog, doctorCatalog } from "./data/catalog.js";
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

    const departments = await Department.insertMany(departmentCatalog);

    const departmentMap = Object.fromEntries(
      departments.map((department) => [department.name, department._id])
    );

    const users = await User.insertMany([
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
        password: "admin",
        role: "admin"
      }
    ]);

    const doctors = await Doctor.insertMany(
      doctorCatalog.map(({ departmentName, ...doctor }) => ({
        ...doctor,
        department: departmentMap[departmentName]
      }))
    );

    await Registration.create({
      user: users[0]._id,
      registrationNumber: "REG-1001",
      status: "active",
      emergencyContactName: "Family Contact",
      emergencyContactPhone: "9802000001"
    });

    await Appointment.create({
      patient: users[0]._id,
      doctor: doctors[1]._id,
      department: departmentMap.Cardiology,
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
