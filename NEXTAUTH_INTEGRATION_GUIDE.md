# NextAuth Integration Guide

## Overview

Your project has been successfully migrated from manual JWT token handling with `/api/auth/me` to **NextAuth.js** for robust session management. This provides better security, automatic session handling, and simplified API across your application.

## What Changed

### 1. **Removed Manual Auth Flow**

- ❌ Removed: Manual JWT token creation in `/api/auth/login`
- ❌ Removed: Manual session verification in `/api/auth/me`
- ✅ Replaced with: NextAuth's built-in authentication flow

### 2. **New NextAuth Configuration**

**File**: `app/api/auth/[...nextauth]/route.ts`

This file handles:

- Credential-based authentication (email/password)
- JWT token generation and verification
- Session creation with user data and permissions
- Automatic token refresh within 24-hour window

**Key Features:**

- Stores access token in NextAuth session
- Automatically includes RBAC permissions in session
- Handles database operations for token storage
- Creates default admin user if no users exist

### 3. **SessionProvider Setup**

**File**: `components/providers/AuthProvider.tsx`

Wraps your entire application with NextAuth's `SessionProvider`, enabling:

- `useSession()` hook throughout your app
- Automatic session state management
- Session persistence across page refreshes

**Usage in Layout**:

```tsx
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

## How to Use in Components

### Get Current User Session

```tsx
"use client";
import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();

  // status: 'loading' | 'authenticated' | 'unauthenticated'

  if (status === "loading") return <Spinner />;
  if (!session?.user) return null;

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <p>Role: {session.user.role}</p>
      <p>Permissions: {JSON.stringify(session.user.permissions)}</p>
    </div>
  );
}
```

### Sign In User

```tsx
"use client";
import { signIn } from "next-auth/react";

export default function LoginComponent() {
  const handleLogin = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Set to true to auto-redirect
    });

    if (result?.error) {
      console.error("Login failed:", result.error);
    } else {
      // Login successful - redirect manually if redirect: false
      window.location.href = "/dashboard";
    }
  };
}
```

### Sign Out User

```tsx
"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/", // Redirect to home after logout
    });
  };

  return <button onClick={handleLogout}>Sign Out</button>;
}
```

## Session Structure

The session object contains:

```typescript
session.user = {
  id: string;           // MongoDB user ID
  name: string;         // User's full name
  email: string;        // User's email
  role: 'admin' | 'agent';  // User role
  isVerified: boolean;   // Account verification status
  accessToken: string;   // JWT token for API calls
  permissions: string[]; // RBAC permissions array
}
```

## Protected Pages

The `MainLayout` component automatically:

- Checks if user is authenticated
- Redirects unauthenticated users to `/`
- Shows loading state while checking auth

**Usage:**

```tsx
// In app/(protected)/dashboard/page.tsx
import MainLayout from "@/components/layout/MainLayout";

export default function DashboardPage() {
  return (
    <MainLayout>
      <div>Your dashboard content here</div>
    </MainLayout>
  );
}
```

## API Route Protection

For server-side API routes, use the session to check authentication:

```typescript
// app/api/protected-endpoint/route.ts
import { getServerSession } from "next-auth";
import { handler } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(handler);

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Check permissions
  if (!session.user.permissions?.includes("edit_leads")) {
    return new Response("Forbidden", { status: 403 });
  }

  // Your protected logic here
  return Response.json({ data: "Protected data" });
}
```

## Updated Components

### Files Modified:

1. **`app/layout.tsx`** - Added AuthProvider wrapper
2. **`components/layout/MainLayout.tsx`** - Uses `useSession()` hook
3. **`components/layout/Sidebar.tsx`** - Uses `signOut()` for logout
4. **`components/site-visits/SiteVisitsPage.tsx`** - Uses `useSession()` hook
5. **`app/page.tsx`** - Uses `signIn()` for authentication
6. **`app/api/auth/login/route.ts`** - Updated with placeholder (auth now in [...nextauth])
7. **`app/api/auth/logout/route.ts`** - Updated to work with NextAuth

## Environment Variables

Ensure these are set in `.env.local`:

```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3015
JWT_SECRET=your-jwt-secret-key
```

- `NEXTAUTH_SECRET`: Used to encrypt/sign JWT tokens and cookies
- `NEXTAUTH_URL`: Your app's base URL (important for production)
- `JWT_SECRET`: Your existing JWT secret (reused for NextAuth)

## Migration Checklist

✅ NextAuth installed
✅ `[...nextauth]/route.ts` created
✅ `AuthProvider` component created
✅ Root layout wrapped with `AuthProvider`
✅ `MainLayout.tsx` updated with `useSession()`
✅ `Sidebar.tsx` updated with `signOut()`
✅ `page.tsx` (login) updated with `signIn()`
✅ `SiteVisitsPage.tsx` updated with `useSession()`
✅ Login route deprecated (auth now in NextAuth)
✅ Logout route updated

## Common Tasks

### Check if User is Admin

```tsx
const { data: session } = useSession();
const isAdmin = session?.user?.role === "admin";
```

### Check User Permissions

```tsx
const { data: session } = useSession();
const canEditLeads = session?.user?.permissions?.includes("edit_leads");
```

### Get Access Token for External API

```tsx
const { data: session } = useSession();
const token = session?.user?.accessToken;

// Use in fetch headers
const response = await fetch("/api/endpoint", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Refresh Session Manually

```tsx
"use client";
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session, update } = useSession();

  const refreshSession = async () => {
    await update(); // Refreshes session from backend
  };
}
```

## Troubleshooting

### Session is undefined

- Ensure component is wrapped with `AuthProvider`
- Check that `useSession()` is called in client component (`'use client'`)

### Redirect loop after login

- Verify `NEXTAUTH_URL` is set correctly
- Check callback URLs in NextAuth config

### Token expires too quickly

- Default is 24 hours, adjust in `[...nextauth].ts` if needed
- Modify `maxAge` in session config

### User data not showing

- Verify user object is being returned from authorize callback
- Check RBAC permissions are being loaded in session callback

## Next Steps

1. Add environment variables to `.env.local`
2. Test login with admin credentials (admin@brokerflow.com / admin123)
3. Update other components that fetch user data to use `useSession()`
4. Remove any remaining manual `/api/auth/me` calls
5. Consider adding OAuth providers (Google, GitHub, etc.)

## Support

For NextAuth documentation: https://next-auth.js.org/
For your specific setup questions, refer to the [...nextauth] configuration file.
