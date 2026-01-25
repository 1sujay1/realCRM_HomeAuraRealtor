import { NextResponse } from 'next/server';
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
}