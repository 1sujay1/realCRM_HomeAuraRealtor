# NextAuth Authentication Flow

## 🔐 Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Flow                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ 1. INITIALIZATION                                                 │
│                                                                   │
│  app/layout.tsx                                                   │
│  ├─ Wraps app with <AuthProvider>                               │
│  └─ Enables useSession() in all client components               │
│                                                                   │
│  components/providers/AuthProvider.tsx                            │
│  └─ Provides NextAuth SessionProvider context                   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 2. LOGIN FLOW                                                     │
│                                                                   │
│  User enters: email & password                                    │
│  ↓                                                               │
│  app/page.tsx calls: signIn('credentials', {email, password})   │
│  ↓                                                               │
│  app/api/auth/[...nextauth]/route.ts                            │
│  ├─ Validates credentials                                       │
│  ├─ Creates JWT token                                           │
│  ├─ Stores token in database                                    │
│  └─ Returns user data with token                                │
│  ↓                                                               │
│  NextAuth creates JWT session cookie                            │
│  ↓                                                               │
│  Redirect to: /dashboard                                        │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 3. SESSION MANAGEMENT                                             │
│                                                                   │
│  Client-side:                                                    │
│  ├─ useSession() → returns { data: session, status }            │
│  ├─ status: 'loading' | 'authenticated' | 'unauthenticated'    │
│  └─ session.user contains: id, name, email, role, permissions  │
│                                                                   │
│  Session stored in:                                              │
│  ├─ NextAuth JWT cookie (httpOnly, secure)                     │
│  └─ Browser memory (for useSession hook)                        │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 4. PROTECTED PAGE ACCESS                                          │
│                                                                   │
│  Route: /dashboard (protected)                                   │
│  ↓                                                               │
│  MainLayout component checks:                                    │
│  ├─ const { data: session, status } = useSession()             │
│  ├─ if (status === 'unauthenticated') redirect to '/'          │
│  ├─ if (status === 'loading') show spinner                     │
│  └─ if (session?.user) show content                            │
│  ↓                                                               │
│  Access allowed ✓                                               │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 5. API REQUESTS                                                   │
│                                                                   │
│  Protected API route:                                            │
│  ├─ const session = await getServerSession(handler)             │
│  ├─ if (!session?.user) return 401 Unauthorized                 │
│  └─ Process request with user data                              │
│                                                                   │
│  Client-side fetch:                                              │
│  ├─ const { data: session } = useSession()                      │
│  ├─ const token = session?.user?.accessToken                    │
│  └─ fetch(url, { headers: { Authorization: Bearer token } })   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 6. LOGOUT FLOW                                                    │
│                                                                   │
│  User clicks: "Sign Out" button                                  │
│  ↓                                                               │
│  Sidebar component calls: signOut({ callbackUrl: '/' })        │
│  ↓                                                               │
│  NextAuth clears session:                                        │
│  ├─ Deletes JWT cookie                                          │
│  ├─ Clears browser memory                                       │
│  └─ Marks token as invalid in database                          │
│  ↓                                                               │
│  Redirect to: / (login page)                                    │
└──────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │
         │ 1. signIn('credentials', {email, password})
         ↓
┌─────────────────────────────────┐
│ app/api/auth/[...nextauth]      │
│ Credentials Provider             │
└────────┬────────────────────────┘
         │
         │ 2. Validate credentials + Create JWT
         ↓
┌─────────────────────────────────┐
│ MongoDB Database                 │
│ ├─ Check User credentials       │
│ ├─ Store JWT Token              │
│ ├─ Get User data                │
│ └─ Get RBAC Permissions         │
└────────┬────────────────────────┘
         │
         │ 3. Return User + Token
         ↓
┌─────────────────────────────────┐
│ NextAuth JWT Callback            │
│ ├─ Create JWT Session            │
│ ├─ Encrypt Token                 │
│ └─ Set httpOnly Cookie          │
└────────┬────────────────────────┘
         │
         │ 4. Set Session Cookie + Redirect
         ↓
┌─────────────────┐
│  User Browser   │
│  ├─ JWT Cookie  │
│  └─ /dashboard  │
└────────┬────────┘
         │
         │ 5. useSession() on page load
         ↓
