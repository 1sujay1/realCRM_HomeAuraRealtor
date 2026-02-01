import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { RealEstateUpdate } from "@/models/RealEstateUpdate";
import { validateRequest } from "@/lib/security";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user: any = await validateRequest(req, "Leads", "read");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const update = await RealEstateUpdate.findById(params.id)
      .populate("project")
      .populate("createdBy", "name email");

    if (!update) {
      return NextResponse.json({ error: "Update not found" }, { status: 404 });
    }

    return NextResponse.json(update);
  } catch (error) {
    console.error("Error fetching real estate update:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 400 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user: any = await validateRequest(req, "Projects", "update");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await connectDB();

    // Verify ownership
    const existingUpdate = await RealEstateUpdate.findById(params.id);
    if (!existingUpdate) {
      return NextResponse.json({ error: "Update not found" }, { status: 404 });
    }

    if (
      existingUpdate.createdBy.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "You can only edit your own updates" },
        { status: 403 },
      );
    }

    const updatedUpdate = await RealEstateUpdate.findByIdAndUpdate(
      params.id,
      body,
      { new: true },
    )
      .populate("project")
      .populate("createdBy", "name email");

    return NextResponse.json(updatedUpdate);
  } catch (error) {
    console.error("Error updating real estate update:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const user: any = await validateRequest(req, "Projects", "delete");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    await connectDB();

    // Verify ownership
    const update = await RealEstateUpdate.findById(params.id);
    if (!update) {
      return NextResponse.json({ error: "Update not found" }, { status: 404 });
    }

    if (
      update.createdBy.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "You can only delete your own updates" },
        { status: 403 },
      );
    }

    await RealEstateUpdate.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Update deleted" });
  } catch (error) {
    console.error("Error deleting real estate update:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
