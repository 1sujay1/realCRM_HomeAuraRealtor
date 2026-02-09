import { getToken } from "next-auth/jwt";
import connectDB from "./db";
import { Token } from "@/models/Token";
import { checkPermission, Module, Action } from "./rbac";

export async function validateRequest(
  req: Request,
  module: Module,
  action: Action,
) {
  try {
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    });

    if (!token) return null;

    if (token.accessToken) {
      await connectDB();
      const activeToken = await Token.findOne({
        token: token.accessToken,
        isValid: true,
        expiresAt: { $gt: new Date() },
      });
      if (!activeToken) return null;
    }

    if (!checkPermission(token.role as string, module, action))
      return "forbidden";

    // Normalize token to include `_id` for compatibility with existing handlers
    const normalized: any = {
      ...(token as any),
      _id: (token as any).id || (token as any).userId || (token as any).sub,
    };
    return normalized;
  } catch (error) {
    return null;
  }
}
