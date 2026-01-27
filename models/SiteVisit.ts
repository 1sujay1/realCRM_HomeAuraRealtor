import mongoose, { Schema, model, models } from "mongoose";

const SiteVisitSchema = new Schema(
  {
    // 🔹 Lead Reference
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },

    // 🔹 Visit Details
    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    // 🔹 Additional Info
    notes: String,
    Agent: String,

    // 🔹 Visit Status
    status: {
      type: String,
      enum: ["Scheduled", "DONE", "Cancelled"],
      default: "Scheduled",
      index: true,
    },

    // 🔹 Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdByName: String,
  },
  { timestamps: true },
);

export const SiteVisit =
  models.SiteVisit || model("SiteVisit", SiteVisitSchema);
