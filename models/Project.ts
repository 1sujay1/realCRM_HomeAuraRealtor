import mongoose, { Document, Schema, model, models } from "mongoose";

export type ProjectType = "Apartment" | "Villa" | "Plot";
export type ProjectStatus =
  | "Pre-Launch"
  | "New Launch"
  | "Under Construction"
  | "Ready To Move";

export interface IProject extends Document {
  // Basic Info
  name: string;
  builder: string;
  projectType: ProjectType;

  // Location
  propertyCity: string;
  locality?: string;
  address?: string;
  pincode?: string;

  // Project Details
  configuration?: string;
  startingPrice?: string;
  offerPrice?: string;

  // Status
  status: ProjectStatus;

  // Legal
  reraNumber?: string;

  // Media & Links
  thumbnail?: string;
  propertyImages: string[];
  brochureUrl?: string;
  googleMapLink?: string;

  // Amenities
  amenities: string[];

  // Metadata
  isDeleted: boolean;
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    builder: {
      type: String,
      required: true,
    },

    projectType: {
      type: String,
      enum: ["Apartment", "Villa", "Plot"],
      default: "Apartment",
    },

    // Location
    propertyCity: {
      type: String,
      required: true,
      index: true,
    },

    locality: {
      type: String,
      index: true,
    },

    address: {
      type: String,
    },

    pincode: {
      type: String,
      index: true,
    },

    // Project Details
    configuration: {
      type: String, // 2BHK, 3BHK
    },

    startingPrice: {
      type: String,
      // set: (v: any) => (v != null ? String(v) : v),
    },
    offerPrice: {
      type: String,
      // set: (v: any) => (v != null ? String(v) : v),
    },

    // Status
    status: {
      type: String,
      enum: ["Pre-Launch", "New Launch", "Under Construction", "Ready To Move"],
      default: "New Launch",
    },

    // Legal
    reraNumber: {
      type: String,
    },

    // Media & Links
    thumbnail: {
      type: String,
    },

    propertyImages: [
      {
        type: String, // image URLs
      },
    ],

    brochureUrl: {
      type: String,
    },

    googleMapLink: {
      type: String,
    },

    // Amenities
    amenities: [
      {
        type: String, // Gym, Pool, Club House
      },
    ],

    // Soft delete & visibility
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

// Create a text index for search
ProjectSchema.index(
  {
    name: "text",
    builder: "text",
    propertyCity: "text",
    locality: "text",
    address: "text",
  },
  {
    weights: {
      name: 3,
      builder: 2,
      propertyCity: 2,
      locality: 1,
      address: 1,
    },
  },
);

// Create the model or return the existing one
export default models?.Project || model<IProject>("Project", ProjectSchema);
