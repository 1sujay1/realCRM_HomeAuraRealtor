const fs = require("fs");
const path = require("path");

console.log(
  "🚀 Initializing Production-Ready Next.js Structure with Premium UI Features...",
);

// 1. Create Directories
const dirs = [
  "app/api/auth/login",
  "app/api/auth/logout",
  "app/api/auth/register",
  "app/api/auth/me",
  "app/api/leads",
  "app/api/expenses",
  "app/api/users",
  "app/(protected)/dashboard",
  "app/(protected)/leads",
  "app/(protected)/expenses",
  "app/(protected)/users",
  "app/(protected)/profile",
  "components/ui",
  "components/layout",
  "lib",
  "models",
  "types",
];

dirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

// 2. Define File Contents

const files = {
  // --- CONFIGURATION ---
  "lib/config.ts": `
export const APP_NAME = "BrokerFlow Pro";
export const COMPANY_ADDRESS = "123 Real Estate Ave, Business City";
export const SUPPORT_EMAIL = "support@brokerflow.com";
`,

  // --- EMAIL UTILITY ---
  "lib/email.ts": `
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: \`"\${process.env.SMTP_FROM_NAME || 'BrokerFlow'}" <\${process.env.SMTP_USER}>\`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendVerificationEmail = async (to: string, name: string, code: string) => {
    const subject = "Verify your account";
    const html = \`
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to BrokerFlow Pro, \${name}!</h2>
        <p>Please use the following code to verify your account:</p>
        <h1 style="color: #4f46e5; letter-spacing: 5px;">\${code}</h1>
        <p>Or click <a href="\${process.env.NEXT_PUBLIC_APP_URL}/verify?code=\${code}">here</a> to verify.</p>
      </div>
    \`;
    return sendMail(to, subject, html);
};
`,

  // --- ROOT LAYOUT & GLOBAL LOADING ---
  "app/layout.tsx": `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { APP_NAME } from '@/lib/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Real Estate CRM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,

  "app/loading.tsx": `
import { Loader2 } from "lucide-react";
export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Loading BrokerFlow...</p>
      </div>
    </div>
  );
}`,

  // --- CONFIG FILES ---
  "package.json": `{
  "name": "brokerflow-pro",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "seed": "node seed.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.0",
    "cookie": "^0.6.0",
    "jose": "^5.2.0",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.300.0",
    "mongoose": "^8.0.3",
    "next": "14.0.4",
    "nodemailer": "^6.9.7",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^2.2.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cookie": "^0.6.0",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/nodemailer": "^6.4.14",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}`,

  "tsconfig.json": `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,

  "tailwind.config.ts": `import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
export default config;`,

  "postcss.config.js": `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {}, }, }`,
  ".env.local": `MONGODB_URI=mongodb+srv://admin:admin@cluster0.2sucg.mongodb.net/brokerflow_db
JWT_SECRET=super_secret_jwt_key_change_this_in_prod
NEXT_PUBLIC_APP_URL=http://localhost:3000
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=user
SMTP_PASS=pass
SMTP_FROM_NAME="BrokerFlow Support"
`,
  "app/globals.css": `@tailwind base; @tailwind components; @tailwind utilities; 
body { background-color: #f8fafc; }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
@media print {
  .no-print { display: none !important; }
  .print-only { display: block !important; }
}
`,

  // --- SEED SCRIPT ---
  "seed.js": `
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const MONGODB_URI = 'mongodb+srv://admin:admin@cluster0.2sucg.mongodb.net/brokerflow_db';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  status: { type: String, default: "New / Fresh Lead" },
  source: String,
  createdBy: mongoose.Schema.Types.ObjectId,
  createdByName: String
}, { timestamps: true });

const expenseSchema = new mongoose.Schema({
  category: String,
  description: String,
  amount: String,
  expenseType: String,
  status: { type: String, default: "Pending" },
  createdBy: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
const ExpenseEntry = mongoose.models.ExpenseEntry || mongoose.model('ExpenseEntry', expenseSchema);

const seed = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Lead.deleteMany({});
    await ExpenseEntry.deleteMany({});

    console.log('👤 Creating Users...');
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('admin123', salt);
    const agentHash = await bcrypt.hash('agent123', salt);

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@brokerflow.com',
      password: adminHash,
      role: 'admin',
      isVerified: true
    });

    const agent = await User.create({
      name: 'John Agent',
      email: 'agent@brokerflow.com',
      password: agentHash,
      role: 'agent',
      isVerified: true
    });

    console.log('👥 Creating 50 Leads for Pagination Test...');
    const leads = [];
    const statuses = ["New / Fresh Lead", "Interested / Warm Lead", "Contacted", "Closed - Won", "Closed - Lost"];
    const sources = ["CRM", "Website", "Referral", "HOME_AURA_REALTOR"];
    
    for(let i = 1; i <= 50; i++) {
        leads.push({
            name: \`Lead Candidate \${i}\`,
            email: \`lead\${i}@example.com\`,
            phone: \`98765\${10000+i}\`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            source: sources[Math.floor(Math.random() * sources.length)],
            createdBy: agent._id,
            createdByName: agent.name
        });
    }
    await Lead.insertMany(leads);

    console.log('💸 Creating 50 Expenses for Pagination Test...');
    const expenses = [];
    const categories = ["Office", "Travel", "Food", "Salary"];
    
    for(let i = 1; i <= 50; i++) {
        expenses.push({
            category: categories[Math.floor(Math.random() * categories.length)],
            description: \`Expense Item \${i}\`,
            amount: (Math.random() * 5000 + 100).toFixed(0),
            expenseType: 'Other',
            status: i % 3 === 0 ? 'Completed' : 'Pending',
            createdBy: admin._id
        });
    }
    await ExpenseEntry.insertMany(expenses);

    console.log('✅ Seeding Complete with Pagination Data!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
};
seed();
`,

  // --- GLOBAL RBAC CONFIGURATION ---
  "lib/rbac.ts": `
export type Role = 'admin' | 'agent';
export type Module = 'Leads' | 'Expenses' | 'Users';
export type Action = 'create' | 'read' | 'update' | 'delete';

export const RBAC_CONFIG = {
  Leads: {
    admin: { create: true, read: true, update: true, delete: true },
    agent: { create: true, read: true, update: true, delete: false }
  },
  Expenses: {
    admin: { create: true, read: true, update: true, delete: true },
    agent: { create: false, read: false, update: false, delete: false }
  },
  Users: {
    admin: { create: true, read: true, update: true, delete: true },
    agent: { create: false, read: false, update: false, delete: false }
  }
};

export function checkPermission(role: string, module: Module, action: Action): boolean {
  const r = role as Role;
  return RBAC_CONFIG[module]?.[r]?.[action] ?? false;
}

export function getUserPermissions(role: string) {
  const r = role as Role;
  return {
    canDeleteLeads: RBAC_CONFIG.Leads[r]?.delete ?? false,
    canDeleteExpenses: RBAC_CONFIG.Expenses[r]?.delete ?? false,
    canViewExpenses: RBAC_CONFIG.Expenses[r]?.read ?? false,
    canManageUsers: RBAC_CONFIG.Users[r]?.read ?? false,
  };
}
`,

  // --- DATABASE & LIB ---

  "lib/db.ts": `import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;
let cached = (global as any).mongoose || { conn: null, promise: null };

async function connectDB() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((mongoose) => mongoose);
  }
  try { cached.conn = await cached.promise; } catch (e) { cached.promise = null; throw e; }
  return cached.conn;
}
export default connectDB;`,

  "lib/utils.ts": `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }`,

  "lib/security.ts": `import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from './db';
import { Token } from '@/models/Token';
import { checkPermission, Module, Action } from './rbac';

export async function validateRequest(req: Request, module: Module, action: Action) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return null;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    await connectDB();
    const activeToken = await Token.findOne({ token: token, isValid: true, expiresAt: { $gt: new Date() } });
    if (!activeToken) return null;
    if (!checkPermission(payload.role as string, module, action)) return 'forbidden';
    return payload;
  } catch (error) { return null; }
}`,

  // --- MODELS ---
  "models/User.ts": `import mongoose, { Schema, model, models } from 'mongoose';
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });
export const User = models.User || model('User', UserSchema);`,

  "models/Token.ts": `import mongoose, { Schema, model, models } from 'mongoose';
const TokenSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  type: { type: String, enum: ['access', 'refresh'], default: 'access' },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });
export const Token = models.Token || model('Token', TokenSchema);`,

  "models/Lead.ts": `import mongoose, { Schema, model, models } from 'mongoose';
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
export const Lead = models.Lead || model('Lead', LeadSchema);`,

  "models/Expense.ts": `import mongoose, { Schema, model, models } from 'mongoose';
const ExpenseEntrySchema = new Schema({
    category: String, description: String, amount: String, date: Date,
    paymentMode: { type: String, default: "Other" },
    paymentMadeBy: { type: String, default: "Other" },
    expenseType: { type: String, default: "Other" },
    notes: String, status: { type: String, default: "Pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }, { timestamps: true });
export const ExpenseEntry = models.ExpenseEntry || model('ExpenseEntry', ExpenseEntrySchema);`,

  // --- API ROUTES ---
  "app/api/auth/register/route.ts": `import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';
export async function POST(req: Request) {
  try {
    await connectDB();
    const count = await User.countDocuments();
    const { name, email, password, role } = await req.json();
    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let userRole = 'agent';
    if (count === 0) userRole = 'admin';
    else if (role && ['admin', 'agent'].includes(role)) userRole = role;
    const newUser = await User.create({ name, email, password: hashedPassword, role: userRole, isVerified: false });
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await sendVerificationEmail(email, name, verificationCode);
    return NextResponse.json({ success: true, user: { id: newUser._id, email: newUser.email } });
  } catch (error) { return NextResponse.json({ error: 'Server Error' }, { status: 500 }); }
}`,

  "app/api/auth/login/route.ts": `import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { Token } from '@/models/Token';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const userCount = await User.countDocuments();
    if (userCount === 0) {
       const salt = await bcrypt.genSalt(10);
       const hashed = await bcrypt.hash('admin123', salt);
       await User.create({ name: 'Super Admin', email: 'admin@brokerflow.com', password: hashed, role: 'admin', isVerified: true });
    }
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: user._id, role: user.role, name: user.name })
      .setProtectedHeader({ alg: 'HS256' }).setExpirationTime('24h').sign(secret);
    await Token.create({ userId: user._id, token: token, type: 'access', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    cookies().set('token', token, { httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production' });
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: 'Server error' }, { status: 500 }); }
}`,

  "app/api/auth/logout/route.ts": `import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Token } from '@/models/Token';
import { cookies } from 'next/headers';
export async function POST() {
  const token = cookies().get('token')?.value;
  if(token) { await connectDB(); await Token.findOneAndUpdate({ token }, { isValid: false }); }
  cookies().delete('token');
  return NextResponse.json({ success: true });
}`,

  "app/api/auth/me/route.ts": `import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { getUserPermissions } from '@/lib/rbac';
export async function GET() {
  const token = cookies().get('token')?.value;
  if (!token) return NextResponse.json({ user: null });
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    await connectDB();
    const user = await User.findById(payload.userId).select('-password');
    if(!user) return NextResponse.json({ user: null });
    const permissions = getUserPermissions(user.role);
    return NextResponse.json({ user: { ...user.toObject(), permissions } });
  } catch (e) { return NextResponse.json({ user: null }); }
}`,

  "app/api/leads/route.ts": `import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Lead } from '@/models/Lead';
import { validateRequest } from '@/lib/security';

export async function GET(req: Request) {
  const user: any = await validateRequest(req, 'Leads', 'read');
  if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const leads = await Lead.find({}).sort({ createdAt: -1 });
  return NextResponse.json(leads);
}
export async function POST(req: Request) {
  const user: any = await validateRequest(req, 'Leads', 'create');
  if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    await connectDB();
    const newLead = await Lead.create({ ...body, createdBy: user.userId, createdByName: user.name || 'System' });
    return NextResponse.json(newLead);
  } catch (error) { return NextResponse.json({ error: 'Invalid data' }, { status: 400 }); }
}
export async function PUT(req: Request) {
  const user: any = await validateRequest(req, 'Leads', 'update');
  if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;
    await connectDB();
    const updatedLead = await Lead.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updatedLead);
  } catch (error) { return NextResponse.json({ error: 'Update failed' }, { status: 400 }); }
}
export async function DELETE(req: Request) {
  const user: any = await validateRequest(req, 'Leads', 'delete');
  if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const ids = searchParams.get('ids'); 
  await connectDB();
  if (ids) {
     await Lead.deleteMany({ _id: { $in: ids.split(',') } });
  } else {
     await Lead.findByIdAndDelete(id);
  }
  return NextResponse.json({ success: true });
}`,

  "app/api/expenses/route.ts": `import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ExpenseEntry } from '@/models/Expense';
import { validateRequest } from '@/lib/security';
export async function GET(req: Request) {
  const user = await validateRequest(req, 'Expenses', 'read');
  if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  await connectDB();
  const expenses = await ExpenseEntry.find({}).sort({ createdAt: -1 });
  return NextResponse.json(expenses);
}
export async function POST(req: Request) {
  const user: any = await validateRequest(req, 'Expenses', 'create');
  if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  await connectDB();
  const body = await req.json();
  const expense = await ExpenseEntry.create({ ...body, createdBy: user.userId });
  return NextResponse.json(expense);
}
export async function PUT(req: Request) {
  const user: any = await validateRequest(req, 'Expenses', 'update');
  if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;
    await connectDB();
    const updated = await ExpenseEntry.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) { return NextResponse.json({ error: 'Update failed' }, { status: 400 }); }
}
export async function DELETE(req: Request) {
  const user: any = await validateRequest(req, 'Expenses', 'delete');
  if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const ids = searchParams.get('ids'); 
  await connectDB();
  if (ids) {
     await ExpenseEntry.deleteMany({ _id: { $in: ids.split(',') } });
  } else {
     await ExpenseEntry.findByIdAndDelete(id);
  }
  return NextResponse.json({ success: true });
}`,

  "app/api/users/route.ts": `import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { validateRequest } from '@/lib/security';
import bcrypt from 'bcryptjs';
export async function GET(req: Request) {
  const user = await validateRequest(req, 'Users', 'read');
  if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  await connectDB();
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  return NextResponse.json(users);
}
export async function POST(req: Request) {
    const user = await validateRequest(req, 'Users', 'create');
    if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    try {
        const { name, email, password, role } = await req.json();
        await connectDB();
        const existing = await User.findOne({ email });
        if(existing) return NextResponse.json({ error: 'Email exists' }, { status: 400 });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email, password: hashedPassword, role, isVerified: true });
        return NextResponse.json(newUser);
    } catch(e) { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
export async function PUT(req: Request) {
    const user = await validateRequest(req, 'Users', 'update');
    if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    try {
        const { _id, name, role } = await req.json();
        await connectDB();
        const updated = await User.findByIdAndUpdate(_id, { name, role }, { new: true }).select('-password');
        return NextResponse.json(updated);
    } catch(e) { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
export async function DELETE(req: Request) {
    const user = await validateRequest(req, 'Users', 'delete');
    if (!user || user === 'forbidden') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const ids = searchParams.get('ids'); 
    await connectDB();
    if (ids) {
       await User.deleteMany({ _id: { $in: ids.split(',') } });
    } else {
       await User.findByIdAndDelete(id);
    }
    return NextResponse.json({ success: true });
}`,

  "middleware.ts": `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;
  const protectedRoutes = ['/dashboard', '/leads', '/expenses', '/users', '/profile'];
  if (protectedRoutes.some(r => path.startsWith(r))) {
    if (!token) return NextResponse.redirect(new URL('/', request.url));
    try {
       const secret = new TextEncoder().encode(process.env.JWT_SECRET);
       const { payload } = await jwtVerify(token, secret);
       const role = payload.role as string;
       if (path.startsWith('/expenses') && role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
       }
       if (path.startsWith('/users') && role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
       }
    } catch (e) { return NextResponse.redirect(new URL('/', request.url)); }
  }
  return NextResponse.next();
}
export const config = { matcher: ['/', '/dashboard/:path*', '/leads/:path*', '/expenses/:path*', '/users/:path*', '/profile/:path*'], };`,

  // --- UI COMPONENTS ---
  "components/ui/Modal.tsx": `
'use client';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Modal({ isOpen, onClose, title, children, type = 'default' }: any) {
  if (!isOpen) return null;
  const isDanger = type === 'danger';
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={cn("bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100", isDanger && "border-t-4 border-red-500")}>
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className={cn("font-semibold flex items-center gap-2", isDanger ? "text-red-600" : "text-slate-800")}>
            {isDanger && <AlertTriangle size={18} />}
            {title}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
`,

  "components/ui/Drawer.tsx": `
'use client';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Drawer({ isOpen, onClose, title, children }: any) {
  return (
    <>
      <div className={cn("fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-300", isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")} onClick={onClose} />
      <div className={cn("fixed inset-y-0 right-0 z-[60] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out", isOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={20} /></button>
          </div>
          {/* Removed space-y-6 to fix top margin issue */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
`,

  "components/ui/Spinner.tsx": `
import { Loader2 } from "lucide-react";
export default function Spinner({ className, size=20 }: { className?: string, size?: number }) {
    return <Loader2 size={size} className={\`animate-spin \${className}\`} />;
}
`,

  "components/ui/DataTable.tsx": `
'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Spinner from './Spinner';

interface DataTableProps {
  columns: any[];
  data: any[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onRowClick?: (item: any) => void;
  isLoading?: boolean;
  actionBuilder?: (item: any) => React.ReactNode;
}

export default function DataTable({ columns, data, selectedIds, onSelectionChange, onRowClick, isLoading, actionBuilder }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = () => {
    if (selectedIds.size === data.length && data.length > 0) onSelectionChange(new Set());
    else onSelectionChange(new Set(data.map((i: any) => i._id)));
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if(newSet.has(id)) newSet.delete(id); else newSet.add(id);
    onSelectionChange(newSet);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-x-auto relative">
            {isLoading && <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center"><Spinner size={32} className="text-indigo-600"/></div>}
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <th className="p-4 w-14">
                            <div className="flex items-center justify-center">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" checked={data.length > 0 && selectedIds.size === data.length} onChange={handleSelectAll} disabled={data.length === 0} />
                            </div>
                        </th>
                        {columns.map((col: any) => (
                            <th key={col.key} className={cn("p-4 whitespace-nowrap", col.className)}>{col.header}</th>
                        ))}
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {paginatedData.map((row: any) => (
                        <tr key={row._id} onClick={() => onRowClick && onRowClick(row)} className={cn("hover:bg-slate-50 transition-colors cursor-pointer group", selectedIds.has(row._id) && "bg-indigo-50/40")}>
                            <td className="p-4" onClick={(e) => handleSelectRow(row._id, e)}>
                                <div className="flex items-center justify-center w-full h-full cursor-pointer p-2 -m-2">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none" checked={selectedIds.has(row._id)} readOnly />
                                </div>
                            </td>
                            {columns.map((col: any) => (
                                <td key={col.key} className="p-4 text-sm text-slate-600">{col.render ? col.render(row) : row[col.key]}</td>
                            ))}
                            <td className="p-4 text-right" onClick={e => e.stopPropagation()}>{actionBuilder && actionBuilder(row)}</td>
                        </tr>
                    ))}
                    {data.length === 0 && !isLoading && <tr><td colSpan={columns.length + 2} className="p-12 text-center text-slate-500">No records found</td></tr>}
                </tbody>
            </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500">
            <span>Showing {data.length === 0 ? 0 : (currentPage-1)*itemsPerPage + 1} to {Math.min(currentPage*itemsPerPage, data.length)} of {data.length} entries</span>
            <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-2 border rounded-lg hover:bg-white disabled:opacity-50"><ChevronLeft size={16} /></button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 border rounded-lg hover:bg-white disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
        </div>
    </div>
  );
}
`,

  // --- FRONTEND COMPONENTS ---

  "components/layout/Sidebar.tsx": `'use client';
import { LayoutDashboard, Users, User, LogOut, Building, DollarSign, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/config';

export default function Sidebar({ user, isMobileOpen, setIsMobileOpen, isDesktopCollapsed, setIsDesktopCollapsed }: any) {
  const pathname = usePathname();
  const handleLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/'; };
  const NavItem = ({ href, icon: Icon, label }: any) => {
    const isActive = pathname === href;
    return (
      <Link href={href} onClick={() => setIsMobileOpen(false)}
        className={cn("flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative", isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-600 hover:bg-slate-100", isDesktopCollapsed && "justify-center px-2")}
        title={isDesktopCollapsed ? label : undefined}>
        <Icon size={20} className={isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-600"} /> 
        {!isDesktopCollapsed && <span className="font-medium">{label}</span>}
      </Link>
    );
  };
  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileOpen(false)} />}
      <aside className={cn("fixed lg:static inset-y-0 left-0 bg-white border-r border-slate-100 z-50 transform transition-all duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none no-print", isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0', isDesktopCollapsed ? 'lg:w-20' : 'lg:w-72')}>
        <div className={cn("p-6 flex items-center justify-between", isDesktopCollapsed && "flex-col gap-4 p-4")}>
          <div className="flex items-center gap-2 text-indigo-600">
             <div className="p-2 bg-indigo-100 rounded-lg"><Building size={24} /></div>
             {!isDesktopCollapsed && (<div><h1 className="text-xl font-bold tracking-tight text-slate-800">{APP_NAME}</h1><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pro Dashboard</p></div>)}
          </div>
          <button onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)} className="hidden lg:flex p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400">
             {isDesktopCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
          {!isDesktopCollapsed && <p className="px-4 text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Main</p>}
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/leads" icon={Users} label="Leads" />
          {(user?.role === 'admin' || user?.permissions?.canViewExpenses) && <NavItem href="/expenses" icon={DollarSign} label="Expenses" />}
          {user?.role === 'admin' && (<div className={cn(!isDesktopCollapsed && "pt-6 mt-2")}>{!isDesktopCollapsed && <p className="px-4 text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Admin</p>}<NavItem href="/users" icon={Lock} label="User Management" /></div>)}
          <div className={cn(!isDesktopCollapsed && "pt-6 mt-2")}><NavItem href="/profile" icon={User} label="My Profile" /></div>
        </nav>
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"><LogOut size={18} /> {!isDesktopCollapsed && "Sign Out"}</button>
        </div>
      </aside>
    </>
  );
}`,

  "components/layout/MainLayout.tsx": `'use client';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { APP_NAME } from '@/lib/config';
import Spinner from '@/components/ui/Spinner';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => { if(data.user) setUser(data.user); else window.location.href = '/'; })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-indigo-600 gap-2"><Spinner size={40} /><p className="text-sm font-medium">Loading {APP_NAME}...</p></div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar user={user} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} isDesktopCollapsed={isDesktopCollapsed} setIsDesktopCollapsed={setIsDesktopCollapsed} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="lg:hidden h-16 bg-white border-b border-slate-100 flex items-center px-4 justify-between z-40 shadow-sm flex-shrink-0">
           <button onClick={() => setIsMobileOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg"><Menu size={24} /></button>
           <span className="font-bold text-lg text-indigo-900">{APP_NAME}</span>
           <div className="w-8"></div> 
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">{children}</div>
      </main>
    </div>
  );
}`,

  // --- PAGES ---

  "app/page.tsx": `'use client';
import { useState } from 'react';
import { Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@/lib/config';
import Spinner from '@/components/ui/Spinner';

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      if (view === 'login') {
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (res.ok) router.push('/dashboard'); else setError(data.error || 'Login failed');
      } 
      else if (view === 'register') {
        const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
        const data = await res.json();
        if (res.ok) {
           setSuccess('Account created! Logging in...');
           await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
           router.push('/dashboard');
        } else setError(data.error || 'Registration failed');
      }
      else if (view === 'forgot') {
        await new Promise(r => setTimeout(r, 1000));
        setSuccess('If this email exists, a reset link has been sent.');
      }
    } catch (err) { setError('Something went wrong'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/50 backdrop-blur-sm">
        <div className="text-center mb-8">
           <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-xl mb-4"><Building size={32} /></div>
           <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{APP_NAME}</h1>
           <p className="text-slate-500 mt-2">Professional Real Estate CRM</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-sm font-medium">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (<div className="space-y-1"><label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label><input className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required /></div>)}
          <div className="space-y-1"><label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label><input className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="you@brokerflow.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          {view !== 'forgot' && (<div className="space-y-1"><label className="text-xs font-semibold text-slate-500 uppercase">Password</label><input className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required /></div>)}
          <button disabled={loading} className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
            {loading && <Spinner className="text-white" />}
            {view === 'login' ? 'Sign In' : view === 'register' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
           {view === 'login' && (<><p className="text-slate-600">Don't have an account? <button onClick={() => setView('register')} className="text-indigo-600 font-bold hover:underline">Sign Up</button></p><button onClick={() => setView('forgot')} className="text-sm text-slate-400 hover:text-slate-600">Forgot password?</button></>)}
           {view === 'register' && (<p className="text-slate-600">Already have an account? <button onClick={() => setView('login')} className="text-indigo-600 font-bold hover:underline">Sign In</button></p>)}
           {view === 'forgot' && (<button onClick={() => setView('login')} className="text-indigo-600 font-bold hover:underline">Back to Login</button>)}
        </div>
      </div>
    </div>
  );
}`,

  "app/(protected)/layout.tsx": `import MainLayout from '@/components/layout/MainLayout';
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}`,

  "app/(protected)/dashboard/page.tsx": `'use client';
import { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { APP_NAME } from '@/lib/config';
import Spinner from '@/components/ui/Spinner';

export default function DashboardPage() {
  const [stats, setStats] = useState({ leads: 0, expenses: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/leads').then(res => res.ok ? res.json() : []),
      fetch('/api/expenses').then(res => res.ok ? res.json() : []),
      fetch('/api/users').then(res => res.ok ? res.json() : [])
    ]).then(([leads, expenses, users]) => {
      setStats({ leads: leads.length, expenses: expenses.length, users: users.length });
    }).finally(() => setLoading(false));
  }, []);

  const Card = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
       <div>
          <p className="text-slate-500 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{loading ? <Spinner /> : value}</h3>
       </div>
       <div className={\`p-4 rounded-xl \${color}\`}>
          <Icon size={24} className="text-white" />
       </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-slate-800">Dashboard</h1><p className="text-slate-500">Welcome back to {APP_NAME}</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card title="Total Leads" value={stats.leads} icon={Users} color="bg-blue-500" />
         <Card title="Expenses" value={stats.expenses} icon={DollarSign} color="bg-emerald-500" />
         <Card title="Conversion Rate" value="12%" icon={TrendingUp} color="bg-violet-500" />
         <Card title="Active Users" value={stats.users} icon={Activity} color="bg-orange-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-64 flex items-center justify-center text-slate-400 bg-slate-50/50">Chart Placeholder (Lead Growth)</div>
         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-64 flex items-center justify-center text-slate-400 bg-slate-50/50">Chart Placeholder (Expense vs Revenue)</div>
      </div>
    </div>
  );
}`,

  "app/(protected)/leads/page.tsx": `'use client';
import { useState, useEffect } from 'react';
import { Search, Download, Filter, Plus, FileText, Pencil, Trash, Eye, ChevronDown, Upload } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Drawer from '@/components/ui/Drawer';
import Spinner from '@/components/ui/Spinner';
import DataTable from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';

export default function LeadsPage() {
  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'filter' | 'view' | 'edit'>('filter');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', status: 'New / Fresh Lead', source: 'CRM', notes: '' });

  const fetchLeads = () => {
    setLoading(true);
    fetch('/api/leads').then(res => res.json()).then(data => { setLeads(data); setLoading(false); });
  };

  useEffect(() => { 
    fetchLeads(); 
    fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user));
  }, []);

  const openDrawer = (type: 'filter' | 'view' | 'edit', lead?: any) => {
    setDrawerType(type);
    setSelectedLead(lead);
    if (lead) setFormData({ name: lead.name, phone: lead.phone, email: lead.email, status: lead.status, source: lead.source, notes: lead.notes || '' });
    setIsDrawerOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    const ids = itemToDelete ? [itemToDelete] : Array.from(selectedIds);
    await fetch(\`/api/leads?ids=\${ids.join(',')}\`, { method: 'DELETE' });
    setDeleteConfirmOpen(false); setItemToDelete(null); setSelectedIds(new Set()); fetchLeads();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const method = selectedLead ? 'PUT' : 'POST';
    const body = selectedLead ? { ...formData, _id: selectedLead._id } : formData;
    await fetch('/api/leads', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setIsDrawerOpen(false); fetchLeads();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
       const text = event.target?.result as string;
       const lines = text.split('\\n').slice(1);
       for(const line of lines) {
          const [name, phone, email, status, source] = line.split(',').map(s => s.replace(/"/g, '').trim());
          if(name && phone) await fetch('/api/leads', { method: 'POST', body: JSON.stringify({ name, phone, email, status, source }) });
       }
       fetchLeads();
    };
    reader.readAsText(file);
  };

  const exportData = (type: 'csv' | 'pdf') => {
    setShowExportMenu(false);
    if (type === 'pdf') { window.print(); return; }
    const headers = ['Name,Phone,Email,Status,Source'];
    const rows = leads.map(l => \`"\${l.name}","\${l.phone}","\${l.email||''}","\${l.status}","\${l.source}"\`);
    const blob = new Blob([headers.concat(rows).join('\\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
  };

  const getLeadStatusColor = (status: string) => {
    if(status.includes('New')) return 'bg-blue-100 text-blue-800';
    if(status.includes('Warm')) return 'bg-amber-100 text-amber-800';
    if(status.includes('Won')) return 'bg-green-100 text-green-800';
    if(status.includes('Lost')) return 'bg-red-100 text-red-800';
    return 'bg-slate-100 text-slate-800';
  };

  const filteredLeads = leads.filter(lead => {
     const matchesSearch = lead.name.toLowerCase().includes(filter.toLowerCase()) || lead.phone.includes(filter);
     const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
     const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;
     return matchesSearch && matchesStatus && matchesSource;
  });

  const columns = [
    { key: 'name', header: 'Name', className: 'font-medium text-slate-900', render: (row: any) => <span className="hover:text-indigo-600 cursor-pointer font-semibold">{row.name}</span> },
    { key: 'contact', header: 'Contact', render: (row: any) => <div><p className="text-sm text-slate-900">{row.phone}</p><p className="text-xs text-slate-500">{row.email}</p></div> },
    { key: 'status', header: 'Status', render: (row: any) => <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getLeadStatusColor(row.status))}>{row.status}</span> },
    { key: 'source', header: 'Source' }
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-slate-800">Leads Management</h1><p className="text-slate-500">Track potential clients</p></div>
        <div className="flex gap-2 no-print">
           {user?.permissions?.canDeleteLeads && (
             <button onClick={() => { setItemToDelete(null); setDeleteConfirmOpen(true); }} disabled={selectedIds.size === 0} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                <Trash size={18} /> Delete ({selectedIds.size})
             </button>
           )}
           <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium cursor-pointer">
             <Upload size={18} /> <span className="hidden sm:inline">Import</span> <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
           </label>
           <div className="relative">
             <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"><Download size={18} /> <span className="hidden sm:inline">Export</span> <ChevronDown size={14} /></button>
             {showExportMenu && (
               <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-1">
                 <button onClick={() => exportData('csv')} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex gap-2"><FileText size={16} /> CSV</button>
                 <button onClick={() => exportData('pdf')} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex gap-2"><FileText size={16} /> PDF</button>
               </div>
             )}
           </div>
           <button onClick={() => { setSelectedLead(null); setFormData({name:'',phone:'',email:'',status:'New / Fresh Lead',source:'CRM',notes:''}); openDrawer('edit'); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"><Plus size={18} /> <span className="hidden sm:inline">New Lead</span></button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 no-print items-center">
         <div className="flex-1 relative"><Search className="absolute left-3 top-3 text-slate-400" size={20} /><input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Search leads..." value={filter} onChange={e => setFilter(e.target.value)} /></div>
         <button onClick={() => openDrawer('filter')} className={cn("flex items-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-slate-50 font-medium text-slate-600", (statusFilter !== 'All' || sourceFilter !== 'All') && "bg-indigo-50 border-indigo-200 text-indigo-700")}><Filter size={18} /> Filters</button>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredLeads} 
        isLoading={loading}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onRowClick={(row) => openDrawer('view', row)}
        actionBuilder={(row) => (
            <div className="flex justify-end gap-2">
                <button onClick={(e) => { e.stopPropagation(); openDrawer('view', row); }} className="p-1.5 hover:bg-slate-100 text-slate-500 rounded"><Eye size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); openDrawer('edit', row); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"><Pencil size={16} /></button>
                {user?.permissions?.canDeleteLeads && <button onClick={(e) => { e.stopPropagation(); setItemToDelete(row._id); setDeleteConfirmOpen(true); }} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash size={16} /></button>}
            </div>
        )}
      />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerType === 'filter' ? 'Filters' : drawerType === 'view' ? 'Lead Details' : selectedLead ? 'Edit Lead' : 'New Lead'}>
         {drawerType === 'filter' && (
           <div className="space-y-6">
              <div className="space-y-2"><label className="text-sm font-medium">Status</label><select className="w-full p-2 border rounded-lg" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="All">All Statuses</option><option value="New / Fresh Lead">New Lead</option><option value="Interested / Warm Lead">Warm Lead</option><option value="Closed - Won">Closed Won</option><option value="Closed - Lost">Closed Lost</option></select></div>
              <div className="space-y-2"><label className="text-sm font-medium">Source</label><select className="w-full p-2 border rounded-lg" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}><option value="All">All Sources</option><option value="CRM">CRM</option><option value="Website">Website</option></select></div>
              <button onClick={() => { setStatusFilter('All'); setSourceFilter('All'); }} className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 underline">Reset Filters</button>
           </div>
         )}
         {drawerType === 'view' && selectedLead && (
            <div className="space-y-6">
               <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Name</p><p className="text-lg font-medium">{selectedLead.name}</p></div>
               <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Contact</p><p>{selectedLead.phone}</p><p className="text-slate-500">{selectedLead.email}</p></div>
               <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Status</p><span className={cn("inline-block px-2 py-1 rounded text-sm", getLeadStatusColor(selectedLead.status))}>{selectedLead.status}</span></div>
               <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Notes</p><p className="bg-slate-50 p-3 rounded-lg text-sm">{selectedLead.notes || 'No notes.'}</p></div>
               <div className="pt-6 flex gap-2"><button onClick={() => openDrawer('edit', selectedLead)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium">Edit Lead</button></div>
            </div>
         )}
         {drawerType === 'edit' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1"><label className="text-sm font-medium">Full Name</label><input className="w-full p-2.5 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Phone</label><input className="w-full p-2.5 border rounded-lg" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Email</label><input className="w-full p-2.5 border rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-sm font-medium">Status</label><select className="w-full p-2.5 border rounded-lg" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option value="New / Fresh Lead">New / Fresh Lead</option><option value="Interested / Warm Lead">Warm Lead</option><option value="Closed - Won">Closed - Won</option><option value="Closed - Lost">Closed - Lost</option></select></div>
              <div className="space-y-1"><label className="text-sm font-medium">Source</label><select className="w-full p-2.5 border rounded-lg" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}><option value="CRM">CRM</option><option value="Website">Website</option></select></div>
              <div className="space-y-1"><label className="text-sm font-medium">Notes</label><textarea className="w-full p-2.5 border rounded-lg h-24" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} /></div>
              <div className="pt-4"><button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 flex justify-center">{loading ? <Spinner className="text-white"/> : 'Save Changes'}</button></div>
            </form>
         )}
      </Drawer>

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm Deletion" type="danger">
         <p className="text-slate-600 mb-6">Are you sure you want to delete {itemToDelete ? 'this lead' : \`\${selectedIds.size} leads\`}? This action cannot be undone.</p>
         <div className="flex justify-end gap-3"><button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button><button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 flex items-center gap-2">{loading && <Spinner className="text-white" size={16} />} Delete</button></div>
      </Modal>
    </div>
  );
}`,

  "app/(protected)/expenses/page.tsx": `'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash, Eye, Upload, Filter, ChevronDown, Download, FileText } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Drawer from '@/components/ui/Drawer';
import Spinner from '@/components/ui/Spinner';
import DataTable from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';

export default function ExpensesPage() {
  const [user, setUser] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'filter' | 'view' | 'edit'>('filter');
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [formData, setFormData] = useState({ description: '', amount: '', category: 'Office', expenseType: 'Rent', status: 'Pending' });
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const fetchExpenses = () => { setLoading(true); fetch('/api/expenses').then(res => res.json()).then(d => { setExpenses(d); setLoading(false); }); };
  
  useEffect(() => { 
    fetchExpenses(); 
    fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user));
  }, []);

  const openDrawer = (type: 'filter' | 'view' | 'edit', ex?: any) => {
    setDrawerType(type); setSelectedExpense(ex);
    if(type === 'edit') {
        if(ex) setFormData({ description: ex.description, amount: ex.amount, category: ex.category, expenseType: ex.expenseType, status: ex.status });
        else setFormData({ description: '', amount: '', category: 'Office', expenseType: 'Rent', status: 'Pending' });
    }
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const method = selectedExpense ? 'PUT' : 'POST';
    const body = selectedExpense ? { ...formData, _id: selectedExpense._id } : formData;
    await fetch('/api/expenses', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setIsDrawerOpen(false); fetchExpenses();
  };

  const handleDelete = async () => {
    setLoading(true);
    const ids = itemToDelete ? [itemToDelete] : Array.from(selectedIds);
    await fetch(\`/api/expenses?ids=\${ids.join(',')}\`, { method: 'DELETE' });
    setDeleteConfirmOpen(false); setItemToDelete(null); setSelectedIds(new Set()); fetchExpenses();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) fetchExpenses(); // Mock refresh
  };

  const filtered = expenses.filter(ex => {
      const matchSearch = ex.description.toLowerCase().includes(filter.toLowerCase());
      const matchCat = categoryFilter === 'All' || ex.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || ex.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
  });

  const getStatusColor = (status: string) => {
      if(status === 'Completed') return 'bg-green-100 text-green-700';
      if(status === 'Pending') return 'bg-amber-100 text-amber-700';
      if(status === 'Cancelled') return 'bg-red-100 text-red-700';
      return 'bg-slate-100 text-slate-700';
  };

  const columns = [
    { key: 'description', header: 'Description', render: (row: any) => <div><p className="font-medium">{row.description}</p><p className="text-xs text-slate-500">{row.category}</p></div> },
    { key: 'amount', header: 'Amount', render: (row: any) => <span className="font-bold text-slate-700">₹{row.amount}</span> },
    { key: 'status', header: 'Status', render: (row: any) => <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getStatusColor(row.status))}>{row.status}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-800">Expenses</h1><p className="text-slate-500">Track spending</p></div>
        <div className="flex gap-2">
            {user?.permissions?.canDeleteExpenses && (
              <button onClick={() => { setItemToDelete(null); setDeleteConfirmOpen(true); }} disabled={selectedIds.size === 0} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                <Trash size={18} /> Delete ({selectedIds.size})
              </button>
            )}
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium cursor-pointer">
             <Upload size={18} /> <span className="hidden sm:inline">Import</span> <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
            </label>
            <div className="relative">
                 <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium"><Download size={18} /> <span className="hidden sm:inline">Export</span> <ChevronDown size={14} /></button>
                 {showExportMenu && (
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-1">
                     <button className="w-full text-left px-4 py-2 hover:bg-slate-50 flex gap-2"><FileText size={16} /> CSV</button>
                     <button className="w-full text-left px-4 py-2 hover:bg-slate-50 flex gap-2"><FileText size={16} /> PDF</button>
                   </div>
                 )}
            </div>
            <button onClick={() => openDrawer('edit')} className="flex gap-2 items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700"><Plus size={18} /> <span className="hidden sm:inline">New Expense</span></button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 no-print items-center">
         <div className="flex-1 relative"><Search className="absolute left-3 top-3 text-slate-400" size={20} /><input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Search expenses..." value={filter} onChange={e => setFilter(e.target.value)} /></div>
         <button onClick={() => openDrawer('filter')} className={cn("flex items-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-slate-50 font-medium text-slate-600", (statusFilter !== 'All' || categoryFilter !== 'All') && "bg-indigo-50 border-indigo-200 text-indigo-700")}><Filter size={18} /> Filters</button>
      </div>

      <DataTable 
        columns={columns} 
        data={filtered} 
        isLoading={loading}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onRowClick={(row) => openDrawer('view', row)}
        actionBuilder={(row) => (
            <div className="flex justify-end gap-2">
                <button onClick={(e) => { e.stopPropagation(); openDrawer('view', row); }} className="p-1.5 hover:bg-slate-100 text-slate-500 rounded"><Eye size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); openDrawer('edit', row); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"><Pencil size={16} /></button>
                {user?.permissions?.canDeleteExpenses && <button onClick={(e) => { e.stopPropagation(); setItemToDelete(row._id); setDeleteConfirmOpen(true); }} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash size={16} /></button>}
            </div>
        )}
      />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerType === 'filter' ? 'Filter Expenses' : drawerType === 'view' ? 'Expense Details' : selectedExpense ? 'Edit Expense' : 'New Expense'}>
        {drawerType === 'filter' && (
           <div className="space-y-6">
              <div className="space-y-2"><label className="text-sm font-medium">Category</label><select className="w-full p-2 border rounded-lg" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option value="All">All Categories</option><option value="Office">Office</option><option value="Travel">Travel</option><option value="Food">Food</option></select></div>
              <div className="space-y-2"><label className="text-sm font-medium">Status</label><select className="w-full p-2 border rounded-lg" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="All">All Statuses</option><option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div>
              <button onClick={() => { setStatusFilter('All'); setCategoryFilter('All'); }} className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 underline">Reset Filters</button>
           </div>
        )}
        {drawerType === 'view' && selectedExpense && (
             <div className="space-y-4">
                 <div className="p-4 bg-slate-50 rounded-lg"><p className="text-xs font-bold text-slate-400 uppercase">Amount</p><p className="text-3xl font-bold text-slate-800">₹{selectedExpense.amount}</p></div>
                 <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Category</p><p>{selectedExpense.category}</p></div>
                 <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Status</p><span className={cn("inline-block px-2 py-1 rounded text-sm font-medium", getStatusColor(selectedExpense.status))}>{selectedExpense.status}</span></div>
                 <div className="space-y-1"><p className="text-xs uppercase text-slate-400 font-bold">Description</p><p>{selectedExpense.description}</p></div>
             </div>
        )}
        {drawerType === 'edit' && (
            <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1"><label className="text-sm font-medium">Description</label><input className="w-full p-2.5 border rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required /></div>
                <div className="space-y-1"><label className="text-sm font-medium">Amount</label><input className="w-full p-2.5 border rounded-lg" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required /></div>
                <div className="space-y-1"><label className="text-sm font-medium">Category</label><select className="w-full p-2.5 border rounded-lg" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}><option value="Office">Office</option><option value="Travel">Travel</option><option value="Food">Food</option></select></div>
                <div className="space-y-1"><label className="text-sm font-medium">Status</label><select className="w-full p-2.5 border rounded-lg" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div>
                <div className="pt-4"><button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 flex justify-center">{loading ? <Spinner className="text-white"/> : 'Save Changes'}</button></div>
            </form>
        )}
      </Drawer>

      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm Deletion" type="danger">
         <p className="text-slate-600 mb-6">Are you sure you want to delete this expense?</p>
         <div className="flex justify-end gap-3"><button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button><button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 flex items-center gap-2">{loading && <Spinner className="text-white" size={16} />} Delete</button></div>
      </Modal>
    </div>
  );
}`,

  "app/(protected)/users/page.tsx": `'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash, Upload } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import Drawer from '@/components/ui/Drawer';
import DataTable from '@/components/ui/DataTable';

export default function UsersPage() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'agent' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchUsers = () => { setLoading(true); fetch('/api/users').then(res => res.json()).then(d => { setUsers(d); setLoading(false); }); };
  useEffect(() => { 
    fetchUsers(); 
    fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user));
  }, []);

  const openDrawer = (user?: any) => {
    setEditingUser(user);
    if(user) setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    else setFormData({ name: '', email: '', password: '', role: 'agent' });
    setIsDrawerOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const method = editingUser ? 'PUT' : 'POST';
    const body = editingUser ? { _id: editingUser._id, name: formData.name, role: formData.role } : formData;
    await fetch('/api/users', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setIsDrawerOpen(false); fetchUsers();
  };

  const handleDelete = async () => {
    setLoading(true); 
    const ids = itemToDelete ? [itemToDelete] : Array.from(selectedIds);
    await fetch(\`/api/users?ids=\${ids.join(',')}\`, { method: 'DELETE' });
    setDeleteConfirmOpen(false); setItemToDelete(null); setSelectedIds(new Set()); fetchUsers();
  };

  const columns = [
    { key: 'name', header: 'Name', className: 'font-medium' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (r: any) => <span className="bg-slate-100 text-xs px-2 py-1 rounded capitalize">{r.role}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-800">Users</h1><p className="text-slate-500">Manage access</p></div>
        <div className="flex gap-2">
            {user?.role === 'admin' && (
              <button onClick={() => { setItemToDelete(null); setDeleteConfirmOpen(true); }} disabled={selectedIds.size === 0} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                <Trash size={18} /> Delete ({selectedIds.size})
              </button>
            )}
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors font-medium cursor-pointer">
             <Upload size={18} /> <span className="hidden sm:inline">Import</span> <input type="file" accept=".csv" className="hidden" />
            </label>
            <button onClick={() => openDrawer()} className="flex gap-2 items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-700"><Plus size={18} /> <span className="hidden sm:inline">New User</span></button>
        </div>
      </div>
      
      <DataTable 
        columns={columns} 
        data={users} 
        isLoading={loading}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onRowClick={(row) => openDrawer(row)}
        actionBuilder={(row) => (
            <div className="flex justify-end gap-2">
                <button onClick={(e) => { e.stopPropagation(); openDrawer(row); }} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"><Pencil size={16} /></button>
                {user?.role === 'admin' && <button onClick={(e) => { e.stopPropagation(); setItemToDelete(row._id); setDeleteConfirmOpen(true); }} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash size={16} /></button>}
            </div>
        )}
      />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={editingUser ? 'Edit User' : 'New User'}>
         <form onSubmit={handleSave} className="space-y-4">
             <div className="space-y-1"><label className="text-sm font-medium">Name</label><input className="w-full p-2.5 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
             {!editingUser && (<><div className="space-y-1"><label className="text-sm font-medium">Email</label><input className="w-full p-2.5 border rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div><div className="space-y-1"><label className="text-sm font-medium">Password</label><input className="w-full p-2.5 border rounded-lg" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required /></div></>)}
             <div className="space-y-1"><label className="text-sm font-medium">Role</label><select className="w-full p-2.5 border rounded-lg" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}><option value="agent">Agent</option><option value="admin">Admin</option></select></div>
             <div className="pt-4"><button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 flex justify-center">{loading ? <Spinner className="text-white"/> : 'Save User'}</button></div>
         </form>
      </Drawer>
      <Modal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} title="Confirm Deletion" type="danger">
         <p className="text-slate-600 mb-6">Are you sure you want to delete this user?</p>
         <div className="flex justify-end gap-3"><button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button><button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 flex items-center gap-2">{loading && <Spinner className="text-white" size={16} />} Delete</button></div>
      </Modal>
    </div>
  );
}`,

  "app/(protected)/profile/page.tsx": `'use client';
import { useState, useEffect } from 'react';
import { User, Shield, Mail } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => setUser(data.user)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-12"><Spinner size={40} className="text-indigo-600" /></div>;
  if (!user) return <div>Error loading profile</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
       <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600"><User size={40} /></div>
          <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-slate-500">{user.email}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700 capitalize"><Shield size={14} /> {user.role}</div>
       </div>
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-lg mb-4">Account Details</h3>
          <div className="space-y-4">
             <div className="flex items-center gap-4 p-3 border rounded-lg"><Mail className="text-slate-400" /><div><p className="text-xs text-slate-500 uppercase">Email</p><p className="font-medium">{user.email}</p></div></div>
             <div className="flex items-center gap-4 p-3 border rounded-lg"><Shield className="text-slate-400" /><div><p className="text-xs text-slate-500 uppercase">Verification Status</p><p className={user.isVerified ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>{user.isVerified ? "Verified Account" : "Verification Pending"}</p></div></div>
          </div>
       </div>
    </div>
  );
}`,
};

// 3. Write files
console.log("⚙️  Writing files...");
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filePath);
  const dirName = path.dirname(fullPath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}

console.log("✅ Project setup complete!");
console.log("👉 Run 'npm install' to update dependencies.");
console.log("👉 Run 'node seed.js' to populate your database.");
console.log("👉 Run 'npm run dev' to start the server.");
