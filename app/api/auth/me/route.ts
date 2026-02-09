import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { getUserPermissions } from "@/lib/rbac";

export async function GET(req: Request) {
  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  });

  if (!token) return NextResponse.json({ user: null });

  try {
    await connectDB();
    const userId =
      (token as any).id || (token as any).userId || (token as any).sub;
    const user = await User.findById(userId).select("-password");
    if (!user) return NextResponse.json({ user: null });
    const permissions = getUserPermissions(user.role);
    return NextResponse.json({ user: { ...user.toObject(), permissions } });
  } catch (e) {
    return NextResponse.json({ user: null });
  }
}
