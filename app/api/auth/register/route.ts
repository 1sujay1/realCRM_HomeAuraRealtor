import { NextResponse } from 'next/server';
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
}