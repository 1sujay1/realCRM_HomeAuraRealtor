import mongoose from "mongoose";

const ExpenseEntrySchema = new mongoose.Schema(
  {
    category: String,
    description: String,
    amount: String,
    date: { type: Date },
    paymentMode: {
      type: String,
      enum: ["Bank", "Cash", "Credit Card", "Debit Card", "UPI", "Other"],
      default: "Other",
    },
    paymentMadeBy: {
      type: String,
      enum: ["Mangal", "Raja Pandian", "Ajit", "Other"],
      default: "Other",
    },
    expenseType: {
      type: String,
      enum: ["Rent", "Travel", "Food", "Salary", "Ads", "Other"],
      default: "Other",
    },
    notes: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export const ExpenseEntry =
  mongoose.models.ExpenseEntry ||
  mongoose.model("ExpenseEntry", ExpenseEntrySchema);
