import mongoose, { Schema, model, models } from 'mongoose';
const TokenSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  type: { type: String, enum: ['access', 'refresh'], default: 'access' },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });
export const Token = models.Token || model('Token', TokenSchema);