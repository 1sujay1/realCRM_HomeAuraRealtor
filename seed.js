// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const MONGODB_URI =
//   "mongodb+srv://admin:admin@cluster0.2sucg.mongodb.net/brokerflow_db";

// const userSchema = new mongoose.Schema(
//   {
//     name: String,
//     email: { type: String, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["admin", "agent"], default: "agent" },
//     isVerified: { type: Boolean, default: false },
//   },
//   { timestamps: true },
// );

// const leadSchema = new mongoose.Schema(
//   {
//     name: String,
//     email: String,
//     phone: String,
//     status: { type: String, default: "New / Fresh Lead" },
//     source: String,
//     createdBy: mongoose.Schema.Types.ObjectId,
//     createdByName: String,
//   },
//   { timestamps: true },
// );

// const expenseSchema = new mongoose.Schema(
//   {
//     category: String,
//     description: String,
//     amount: String,
//     expenseType: String,
//     status: { type: String, default: "Pending" },
//     createdBy: mongoose.Schema.Types.ObjectId,
//   },
//   { timestamps: true },
// );
// const SiteVisitSchema = new mongoose.Schema(
//   {
//     // 🔹 Lead Reference
//     lead: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Lead",
//       required: true,
//       index: true,
//     },

//     // 🔹 Visit Details
//     date: {
//       type: Date,
//       required: true,
//     },

//     time: {
//       type: String,
//       required: true,
//     },

//     location: {
//       type: String,
//       required: true,
//     },

//     // 🔹 Additional Info
//     notes: String,
//     Agent: String,

//     // 🔹 Visit Status
//     status: {
//       type: String,
//       enum: ["Scheduled", "DONE", "Cancelled"],
//       default: "Scheduled",
//       index: true,
//     },

//     // 🔹 Metadata
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     createdByName: String,
//   },
//   { timestamps: true },
// )
// const projectSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     builder: { type: String, required: true },
//     projectType: { 
//       type: String, 
//       enum: ["Apartment", "Villa", "Plot"],
//       default: "Apartment"
//     },
//     status: {
//       type: String,
//       enum: ["Pre-Launch", "New Launch", "Under Construction", "Ready To Move"],
//       default: "New Launch"
//     },
//     propertyCity: { type: String, required: true, index: true },
//     locality: { type: String, index: true },
//     address: String,
//     pincode: { type: String, index: true },
//     configuration: String,
//     startingPrice: Number,
//     reraNumber: String,
//     thumbnail: String,
//     propertyImages: [String],
//     brochureUrl: String,
//     googleMapLink: String,
//     amenities: [String],
//     isDeleted: { type: Boolean, default: false, index: true },
//     isActive: { type: Boolean, default: true },
//     createdBy: mongoose.Schema.Types.ObjectId,
//     createdByName: String,
//     updatedBy: mongoose.Schema.Types.ObjectId,
//     updatedByName: String,
//     deletedBy: mongoose.Schema.Types.ObjectId,
//     deletedByName: String
//   },
//   { timestamps: true }
// );
// // Create text index for search
// projectSchema.index({
//   name: 'text',
//   builder: 'text',
//   propertyCity: 'text',
//   locality: 'text',
//   address: 'text'
// }, {
//   weights: {
//     name: 3,
//     builder: 2,
//     propertyCity: 2,
//     locality: 1,
//     address: 1
//   }
// });

// const User = mongoose.models.User || mongoose.model("User", userSchema);
// const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
// const ExpenseEntry =
//   mongoose.models.ExpenseEntry || mongoose.model("ExpenseEntry", expenseSchema);
// const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
// const SiteVisit = mongoose.models.SiteVisit || mongoose.model('SiteVisit', SiteVisitSchema);


