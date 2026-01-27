import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { SiteVisit } from "@/models/SiteVisit";
import { validateRequest } from "@/lib/security";

export async function GET(req: Request) {
  const user: any = await validateRequest(req, "Leads", "read");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get("leadId");

  const query = leadId ? { lead: leadId } : {};

  const siteVisits = await SiteVisit.find(query)
    .populate("lead")
    .sort({ createdAt: -1 });

  return NextResponse.json(siteVisits);
}

export async function POST(req: Request) {
  const user: any = await validateRequest(req, "Leads", "create");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await connectDB();

    const newSiteVisit = await SiteVisit.create({
      ...body,
      createdBy: user._id,
      createdByName: user.name,
    });

    return NextResponse.json(newSiteVisit);
  } catch (error) {
    console.error("Error creating site visit:", error);
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

    const updatedSiteVisit = await SiteVisit.findByIdAndUpdate(
      _id,
      updateData,
      { new: true },
    ).populate("lead");

    if (!updatedSiteVisit) {
      return NextResponse.json(
        { error: "Site visit not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedSiteVisit);
  } catch (error) {
    console.error("Error updating site visit:", error);
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

  try {
    if (ids) {
      await SiteVisit.deleteMany({ _id: { $in: ids.split(",") } });
    } else {
      await SiteVisit.findByIdAndDelete(id);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting site visit:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
