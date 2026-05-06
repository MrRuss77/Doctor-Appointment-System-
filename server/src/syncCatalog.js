import dotenv from "dotenv";
import connectDatabase from "./config/db.js";
import { departmentCatalog, doctorCatalog } from "./data/catalog.js";
import Department from "./models/Department.js";
import Doctor from "./models/Doctor.js";

dotenv.config();

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

    for (const { departmentName, ...doctor } of doctorCatalog) {
      await Doctor.findOneAndUpdate(
        { fullName: doctor.fullName },
        {
          $set: {
            ...doctor,
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
      `Catalog synced successfully. Departments: ${departmentCatalog.length}, Doctors: ${doctorCatalog.length}`
    );
    process.exit(0);
  } catch (error) {
    console.error("Catalog sync failed:", error.message);
    process.exit(1);
  }
};

syncCatalog();