// const seed = async () => {
//   try {
//     console.log("🌱 Connecting to MongoDB...");
//     await mongoose.connect(MONGODB_URI);
//     console.log("🧹 Clearing existing data...");
//     await User.deleteMany({});
//     await Lead.deleteMany({});
//     await ExpenseEntry.deleteMany({});

//     console.log("👤 Creating Users...");
//     const salt = await bcrypt.genSalt(10);
//     const adminHash = await bcrypt.hash("admin123", salt);
//     const agentHash = await bcrypt.hash("agent123", salt);

//     const admin = await User.create({
//       name: "Super Admin",
//       email: "admin@brokerflow.com",
//       password: adminHash,
//       role: "admin",
//       isVerified: true,
//     });

//     const agent = await User.create({
//       name: "John Agent",
//       email: "agent@brokerflow.com",
//       password: agentHash,
//       role: "agent",
//       isVerified: true,
//     });

//     console.log("👥 Creating 50 Leads for Pagination Test...");
// const leads = [];
// const statuses = [
//   "New / Fresh Lead",
//   "Contacted / Attempted to Contact",
//   "Interested / Warm Lead",
//   "Not Interested",
//   "No Response",
//   "Follow-Up Scheduled",
//   "Site Visit Scheduled",
//   "Booking in Progress",
//   "Deal Success",
//   "Deal Lost",
//   "Other"
// ];
// const sources = ["CRM", "FACEBOOK", "INSTAGRAM", "WHATSAPP", "OTHER"];
// const propertyTypes = ["1BHK", "2BHK", "3BHK", "4BHK", "Villa", "Plot", "Commercial"];
// const readinessLevels = ["Hot Interest", "Warm Interest", "Cold Interest"];
// const budgets = ["< 50L", "50L - 1Cr", "1Cr - 2Cr", "2Cr+"];

// // Get project IDs for reference
// // const projects = await Project.find({}, '_id name');

// for (let i = 1; i <= 50; i++) {
//   // const randomProject = projects[Math.floor(Math.random() * projects.length)];
//   const status = statuses[Math.floor(Math.random() * statuses.length)];
  
//   leads.push({
//     name: `Lead ${i}`,
//     email: `lead${i}@example.com`,
//     phone: `98765${10000 + i}`,
//     secondaryPhone: Math.random() > 0.5 ? `98765${20000 + i}` : undefined,
//     source: sources[Math.floor(Math.random() * sources.length)],
//     mailStatus: Math.random() > 0.2 ? "success" : "failed",
//     message: `Interested a property`,
//     project: "SATTVA",
//     status: status,
//     requirement: {
//       budget: budgets[Math.floor(Math.random() * budgets.length)],
//       propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
//       preferredLocation: ["Whitefield", "Sarjapur", "Electronic City", "Marathahalli"][Math.floor(Math.random() * 4)],
//       readiness: readinessLevels[Math.floor(Math.random() * readinessLevels.length)]
//     },
//     notes: status === "Site Visit Scheduled" ? 
//       `Scheduled for visit on ${new Date(Date.now() + 86400000 * (i % 7)).toLocaleDateString()}` : 
//       `Last contact: ${new Date().toLocaleDateString()}`,
//     visitDate: status === "Site Visit Scheduled" ? 
//       new Date(Date.now() + 86400000 * (i % 7)) : 
//       undefined,
//     createdBy: admin._id,
//     createdByName: admin.name
//   });
// }
// await Lead.insertMany(leads);

//     console.log("💸 Creating 50 Expenses for Pagination Test...");
//     const expenses = [];
//     const categories = ["Office", "Travel", "Food", "Salary"];

//     for (let i = 1; i <= 50; i++) {
//       expenses.push({
//         category: categories[Math.floor(Math.random() * categories.length)],
//         description: `Expense Item ${i}`,
//         amount: (Math.random() * 5000 + 100).toFixed(0),
//         expenseType: "Other",
//         status: i % 3 === 0 ? "Completed" : "Pending",
//         createdBy: admin._id,
//       });
//     }
//     await ExpenseEntry.insertMany(expenses);

