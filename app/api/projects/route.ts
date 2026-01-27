// app/api/projects/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { validateRequest } from "@/lib/security";

export async function GET(req: Request) {
  const user: any = await validateRequest(req, "Projects", "read");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  const query: any = { isDeleted: false };
  if (search) {
    query.$text = { $search: search };
  }

  const projects = await Project.find(query).sort({ createdAt: -1 });

  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const user: any = await validateRequest(req, "Projects", "create");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await connectDB();

    const newProject = await Project.create({
      ...body,
      createdBy: user._id,
      createdByName: user.name,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
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

    const updatedProject = await Project.findByIdAndUpdate(
      _id,
      { ...updateData, updatedBy: user._id, updatedByName: user.name },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const user: any = await validateRequest(req, "Projects", "delete");
  if (!user || user === "forbidden")
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const ids = searchParams.get("ids");

  await connectDB();

  try {
    if (ids) {
      // Soft delete multiple projects
      await Project.updateMany(
        { _id: { $in: ids.split(",") } },
        { 
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: user._id,
          deletedByName: user.name
        }
      );
    } else if (id) {
      // Soft delete single project
      await Project.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user._id,
        deletedByName: user.name
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}