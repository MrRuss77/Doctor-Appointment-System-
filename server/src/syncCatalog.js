import connectDatabase from "./config/db.js";
import { loadEnv } from "./config/env.js";
import {
  departmentCatalog,
  doctorCatalog,
  doctorDefaultPassword,
  platformUserCatalog
} from "./data/catalog.js";
import Department from "./models/Department.js";
import Doctor from "./models/Doctor.js";
import User from "./models/User.js";

const upsertUserAccount = async ({ email, password, ...profile }) => {
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return User.create({
      email,
      password,
      ...profile
    });
  }

  existingUser.firstName = profile.firstName;
  existingUser.lastName = profile.lastName;
  existingUser.phone = profile.phone;
  existingUser.role = profile.role;
  if (password) {
    existingUser.password = password;
  }
  await existingUser.save();
  return existingUser;
};

loadEnv();

const syncCatalog = async () => {
  try {
    await connectDatabase();

    const departmentMap = {};

    for (const department of departmentCatalog) {
      const savedDepartment = await Department.findOneAndUpdate(
        { name: department.name },
        {
          $set: {
            description: department.description,
            icon: department.icon,
            isActive: true
          }
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );

      departmentMap[department.name] = savedDepartment._id;
    }

    const doctorUserMap = new Map();

    for (const user of platformUserCatalog) {
      await upsertUserAccount(user);
    }

    for (const doctor of doctorCatalog) {
      const parts = doctor.fullName.replace(/^Dr\.\s*/i, "").trim().split(/\s+/);
      const firstName = parts[0] || "Doctor";
      const lastName = parts.slice(1).join(" ") || "User";

      const user = await upsertUserAccount({
        firstName,
        lastName,
        email: doctor.email,
        phone: doctor.phone,
        password: doctorDefaultPassword,
        role: "doctor"
      });

      doctorUserMap.set(doctor.email, user._id);
    }

    for (const { departmentName, ...doctor } of doctorCatalog) {
      await Doctor.findOneAndUpdate(
        { fullName: doctor.fullName },
        {
          $set: {
            ...doctor,
            user: doctorUserMap.get(doctor.email),
            department: departmentMap[departmentName],
            isActive: true
          }
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );
    }

    console.log(
      `Catalog synced successfully. Departments: ${departmentCatalog.length}, Doctors: ${doctorCatalog.length}, User accounts synced.`
    );
    process.exit(0);
  } catch (error) {
    console.error("Catalog sync failed:", error.message);
    process.exit(1);
  }
};

syncCatalog();
