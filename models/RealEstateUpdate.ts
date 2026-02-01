import mongoose, { Schema, model, models } from "mongoose";

const RealEstateUpdateSchema = new Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    // Location
    location: {
      type: String,
      enum: ["West", "East", "South", "Central", "North"],
      required: true,
    },

    // Update Type/Tag
    tag: {
      type: String,
      enum: ["Launch", "Price Update", "Possession", "Offer", "News", "Other"],
      default: "News",
    },

    // Project Reference (Optional)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    // Media
    imageUrl: String,
    linkUrl: String,

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByName: String,
  },
  { timestamps: true },
);

export const RealEstateUpdate =
  models.RealEstateUpdate || model("RealEstateUpdate", RealEstateUpdateSchema);
