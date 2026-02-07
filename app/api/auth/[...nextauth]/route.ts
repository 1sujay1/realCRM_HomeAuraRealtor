import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type JWT } from "next-auth/jwt";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Token } from "@/models/Token";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { getUserPermissions } from "@/lib/rbac";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key",
);

const defaultPermissions = {
  canDeleteLeads: false,
  canDeleteExpenses: false,
  canCreateExpenses: false,
  canEditExpenses: false,
  canViewExpenses: false,
  canManageUsers: false,
  canDeleteSiteVisits: false,
  canCreateProjects: false,
  canEditProjects: false,
  canDeleteProjects: false,
};

// Extend NextAuth User type
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "agent";
    isVerified: boolean;
    accessToken: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "admin" | "agent";
      isVerified: boolean;
      accessToken: string;
      permissions?: {
        canDeleteLeads?: boolean;
        canDeleteExpenses?: boolean;
        canCreateExpenses?: boolean;
        canEditExpenses?: boolean;
        canViewExpenses?: boolean;
        canManageUsers?: boolean;
        canDeleteSiteVisits?: boolean;
        canCreateProjects?: boolean;
        canEditProjects?: boolean;
        canDeleteProjects?: boolean;
      };
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "agent";
    isVerified: boolean;
    accessToken: string;
    permissions?: {
      canDeleteLeads?: boolean;
      canDeleteExpenses?: boolean;
      canCreateExpenses?: boolean;
      canEditExpenses?: boolean;
      canViewExpenses?: boolean;
      canManageUsers?: boolean;
      canDeleteSiteVisits?: boolean;
      canCreateProjects?: boolean;
      canEditProjects?: boolean;
      canDeleteProjects?: boolean;
    };
  }
}

const handler: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          await connectDB();

          // Create admin user if no users exist
          const userCount = await User.countDocuments();
          if (userCount === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash("admin123", salt);
            await User.create({
              name: "Super Admin",
              email: "admin@homeaurarealtor.com",
              password: hashed,
              role: "admin",
              isVerified: true,
            });
          }

          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("Invalid credentials");
          }

          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!isMatch) {
            throw new Error("Invalid credentials");
          }

          // Create JWT token
          const token = await new SignJWT({
            userId: user._id.toString(),
            role: user.role,
            name: user.name,
            email: user.email,
          })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(secret);

          // Store token in database
          await Token.create({
            userId: user._id,
            token: token,
            type: "access",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          });

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            accessToken: token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.accessToken = user.accessToken;

        // Add permissions from RBAC during login
        try {
          const permissions = getUserPermissions(user.role);
          token.permissions = permissions;
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      try {
        if (session.user && token) {
          session.user.id = token.id || "";
          session.user.role = token.role || "agent";
          session.user.isVerified = token.isVerified || false;
          session.user.accessToken = token.accessToken || "";
          session.user.permissions = token.permissions ?? defaultPermissions;
        }
      } catch (error) {
        console.error("Session callback error:", error);
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
};

export const GET = NextAuth(handler);
export const POST = NextAuth(handler);
