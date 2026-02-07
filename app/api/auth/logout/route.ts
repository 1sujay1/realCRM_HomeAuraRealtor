import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Token } from "@/models/Token";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const token = cookies().get("token")?.value;
    if (token) {
      await connectDB();
      await Token.findOneAndUpdate({ token }, { isValid: false });
    }
    cookies().delete("token");

    // NextAuth handles session cleanup via signOut() on client
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
