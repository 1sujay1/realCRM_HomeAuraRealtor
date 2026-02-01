import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { RealEstateUpdate } from "@/models/RealEstateUpdate";
import { validateRequest } from "@/lib/security";

export async function GET(req: Request) {
  const user: any = await validateRequest(req, "Leads", "read");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  const tag = searchParams.get("tag");

  const query: any = { isActive: true };
  if (location && location !== "All") query.location = location;
  if (tag) query.tag = tag;

  const updates = await RealEstateUpdate.find(query)
    .populate("project")
    .populate("createdBy", "name email")
    .sort({ isPinned: -1, createdAt: -1 });

  return NextResponse.json(updates);
}

export async function POST(req: Request) {
  const user: any = await validateRequest(req, "Projects", "create");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await connectDB();

    const newUpdate = await RealEstateUpdate.create({
      ...body,
      createdBy: user._id,
      createdByName: user.name,
    });

    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error) {
    console.error("Error creating real estate update:", error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const user: any = await validateRequest(req, "Projects", "update");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    await connectDB();

    const updatedUpdate = await RealEstateUpdate.findByIdAndUpdate(
      _id,
      updateData,
      { new: true },
    ).populate("project");

    if (!updatedUpdate) {
      return NextResponse.json({ error: "Update not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUpdate);
  } catch (error) {
    console.error("Error updating real estate update:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const user: any = await validateRequest(req, "Projects", "delete");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await connectDB();

  try {
    await RealEstateUpdate.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting real estate update:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
