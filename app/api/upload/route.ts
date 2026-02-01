import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName, data } = body as { fileName: string; data: string };
    if (!fileName || !data) {
      return NextResponse.json(
        { error: "Missing fileName or data" },
        { status: 400 },
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // data is expected to be a data URL like: data:application/pdf;base64,....
    const matches = data.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      );
    }
    const mime = matches[1];
    const b64 = matches[2];

    const timestamp = Date.now();
    // sanitize filename
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const outName = `${timestamp}_${safeName}`;
    const outPath = path.join(uploadsDir, outName);

    const buffer = Buffer.from(b64, "base64");
    await fs.writeFile(outPath, buffer);

    const url = `/uploads/${outName}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
