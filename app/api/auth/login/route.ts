import { NextResponse } from 'next/server';
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
}