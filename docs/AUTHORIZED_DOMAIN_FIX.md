# 🔧 Fix: auth/unauthorized-domain Error

## Error Message:
```
Firebase: This domain is not authorized for OAuth operations for your Firebase project. 
Edit the list of authorized domains from the Firebase console. (auth/unauthorized-domain)
```

---

## ✅ Quick Fix (2 minutes)

### Step 1: Find Your Deployed Domain

Your website is deployed at a URL like:
- `your-site.netlify.app`
- `your-site.vercel.app`
- `your-site.github.io`
- `your-custom-domain.com`

**Copy the domain** (without `https://` or any path)

Example:
- ✅ `phishguard.netlify.app`
- ✅ `mysite.github.io`
- ❌ `https://phishguard.netlify.app/index.html` (wrong - remove https:// and path)

---

### Step 2: Add Domain to Firebase Console

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your **PhishGuard** project (phishguard-38aaa)

2. **Navigate to Authentication Settings**
   - Click **Authentication** in left sidebar
   - Click **Settings** tab at the top
   - Scroll down to **Authorized domains** section

3. **Add Your Domain**
   - Click **Add domain** button
   - Paste your domain (e.g., `phishguard.netlify.app`)
   - Click **Add**

4. **Done!** Your domain should now appear in the list like this:
   ```
   Authorized domains:
   - localhost (pre-configured)
   - phishguard-38aaa.firebaseapp.com (pre-configured)
   - your-site.netlify.app (newly added) ✅
   ```

---

### Step 3: Test Google Sign-In

1. **Go to your deployed website**
2. **Click "Sign In"**
3. **Click "Continue with Google"**
4. **Select your Google account**
5. ✅ Should work now!

---

## 🌐 Common Deployment Platforms

### If Deployed on Netlify:
- Domain format: `your-site.netlify.app`
- Example: `phishguard.netlify.app`

### If Deployed on Vercel:
- Domain format: `your-site.vercel.app`
- Example: `phishguard.vercel.app`

### If Deployed on GitHub Pages:
- Domain format: `username.github.io` or `username.github.io/repo-name`
- Example: `johndoe.github.io`
- **Note:** For subdirectory deployments, use the root domain: `username.github.io` (not the repo path)

### If Using Custom Domain:
- Domain format: `www.yourdomain.com` or `yourdomain.com`
- Add **both** www and non-www versions:
  - `yourdomain.com`
  - `www.yourdomain.com`

---

## 📋 Visual Guide

### Firebase Console → Authentication → Settings:

```
┌────────────────────────────────────────────────────┐
│ Authorized domains                    [Add domain] │
├────────────────────────────────────────────────────┤
│ localhost                             [Default]    │
│ phishguard-38aaa.firebaseapp.com     [Default]    │
│ your-site.netlify.app                [Add this!]  │  ← Your deployed domain
└────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Checklist

After adding your domain:

- [ ] Domain added to authorized domains list
- [ ] Deployed website refreshed (hard refresh: `Ctrl + Shift + R`)
- [ ] Clicked "Continue with Google"
- [ ] Google Sign-In popup opened
- [ ] Successfully signed in
- [ ] Redirected to Dashboard
- [ ] No more `auth/unauthorized-domain` error

---

## 🐛 Still Not Working?

### Double-Check the Domain Format:

**Correct formats:**
- ✅ `phishguard.netlify.app`
- ✅ `www.mysite.com`
- ✅ `mysite.com`
- ✅ `username.github.io`

**Incorrect formats:**
- ❌ `https://phishguard.netlify.app` (remove `https://`)
- ❌ `phishguard.netlify.app/` (remove trailing slash)
- ❌ `phishguard.netlify.app/index.html` (remove path)
- ❌ `http://localhost:5000` (use just `localhost` for local)

### Check for Multiple Domains:

If your site is accessible via multiple URLs, add **all of them**:

Example for Netlify with custom domain:
- `phishguard.netlify.app` (Netlify default)
- `phishguard.com` (Custom domain)
- `www.phishguard.com` (www version)

### Clear Browser Cache:

After adding domain:
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Or try in **Incognito/Private mode**

---

## 💡 Pro Tips

### Tip 1: Add Domain BEFORE Deploying
When deploying to a new domain, add it to Firebase first to avoid this error.

### Tip 2: Wildcard Subdomains
If using subdomains (e.g., `staging.mysite.com`, `beta.mysite.com`):
- Add each subdomain individually
- Firebase doesn't support wildcard domains like `*.mysite.com`

### Tip 3: Development vs Production
Keep both in authorized domains:
- `localhost` (for local development)
- `your-production-domain.com` (for production)

---

## 🔐 Security Note

**Why does Firebase require authorized domains?**

- Prevents unauthorized sites from using your Firebase project
- Protects against phishing attacks using your Firebase credentials
- Ensures only YOUR domains can authenticate users with YOUR Firebase project

Only add domains **you own and control**.

---

## 📝 Summary

**The Error:**
```
auth/unauthorized-domain
```

**The Cause:**
Your deployed domain is not in Firebase's authorized domains list.

**The Fix:**
1. Go to Firebase Console → Authentication → Settings
2. Add your deployed domain to "Authorized domains"
3. Test Google Sign-In again

**Result:**
✅ Google Sign-In works on your deployed website!

---

## 🚀 Quick Steps Recap

```
1. Copy your deployed domain (e.g., phishguard.netlify.app)
2. Firebase Console → Authentication → Settings → Authorized domains
3. Click "Add domain"
4. Paste domain → Click "Add"
5. Refresh your website and test
```

---

**That's it! Add your domain and Google Sign-In will work perfectly.** 🎉

If you're still having issues, let me know:
1. What is your deployed domain?
2. What domains are currently in your authorized list?
3. Any other error messages in browser console?

