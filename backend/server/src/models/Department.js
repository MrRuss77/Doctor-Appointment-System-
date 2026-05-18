import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Department name must be at least 3 characters long."]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, "Department description cannot be longer than 250 characters."]
    },
    icon: {
      type: String,
      trim: true,
      maxlength: [300, "Department icon path cannot be longer than 300 characters."]
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