┌─────────────────────────────────┐
│ Session Callback                │
│ ├─ Read JWT Cookie              │
│ ├─ Decrypt + Verify Token       │
│ ├─ Get User from DB             │
│ └─ Include Permissions          │
└────────┬────────────────────────┘
         │
         │ 6. Return Session Object
         ↓
┌─────────────────┐
│  React Component│
│  session.user   │
└─────────────────┘
```

## 🔄 Session Object Lifecycle

```
Create Session
    ↓
┌─────────────────────────────────────────┐
│ JWT Callback (authorize success)        │
│ ├─ Receives: user from authorize       │
│ ├─ Creates: token with userId, role    │
│ ├─ Adds: accessToken, role, isVerified │
│ └─ Returns: token                       │
└────────┬────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ Session Callback (on every request)     │
│ ├─ Receives: token from JWT             │
│ ├─ Adds: token data to session.user     │
│ ├─ Queries: DB for permissions          │
│ ├─ Adds: permissions to session.user    │
│ └─ Returns: session with full data      │
└────────┬────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ Client Receives                         │
│ session.user = {                        │
│   id: "...",                           │
│   name: "...",                         │
│   email: "...",                        │
│   role: "admin" | "agent",             │
│   isVerified: boolean,                 │
│   accessToken: "...",                  │
│   permissions: [...]                   │
│ }                                       │
└────────┬────────────────────────────────┘
         ↓
      Use in Components
```

## 🛡️ Security Layers

```
┌──────────────────────────────────────┐
│ Layer 1: Password Security            │
│ ├─ Hashed with bcryptjs              │
│ ├─ Salted with 10 rounds             │
│ └─ Never stored in plain text        │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Layer 2: JWT Token Security           │
│ ├─ Signed with HS256 algorithm       │
│ ├─ Encrypted with NEXTAUTH_SECRET    │
│ ├─ 24-hour expiration                │
│ └─ Verified on every request         │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Layer 3: Cookie Security              │
│ ├─ httpOnly: Cannot access via JS    │
│ ├─ Secure: HTTPS only (production)   │
│ ├─ SameSite: CSRF protection         │
│ └─ Path: / (entire application)      │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Layer 4: Session Validation           │
│ ├─ Verified on every page load       │
│ ├─ Token checked against secret      │
│ ├─ Permissions loaded from DB        │
│ └─ Invalid tokens rejected           │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Layer 5: API Protection               │
│ ├─ getServerSession() required       │
│ ├─ No unauthenticated access         │
│ ├─ Role-based authorization          │
│ └─ Permission-based access control   │
└──────────────────────────────────────┘
```

## 🔑 Component Relationship

```
app/
├── layout.tsx
│   └── <AuthProvider>  ← Enables useSession() everywhere
│       │
│       ├── app/page.tsx (Login)
│       │   └── signIn() calls NextAuth
│       │
│       └── app/(protected)/
│           ├── layout.tsx
│           │   └── <MainLayout>  ← Checks authentication
│           │       ├── <Sidebar>  ← signOut()
│           │       │
│           │       ├── dashboard/page.tsx  ← useSession()
│           │       ├── leads/page.tsx      ← useSession()
│           │       ├── projects/page.tsx   ← useSession()
│           │       └── ...
│
├── api/
│   └── auth/
│       ├── [...nextauth]/route.ts  ← Auth handler
│       ├── login/route.ts          ← Deprecated (kept for reference)
│       ├── logout/route.ts         ← Helper endpoint
│       └── me/route.ts             ← Deprecated (replaced by useSession)
│
└── components/
    └── providers/
        └── AuthProvider.tsx        ← SessionProvider wrapper
```

## 📱 Mobile-First Considerations

```
Desktop/Mobile Layout
    ↓
MainLayout (useSession)
    ├─ Check status
    ├─ Show spinner if loading
    └─ Redirect if unauthenticated
    ↓
Protected Content
    └─ Access session.user everywhere
```

## ⏰ Session Timeline

```
0 min     : User logs in
          └─ JWT created, cookie set

0-24h    : Session active
          ├─ Cookie sent with every request
          └─ Session validated on each page load

24h      : Session expires
          ├─ JWT becomes invalid
          ├─ useSession() returns status: 'unauthenticated'
          └─ User redirected to login page

Logout   : Immediate session termination
          ├─ Cookie deleted
          ├─ Token marked as invalid in DB
          └─ User redirected to home
```
