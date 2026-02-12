import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getUploadsDir = () => {
  const envDir = process.env.UPLOADS_DIR;
  return envDir ? path.resolve(envDir) : path.join(process.cwd(), "uploads");
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

    const uploadsDir = getUploadsDir();
    const unsafePath = path.join(uploadsDir, ...params.path);
    const resolved = path.resolve(unsafePath);

    if (!resolved.startsWith(uploadsDir)) {
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
