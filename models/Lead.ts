import mongoose, { Schema, model, models } from 'mongoose';
const LeadSchema = new Schema({
    name: String, email: String, phone: String, secondaryPhone: String,
    source: { type: String, enum: ["CRM", "HOME_AURA_REALTOR", "Website", "Referral", "Other"], default: "CRM" },
    mailStatus: { type: String, enum: ["success", "failed"], default: "success" },
    message: String, project: String,
    status: { type: String, default: "New / Fresh Lead" },
    notes: String, visitDate: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByName: String,
  }, { timestamps: true });
export const Lead = models.Lead || model('Lead', LeadSchema);