import mongoose, { Schema, model, models } from "mongoose";
const LeadSchema = new Schema(
  {
    // 🔹 Basic Info
    name: String,
    email: String,
    phone: String,
    secondaryPhone: String,

    // 🔹 Source
    source: {
      type: String,
      enum: ["CRM", "FACEBOOK", "INSTAGRAM", "WHATSAPP", "OTHER"],
      default: "CRM",
    },

    // 🔹 Mail Status
    mailStatus: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },

    // 🔹 Message
    // message: String,

    // 🔹 Project / Builder Reference (Optional)
    project: String,

    // 🔹 Lead Status
    status: {
      type: String,
      enum: [
        "New / Fresh Lead",
        "Contacted / Attempted to Contact",
        "Interested / Warm Lead",
        "Not Interested",
        "No Response",
        "Follow-Up Scheduled",
        "Site Visit Scheduled",
        "Booking in Progress",
        "Deal Success",
        "Deal Lost",
        "Other",
      ],
      default: "New / Fresh Lead",
      index: true,
    },

    // 🔹 Customer Requirement (NEW)
    requirement: {
      budget: String,

      propertyType: {
        type: String,
        enum: ["1BHK", "2BHK", "3BHK", "4BHK", "Villa", "Plot", "Commercial"],
      },

      preferredLocation: String,

      readiness: {
        type: String,
        enum: ["Hot Interest", "Warm Interest", "Cold Interest"],
        default: "Warm Interest",
        index: true,
      },
    },

    // 🔹 Notes & Follow-up
    notes: String,
    visitDate: Date,
    isDeleted: { type: Boolean, default: false, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByName: String,
  },
  { timestamps: true },
);
export const Lead = models.Lead || model("Lead", LeadSchema);
