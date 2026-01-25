import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Token } from '@/models/Token';
import { cookies } from 'next/headers';
export async function POST() {
  const token = cookies().get('token')?.value;
  if(token) { await connectDB(); await Token.findOneAndUpdate({ token }, { isValid: false }); }
  cookies().delete('token');
  return NextResponse.json({ success: true });
}