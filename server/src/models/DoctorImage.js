import mongoose from "mongoose";

const doctorImageSchema = new mongoose.Schema(
  {
    mimeType: {
      type: String,
      required: [true, "Image MIME type is required."],
      trim: true
    },
    fileName: {
      type: String,
      trim: true,
      maxlength: [160, "Image file name cannot be longer than 160 characters."]
    },
    data: {
      type: Buffer,
      required: [true, "Image data is required."]
    },
    size: {
      type: Number,
      required: [true, "Image size is required."],
      min: [1, "Image size must be greater than 0 bytes."]
    }
  },
  {
    timestamps: true
  }
);

const DoctorImage = mongoose.model("DoctorImage", doctorImageSchema);

export default DoctorImage;
