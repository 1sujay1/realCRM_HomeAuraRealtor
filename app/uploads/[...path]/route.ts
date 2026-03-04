import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getUploadsDir = () => {
  // Use UPLOADS_DIR env var if set (production)
  // Otherwise use public/uploads for local development
  const envDir = process.env.UPLOADS_DIR;
  if (envDir) {
    return path.resolve(envDir);
  }
  // Local: use public/uploads (ignored by git)
  return path.join(process.cwd(), "public", "uploads");
};

const getMimeType = (filePath: string) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
};

export async function GET(
  _req: Request,
  { params }: { params: { path: string[] } },
) {
  try {
    if (!params?.path?.length) {
      return NextResponse.json({ error: "Missing file path" }, { status: 400 });
    }

    const uploadsDir = path.resolve(getUploadsDir());
    const unsafePath = path.join(uploadsDir, ...params.path);
    const resolved = path.resolve(unsafePath);

    // Normalize paths for Windows compatibility
    const normalizedUploadsDir = uploadsDir.toLowerCase().replace(/\\/g, '/');
    const normalizedResolved = resolved.toLowerCase().replace(/\\/g, '/');

    if (!normalizedResolved.startsWith(normalizedUploadsDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    const file = await fs.readFile(resolved);
    const contentType = getMimeType(resolved);

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
