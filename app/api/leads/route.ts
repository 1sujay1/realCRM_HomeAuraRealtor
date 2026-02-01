import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Lead } from "@/models/Lead";
import { validateRequest } from "@/lib/security";

export async function GET(req: Request) {
  const user: any = await validateRequest(req, "Leads", "read");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const query: any = {};
  if (status) query.status = status;

  const leads = await Lead.find(query).sort({ createdAt: -1 });
  return NextResponse.json(leads);
}
export async function POST(req: Request) {
  const user: any = await validateRequest(req, "Leads", "create");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    await connectDB();
    const newLead = await Lead.create({
      ...body,
      createdBy: user.userId,
      createdByName: user.name || "System",
    });
    return NextResponse.json(newLead);
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
export async function PUT(req: Request) {
  const user: any = await validateRequest(req, "Leads", "update");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;
    await connectDB();
    const updatedLead = await Lead.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    return NextResponse.json(updatedLead);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}
export async function DELETE(req: Request) {
  const user: any = await validateRequest(req, "Leads", "delete");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const ids = searchParams.get("ids");
  await connectDB();
  if (ids) {
    await Lead.deleteMany({ _id: { $in: ids.split(",") } });
  } else {
    await Lead.findByIdAndDelete(id);
  }
  return NextResponse.json({ success: true });
}
