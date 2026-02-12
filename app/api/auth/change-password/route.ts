import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing current or new password" },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 },
      );
    }

    await connectDB();
    const userId =
      (token as any).id || (token as any).userId || (token as any).sub;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 },
    );
  }
}
