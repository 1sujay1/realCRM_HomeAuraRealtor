import mongoose, { Schema, model, models } from "mongoose";

const LeadActivitySchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const LeadActivity =
  models.LeadActivity || model("LeadActivity", LeadActivitySchema);
