import mongoose from "mongoose";

const departmentIconSchema = new mongoose.Schema(
  {
    mimeType: {
      type: String,
      required: [true, "Icon MIME type is required."],
      trim: true,
      enum: ["image/png"]
    },
    fileName: {
      type: String,
      trim: true,
      maxlength: [160, "Icon file name cannot be longer than 160 characters."]
    },
    data: {
      type: Buffer,
      required: [true, "Icon data is required."]
    },
    size: {
      type: Number,
      required: [true, "Icon size is required."],
      min: [1, "Icon size must be greater than 0 bytes."]
    }
  },
  {
    timestamps: true
  }
);

const DepartmentIcon = mongoose.model("DepartmentIcon", departmentIconSchema);

export default DepartmentIcon;