//     console.log("🏗️ Creating Projects...");
// const projects = await Project.create([
//   {
//     name: "Luxury Greens",
//     builder: "Prestige Group",
//     projectType: "Apartment",
//     status: "New Launch",
//     propertyCity: "Bangalore",
//     locality: "Whitefield",
//     address: "123 Prestige Shantiniketan, Whitefield",
//     pincode: "560066",
//     configuration: "2BHK, 3BHK, 4BHK",
//     startingPrice: 7500000,
//     reraNumber: "KA-RERA-PR123456",
//     thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3",
//     propertyImages: [
//       "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3",
//       "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3"
//     ],
//     brochureUrl: "/brochures/luxury-greens.pdf",
//     googleMapLink: "https://goo.gl/maps/xyz",
//     amenities: ["Swimming Pool", "Gym", "Club House", "Park", "Power Backup"],
//     createdBy: admin._id,
//     createdByName: admin.name
//   },
//   {
//     name: "Serene Villas",
//     builder: "Sobha Limited",
//     projectType: "Villa",
//     status: "Under Construction",
//     propertyCity: "Bangalore",
//     locality: "Sarjapur Road",
//     address: "456 Sobha City, Sarjapur Road",
//     pincode: "560103",
//     configuration: "3BHK, 4BHK",
//     startingPrice: 12500000,
//     reraNumber: "KA-RERA-SB789012",
//     thumbnail: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3",
//     propertyImages: [
//       "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3",
//       "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3"
//     ],
//     amenities: ["Private Garden", "Swimming Pool", "Gym", "24/7 Security"],
//     createdBy: admin._id,
//     createdByName: admin.name
//   }
// ]);

// console.log("🏠 Creating Site Visits...");
// const siteVisits = [];
// const visitTimes = ["10:00 AM", "11:00 AM", "2:00 PM", "3:30 PM", "4:45 PM", "5:30 PM"];
// const visitStatuses = ["Scheduled", "DONE", "Cancelled"];
// const visitLocations = ["Main Office", "Project Site", "Virtual Meeting", "Client's Location"];

// // Get all leads to associate with site visits
// const allLeads = await Lead.find({}, '_id name phone');

// // Create 20-30 site visits (adjust the count as needed)
// const numVisits = 20 + Math.floor(Math.random() * 11); // Random number between 20-30

// for (let i = 0; i < numVisits; i++) {
//   const randomLead = allLeads[Math.floor(Math.random() * allLeads.length)];
//   const visitDate = new Date();
//   visitDate.setDate(visitDate.getDate() + Math.floor(Math.random() * 14)); // Within next 14 days
//   const status = visitStatuses[Math.floor(Math.random() * visitStatuses.length)];
//   const visitTime = visitTimes[Math.floor(Math.random() * visitTimes.length)];
//   const location = visitLocations[Math.floor(Math.random() * visitLocations.length)];
  
//   siteVisits.push({
//     lead: randomLead._id,
//     date: visitDate,
//     time: visitTime,
//     location: location,
//     status: status,
//     notes: status === "Scheduled" 
//       ? `Scheduled visit for ${randomLead.name} (${randomLead.phone})` 
//       : status === "DONE"
//         ? `Completed visit with ${randomLead.name}. Follow up required.`
//         : `Visit cancelled by ${Math.random() > 0.5 ? 'client' : 'agent'}`,
//     Agent: Math.random() > 0.5 ? "John Agent" : "Admin User",
//     createdBy: admin._id,
//     createdByName: admin.name
//   });
// }

// // Insert all site visits
// await SiteVisit.insertMany(siteVisits);
//     console.log("✅ Seeding Complete with Pagination Data!");
//     process.exit(0);
//   } catch (error) {
//     console.error("Error seeding:", error);
//     process.exit(1);
//   }
// };
// seed();
