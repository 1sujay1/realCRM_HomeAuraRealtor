import { NextResponse } from 'next/server';
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
}