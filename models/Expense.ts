import mongoose, { Schema, model, models } from 'mongoose';
const ExpenseEntrySchema = new Schema({
    category: String, description: String, amount: String, date: Date,
    paymentMode: { type: String, default: "Other" },
    paymentMadeBy: { type: String, default: "Other" },
    expenseType: { type: String, default: "Other" },
    notes: String, status: { type: String, default: "Pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }, { timestamps: true });
export const ExpenseEntry = models.ExpenseEntry || model('ExpenseEntry', ExpenseEntrySchema);