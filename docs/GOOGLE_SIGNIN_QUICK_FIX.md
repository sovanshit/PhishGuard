# 🚀 Google Sign-In Quick Fix

## Error: auth/unauthorized-domain

This is the **#1 most common issue** with Google Sign-In on deployed websites.

---

## ✅ Fix in 2 Minutes

### 1️⃣ Find Your Domain
Look at your browser's address bar when on your deployed site:
- Copy everything between `https://` and the first `/`
- Example: `phishguard.netlify.app`

### 2️⃣ Add to Firebase
1. Go to: https://console.firebase.google.com/
2. Select: **phishguard-38aaa** project
3. Click: **Authentication** (left sidebar)
4. Click: **Settings** tab (top)
5. Scroll to: **Authorized domains**
6. Click: **Add domain**
7. Paste: Your domain (e.g., `phishguard.netlify.app`)
8. Click: **Add**

### 3️⃣ Test
1. Refresh your deployed website: `Ctrl + Shift + R`
2. Click "Sign In" → "Continue with Google"
3. ✅ Should work now!

---

## 📍 Common Domains

**Netlify:**
```
your-project-name.netlify.app
```

**Vercel:**
```
your-project-name.vercel.app
```

**GitHub Pages:**
```
your-username.github.io
```

**Custom Domain:**
```
yourdomain.com
www.yourdomain.com
```
(Add both www and non-www)

---

## ⚠️ Important Notes

**DO:**
- ✅ Use domain only: `phishguard.netlify.app`
- ✅ Add all domains your site uses

**DON'T:**
- ❌ Include `https://`: `https://phishguard.netlify.app`
- ❌ Include paths: `phishguard.netlify.app/index.html`
- ❌ Include trailing slash: `phishguard.netlify.app/`

---

## 🔍 How to Check if Fixed

Your authorized domains list should look like:

```
Authorized domains:
✅ localhost                        (for local testing)
✅ phishguard-38aaa.firebaseapp.com (Firebase default)
✅ your-site.netlify.app            (YOUR DEPLOYED DOMAIN)
```

---

## 📚 More Help

See detailed guides:
- `docs/AUTHORIZED_DOMAIN_FIX.md` - Full troubleshooting
- `docs/GOOGLE_SIGNIN_SETUP.md` - Complete setup guide

---

**That's it! Add your domain and you're done.** 🎉
