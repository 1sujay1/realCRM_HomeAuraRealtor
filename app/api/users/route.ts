import { NextResponse } from 'next/server';
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
}