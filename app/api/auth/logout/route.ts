import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Token } from "@/models/Token";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
  try {
    const sessionToken = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    });

    if (sessionToken?.accessToken) {
      await connectDB();
      await Token.findOneAndUpdate(
        { token: sessionToken.accessToken },
        { isValid: false },
      );
    }

    // NextAuth handles session cleanup via signOut() on client
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
