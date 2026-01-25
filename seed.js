const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const MONGODB_URI =
  "mongodb+srv://admin:admin@cluster0.2sucg.mongodb.net/brokerflow_db";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "agent"], default: "agent" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const leadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    status: { type: String, default: "New / Fresh Lead" },
    source: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    createdByName: String,
  },
  { timestamps: true },
);

const expenseSchema = new mongoose.Schema(
  {
    category: String,
    description: String,
    amount: String,
    expenseType: String,
    status: { type: String, default: "Pending" },
    createdBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
const ExpenseEntry =
  mongoose.models.ExpenseEntry || mongoose.model("ExpenseEntry", expenseSchema);

const seed = async () => {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("🧹 Clearing existing data...");
    await User.deleteMany({});
    await Lead.deleteMany({});
    await ExpenseEntry.deleteMany({});

    console.log("👤 Creating Users...");
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash("admin123", salt);
    const agentHash = await bcrypt.hash("agent123", salt);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@brokerflow.com",
      password: adminHash,
      role: "admin",
      isVerified: true,
    });

    const agent = await User.create({
      name: "John Agent",
      email: "agent@brokerflow.com",
      password: agentHash,
      role: "agent",
      isVerified: true,
    });

    console.log("👥 Creating 50 Leads for Pagination Test...");
    const leads = [];
    const statuses = [
      "New / Fresh Lead",
      "Interested / Warm Lead",
      "Contacted",
      "Closed - Won",
      "Closed - Lost",
    ];
    const sources = ["CRM", "Website", "Referral", "HOME_AURA_REALTOR"];

    for (let i = 1; i <= 50; i++) {
      leads.push({
        name: `Lead Candidate ${i}`,
        email: `lead${i}@example.com`,
        phone: `98765${10000 + i}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        createdBy: agent._id,
        createdByName: agent.name,
      });
    }
    await Lead.insertMany(leads);

    console.log("💸 Creating 50 Expenses for Pagination Test...");
    const expenses = [];
    const categories = ["Office", "Travel", "Food", "Salary"];

    for (let i = 1; i <= 50; i++) {
      expenses.push({
        category: categories[Math.floor(Math.random() * categories.length)],
        description: `Expense Item ${i}`,
        amount: (Math.random() * 5000 + 100).toFixed(0),
        expenseType: "Other",
        status: i % 3 === 0 ? "Completed" : "Pending",
        createdBy: admin._id,
      });
    }
    await ExpenseEntry.insertMany(expenses);

    console.log("✅ Seeding Complete with Pagination Data!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
};
seed();
