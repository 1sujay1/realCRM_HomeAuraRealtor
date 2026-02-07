# NextAuth Implementation Checklist

## ✅ Completed Tasks

### Core Setup

- [x] Install `next-auth@latest` package
- [x] Create `[...nextauth]/route.ts` configuration file
- [x] Create `AuthProvider.tsx` component
- [x] Update root `layout.tsx` with AuthProvider wrapper

### Components Updated

- [x] `MainLayout.tsx` - Replaced fetch with `useSession()`
- [x] `Sidebar.tsx` - Replaced logout fetch with `signOut()`
- [x] `page.tsx` (Login) - Replaced login fetch with `signIn()`
- [x] `SiteVisitsPage.tsx` - Replaced fetch with `useSession()`

### API Routes Updated

- [x] `app/api/auth/login/route.ts` - Deprecated (auth in NextAuth now)
- [x] `app/api/auth/logout/route.ts` - Updated for NextAuth
- [x] `app/api/auth/me/route.ts` - No longer needed (replaced by useSession)

### Documentation Created

- [x] `NEXTAUTH_INTEGRATION_GUIDE.md` - Comprehensive usage guide
- [x] `NEXTAUTH_MIGRATION_SUMMARY.md` - Migration details
- [x] `NEXTAUTH_QUICK_REFERENCE.md` - Code patterns and examples
- [x] `NEXTAUTH_ARCHITECTURE.md` - Flow diagrams and architecture

---

## ⏳ Next Steps (Required)

### 1. Environment Setup

- [ ] Open `.env.local` file
- [ ] Add these variables:

```env
NEXTAUTH_SECRET=your-generated-secret-key-here
NEXTAUTH_URL=http://localhost:3015
JWT_SECRET=your-existing-jwt-secret
```

**How to generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
# Or use any random string generator
```

### 2. Test Authentication

- [ ] Stop dev server: `Ctrl+C`
- [ ] Restart dev server: `npm run dev`
- [ ] Go to: `http://localhost:3015`
- [ ] Login with:
  - Email: `admin@brokerflow.com`
  - Password: `admin123`
- [ ] Verify redirect to `/dashboard`
- [ ] Check session in browser DevTools

### 3. Component Updates Needed

Review these files and update remaining `fetch('/api/auth/me')` calls:

```bash
# Files still using old auth pattern
- setup.js (lines 919, 1086, 1281, 1445, 1543)
  → Update each to use useSession() hook

- Any other dashboard/page components
  → Search workspace for "fetch('/api/auth/me')"
  → Replace with useSession() pattern
```

**Example update pattern:**

```tsx
// BEFORE (Old)
const [user, setUser] = useState(null);
useEffect(() => {
  fetch("/api/auth/me")
    .then((res) => res.json())
    .then((data) => setUser(data.user));
}, []);

// AFTER (New)
const { data: session } = useSession();
// Use session.user instead of user
```

---

## 🧪 Testing Checklist

### Login Flow

- [ ] Navigate to `/` (home page)
- [ ] Try login with wrong credentials → Should show error
- [ ] Try login with `admin@brokerflow.com` / `admin123` → Should redirect to `/dashboard`
- [ ] Verify session is stored (check browser DevTools → Application → Cookies)

### Session Management

- [ ] Refresh page → Should stay logged in (session persists)
- [ ] Check `useSession()` returns user data
- [ ] Verify `session.user.role` is correct ('admin' or 'agent')
- [ ] Verify `session.user.permissions` is an array

### Protected Routes

- [ ] Try accessing `/dashboard` while logged in → Should work
- [ ] Try accessing `/dashboard` while logged out → Should redirect to `/`
- [ ] Try accessing `/leads` while logged in → Should work
- [ ] Try accessing `/site-visits` while logged in → Should work

### Logout Flow

- [ ] Click "Sign Out" button in sidebar
- [ ] Should redirect to `/` (home page)
- [ ] Session cookie should be deleted
- [ ] Try accessing `/dashboard` → Should redirect to `/`

### Admin-Specific Features

- [ ] Login with admin account
- [ ] Verify `/users` management link appears in sidebar
- [ ] Verify `/expenses` link appears in sidebar
- [ ] Non-admin user shouldn't see these links

### Permission System

