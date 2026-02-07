import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Login is now handled by NextAuth [...nextauth] route
    // This endpoint is kept for backward compatibility but no longer needed
    return NextResponse.json(
      {
        error: "Use NextAuth signin instead",
        message: "Please use signIn from next-auth/react",
      },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
