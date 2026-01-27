import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { LeadActivity } from "@/models/LeadActivity";
import { validateRequest } from "@/lib/security";

export async function GET(req: Request) {
  const user: any = await validateRequest(req, "Leads", "read"); // Assuming activities are part of leads permission
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get("leadId");
  const query = leadId ? { leadId } : {};
  const activities = await LeadActivity.find(query)
    .populate("leadId")
    .sort({ createdAt: -1 });
  return NextResponse.json(activities);
}

export async function POST(req: Request) {
  const user: any = await validateRequest(req, "Leads", "create");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    await connectDB();
    const newActivity = await LeadActivity.create(body);
    return NextResponse.json(newActivity);
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
    const updatedActivity = await LeadActivity.findByIdAndUpdate(
      _id,
      updateData,
      { new: true },
    );
    return NextResponse.json(updatedActivity);
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
    await LeadActivity.deleteMany({ _id: { $in: ids.split(",") } });
  } else {
    await LeadActivity.findByIdAndDelete(id);
  }
  return NextResponse.json({ success: true });
}
