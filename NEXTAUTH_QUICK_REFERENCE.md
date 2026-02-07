# NextAuth Quick Reference

## 🔑 Quick Commands

### Import NextAuth Hooks

```tsx
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
```

## 📖 Common Code Patterns

### 1️⃣ Protected Component

```tsx
"use client";
import { useSession } from "next-auth/react";

export default function ProtectedComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session?.user) return <div>Not authenticated</div>;

  return <div>Hello {session.user.name}!</div>;
}
```

### 2️⃣ Protected Page with Redirect

```tsx
import MainLayout from "@/components/layout/MainLayout";

export default function ProtectedPage() {
  return <MainLayout>{/* Your page content */}</MainLayout>;
}
// Automatically checks auth and redirects to / if not authenticated
```

### 3️⃣ Login Form

```tsx
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### 4️⃣ Logout Button

```tsx
"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
  );
}
```

### 5️⃣ Check User Role

```tsx
"use client";
import { useSession } from "next-auth/react";

export default function AdminOnlyComponent() {
  const { data: session } = useSession();

  if (session?.user?.role !== "admin") {
    return <div>Access Denied</div>;
  }

  return <div>Admin Panel</div>;
}
```

### 6️⃣ Check Permissions

```tsx
"use client";
import { useSession } from "next-auth/react";

export default function EditLeadButton() {
  const { data: session } = useSession();

  const canEdit = session?.user?.permissions?.includes("edit_leads");

  if (!canEdit) return null;

  return <button>Edit Lead</button>;
}
```

### 7️⃣ Protected API Route

```typescript
// app/api/protected/route.ts
import { getServerSession } from "next-auth";
import { handler } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(handler);

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Your protected logic
  return Response.json({ success: true });
}
```

### 8️⃣ Get Access Token in API Call

```tsx
"use client";
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();

  const fetchData = async () => {
    const response = await fetch("/api/protected", {
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
    return response.json();
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

## 📊 Session Object Structure

```typescript
session = {
  user: {
    id: string;              // MongoDB user ID
    name: string;            // User name
    email: string;           // User email
    role: 'admin' | 'agent'; // User role
    isVerified: boolean;     // Account verification
    accessToken: string;     // JWT token
    permissions: string[];   // RBAC permissions
  },
  expires: string;           // Expiration timestamp
}
```

## 🎯 useSession Hook States

```tsx
const { data: session, status, update } = useSession();

// status can be:
// - 'loading'       : Session is being loaded
// - 'authenticated' : User is logged in (session.user exists)
// - 'unauthenticated' : No session (session is null)

// update() : Refresh session from server
await update();
```

## 🚦 Status Checks

```tsx
// Check if authenticated
if (status === "authenticated") {
}

// Check if loading
if (status === "loading") {
}

// Check if not authenticated
if (!session?.user) {
}

// Check if admin
if (session?.user?.role === "admin") {
}

// Check permission
if (session?.user?.permissions?.includes("permission_name")) {
}
```

## 🔧 Environment Setup

```env
# .env.local
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3015
JWT_SECRET=your-existing-jwt-secret
```

## 📝 Default Admin Credentials

```
Email: admin@brokerflow.com
Password: admin123
```

## 🔄 API Endpoints

### Login (via signIn hook)

```tsx
await signIn("credentials", { email, password, redirect: false });
```

### Logout (via signOut hook)

```tsx
await signOut({ callbackUrl: "/" });
```

### Get Session (via useSession hook)

```tsx
const { data: session, status } = useSession();
```

## ✅ Checklist for New Components

- [ ] Import `useSession` from 'next-auth/react'
- [ ] Call `const { data: session, status } = useSession()`
- [ ] Handle `status === 'loading'` state
- [ ] Check `session?.user` exists
- [ ] Access user data via `session.user.{property}`
- [ ] Replace manual `/api/auth/me` calls
- [ ] Remove useState for user data (use session instead)

## 🐛 Debugging

### Check Session in Console

```javascript
// In browser console
import { useSession } from "next-auth/react";
// Then use: const { data: session } = useSession(); console.log(session);
```

### Verify NextAuth is Running

```
Check: http://localhost:3015/api/auth/signin
Should show NextAuth signin page
```

### Check Environment Variables

```
Make sure NEXTAUTH_SECRET, NEXTAUTH_URL, JWT_SECRET are set
Restart dev server after changing env vars
```

## 📚 Learn More

- **NextAuth Docs**: https://next-auth.js.org/
- **NextAuth Providers**: https://next-auth.js.org/providers/
- **NextAuth Examples**: https://next-auth.js.org/getting-started/example

## 💡 Tips & Tricks

1. **Auto-refresh session**: `update()` function refetches from server
2. **Conditional rendering**: Always check `session?.user` before accessing properties
3. **Type safety**: Use TypeScript interfaces for extended session
4. **Performance**: Cache session in component state if needed
5. **Security**: Never expose access tokens in URLs, use in headers only
