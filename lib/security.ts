import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from './db';
import { Token } from '@/models/Token';
import { checkPermission, Module, Action } from './rbac';

export async function validateRequest(req: Request, module: Module, action: Action) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return null;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    await connectDB();
    const activeToken = await Token.findOne({ token: token, isValid: true, expiresAt: { $gt: new Date() } });
    if (!activeToken) return null;
    if (!checkPermission(payload.role as string, module, action)) return 'forbidden';
    return payload;
  } catch (error) { return null; }
}