# Deployment Guide - Lordnine Tools

## Overview
Admin panel route dan file sudah dikonfigurasi untuk **HANYA tersedia di development mode**. Saat deploy ke production, admin route akan otomatis hilang.

---

## 🔒 Security Setup (Already Done)

### 1. **Admin Route - Development Only**
```tsx
// App.tsx
const Admin = import.meta.env.DEV ? React.lazy(() => import('./pages/Admin')) : null;

// Route hanya ada jika DEV mode
{import.meta.env.DEV && Admin && (
  <Route path="admin" element={<Admin />} />
)}
```

### 2. **Navbar Link - Development Only**
```tsx
// Navbar.tsx
...(import.meta.env.DEV && settings.isAdmin ? [{ name: 'Admin', path: '/admin' }] : [])
```

### 3. **Admin.tsx in .gitignore**
```gitignore
# .gitignore
src/pages/Admin.tsx
```

---

## 📦 Deployment Steps

### Option 1: **Build untuk Production (Recommended)**

```bash
# Di local (development)
npm run build
```

**Hasil:**
- Folder `dist/` berisi production build
- Admin route **TIDAK ada** dalam build
- Admin.tsx **TIDAK di-bundle** (karena conditional import)
- File size lebih kecil

**Upload ke hosting:**
```bash
# Upload semua isi folder dist/ ke hosting
# Contoh struktur:
dist/
  ├── index.html
  ├── assets/
  │   ├── index-[hash].js
  │   └── index-[hash].css
  └── ...
```

### Option 2: **Deploy dari Repository**

Jika hosting support auto-build (Vercel, Netlify, etc):

1. **Push ke Git:**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push
   ```

2. **Admin.tsx tidak akan ter-commit** (sudah di gitignore)

3. **Hosting akan build otomatis:**
   - Environment: `production`
   - `import.meta.env.DEV = false`
   - Admin route tidak akan ada

---

## ✅ Validation

### Before Deploy (Local Development)
```bash
# Test development mode
npm run dev
# ✅ Admin link terlihat (jika isAdmin = true)
# ✅ Route /admin bisa diakses
```

### After Deploy (Production)
```bash
# Test production build locally
npm run build
npm run preview
# ❌ Admin link TIDAK terlihat
# ❌ Route /admin akan 404 atau redirect
```

**Di browser production:**
1. Buka `https://your-site.com/admin`
2. **Expected:** Redirect ke home atau 404
3. **No trace of admin code** di source/bundle

---

## 🌐 Hosting Platforms

### Vercel
```bash
# vercel.json (optional)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_ENV = "production"
```

### Firebase Hosting
```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

**firebase.json:**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{
      "source": "**",
      "destination": "/index.html"
    }]
  }
}
```

---

## 🔐 Extra Security (Optional)

### 1. Environment-based Firebase Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Maintenance collection - read public, write restricted
    match /maintenance/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### 2. Custom Domain Admin Access
Jika ingin admin tetap bisa akses di production:

**Create `.env.local` (git-ignored):**
```env
VITE_ADMIN_SECRET=your-secret-key-here
```

**Update App.tsx:**
```tsx
const isAdminAllowed = import.meta.env.DEV || 
                       localStorage.getItem('adminKey') === import.meta.env.VITE_ADMIN_SECRET;

const Admin = isAdminAllowed ? React.lazy(() => import('./pages/Admin')) : null;
```

**Access in production:**
```javascript
// Browser console
localStorage.setItem('adminKey', 'your-secret-key-here');
// Refresh page → admin route available
```

---

## 📊 Before vs After

### Development (Local)
```
✅ npm run dev
✅ Admin link visible (if isAdmin = true)
✅ /admin route accessible
✅ Full debugging capabilities
```

### Production (Deployed)
```
❌ Admin link NOT visible
❌ /admin route → 404/redirect
❌ Admin.tsx NOT in bundle
✅ Smaller bundle size
✅ Secure - no admin exposure
```

---

## 🚀 Quick Deploy Checklist

- [ ] `Admin.tsx` in `.gitignore` ✅ (already done)
- [ ] Conditional routing in `App.tsx` ✅ (already done)
- [ ] Conditional navbar in `Navbar.tsx` ✅ (already done)
- [ ] Test production build locally: `npm run build && npm run preview`
- [ ] Verify admin route not accessible in preview
- [ ] Push to Git (Admin.tsx won't be included)
- [ ] Deploy to hosting platform
- [ ] Test production site - confirm no admin access
- [ ] Done! 🎉

---

## ℹ️ Notes

1. **Admin.tsx file location:** Still exists locally in `src/pages/Admin.tsx`
2. **Not committed to Git:** Safe in `.gitignore`
3. **Not in production bundle:** Conditional import skips it
4. **Localhost development:** Full admin access as normal
5. **Production:** Zero trace of admin functionality

Perfect balance of **development convenience** and **production security**! 🔒