- [ ] Verify `session.user.permissions` includes correct permissions
- [ ] Test conditional rendering based on permissions
- [ ] Verify `user?.role === 'admin'` works correctly

---

## 🔍 Verification Commands

### 1. Check NextAuth Installation

```bash
npm list next-auth
# Should show: next-auth@4.x.x (or higher)
```

### 2. Verify Routes Exist

```bash
# These should all exist:
- app/api/auth/[...nextauth]/route.ts ✓
- components/providers/AuthProvider.tsx ✓
```

### 3. Check Imports Work

In your browser console:

```javascript
// Should work without errors
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
```

### 4. Test API Endpoint

```bash
curl http://localhost:3015/api/auth/signin
# Should return NextAuth signin page HTML
```

---

## 🐛 Common Issues & Solutions

### Issue: "useSession is not a function"

**Solution:**

- Ensure component has `'use client'` directive
- Ensure component is inside `<AuthProvider>`
- Check that `AuthProvider` is in root `layout.tsx`

### Issue: Session is undefined

**Solution:**

- Check if in client component (`'use client'`)
- Verify `AuthProvider` wraps the component
- Check browser console for errors

### Issue: Redirect loop on login

**Solution:**

- Verify `.env.local` has `NEXTAUTH_URL` set
- Restart dev server after env changes
- Clear browser cookies and try again

### Issue: Can't login with admin credentials

**Solution:**

- Check if user exists in MongoDB (run seed if needed)
- Verify password is `admin123` (or what was seeded)
- Check database connection works

### Issue: "JWT secret is not set"

**Solution:**

- Add `NEXTAUTH_SECRET` to `.env.local`
- Or set `JWT_SECRET` if using that
- Restart dev server

### Issue: Session expires immediately

**Solution:**

- Check `maxAge` in `[...nextauth]/route.ts` (should be 24h)
- Verify `NEXTAUTH_SECRET` is consistent
- Check server time is correct

---

## 📚 Resources

- **Complete Guide:** `NEXTAUTH_INTEGRATION_GUIDE.md`
- **Quick Reference:** `NEXTAUTH_QUICK_REFERENCE.md`
- **Architecture:** `NEXTAUTH_ARCHITECTURE.md`
- **NextAuth Docs:** https://next-auth.js.org/

---

## 🔐 Security Checklist

- [ ] `NEXTAUTH_SECRET` is set to a random string
- [ ] `NEXTAUTH_URL` matches your deployment URL
- [ ] Passwords are hashed with bcryptjs
- [ ] Tokens are encrypted with JWT
- [ ] Cookies are httpOnly (secure by default)
- [ ] Session expires after 24 hours
- [ ] Logout clears session properly
- [ ] Protected routes require authentication
- [ ] API routes check `getServerSession()`
- [ ] RBAC permissions are enforced

---

## 📋 Final Checklist Before Deploy

- [ ] All environment variables set
- [ ] No console errors on login page
- [ ] Login works with admin credentials
- [ ] Dashboard loads after login
- [ ] Logout works and redirects to home
- [ ] Session persists on page refresh
- [ ] Protected routes redirect to home when not logged in
- [ ] User data displays correctly (name, role, email)
- [ ] Admin-only features visible to admin only
- [ ] All tests in "Testing Checklist" pass
- [ ] No remaining `fetch('/api/auth/me')` calls
- [ ] `setup.js` and other old auth calls updated

---

## 🎯 Success Criteria

✅ When all items are completed, you should have:

1. ✓ Fully functional NextAuth authentication
2. ✓ Secure JWT-based sessions
3. ✓ User data available via `useSession()` hook
4. ✓ Protected routes that redirect unauthenticated users
5. ✓ Admin role-based access control
6. ✓ Automatic session persistence
7. ✓ Clean, maintainable authentication code
8. ✓ No manual auth fetch calls in components

---

## 📞 Support

If you encounter issues:

1. Check `NEXTAUTH_INTEGRATION_GUIDE.md` troubleshooting section
2. Review `NEXTAUTH_QUICK_REFERENCE.md` for patterns
3. Check `NEXTAUTH_ARCHITECTURE.md` for understanding flow
4. Visit https://next-auth.js.org/getting-started/introduction

---

**Status:** 🟡 In Progress
**Current Step:** Environment Setup & Testing
**Estimated Time:** 30-45 minutes to complete all testing

Last Updated: 2026-02-07
