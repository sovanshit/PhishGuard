# 🔧 Google Sign-In Setup Guide

## Issue: Google Sign-In Button Not Working

Google Sign-In requires additional setup in Firebase Console. Here's how to fix it:

---

## ✅ Step-by-Step Setup

### Step 1: Enable Google Sign-In in Firebase Console

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your **PhishGuard** project

2. **Navigate to Authentication**
   - Click **Authentication** in the left sidebar
   - Click **Sign-in method** tab

3. **Enable Google Provider**
   - Find **Google** in the providers list
   - Click on **Google**
   - Toggle **Enable** switch to ON
   - **Project support email**: Select your email from dropdown
   - Click **Save**

### Step 2: Add Authorized Domains (REQUIRED for Deployment!)

**⚠️ IMPORTANT:** If deploying to a website (Netlify, Vercel, GitHub Pages, etc.), you MUST add your domain here!

Still in Firebase Console → Authentication → Settings → Authorized domains:

1. Click **Add domain** button
2. Add your domains:
   - `localhost` (usually already there - for local testing)
   - **YOUR DEPLOYED DOMAIN** (e.g., `your-site.netlify.app`) ← REQUIRED!
   - Custom domain if you have one (e.g., `yourdomain.com`)

3. **Domain Format Examples:**
   - ✅ `phishguard.netlify.app` (Netlify)
   - ✅ `phishguard.vercel.app` (Vercel)
   - ✅ `username.github.io` (GitHub Pages)
   - ✅ `yourdomain.com` (Custom domain)
   - ❌ `https://phishguard.netlify.app` (Don't include https://)
   - ❌ `phishguard.netlify.app/` (Don't include trailing slash)

4. Click **Add**

**Note:** If you see `auth/unauthorized-domain` error, your domain is not added here. See `AUTHORIZED_DOMAIN_FIX.md` for detailed help.

### Step 3: Test Google Sign-In

1. **Clear browser cache**: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. **Open your app** in browser
3. **Click "Sign In"** button
4. **Click "Continue with Google"** button
5. **Select Google account** in the popup
6. **Allow permissions**
7. You should be signed in and redirected to Dashboard

---

## 🐛 Common Issues & Solutions

### Issue 1: "This app is not authorized to use Firebase Authentication"

**Cause:** Google Sign-In provider not enabled in Firebase Console

**Solution:**
- Follow Step 1 above to enable Google provider
- Make sure you clicked **Save** after enabling

### Issue 2: "auth/unauthorized-domain" ⚠️ MOST COMMON!

**Error Message:**
```
Firebase: This domain is not authorized for OAuth operations for your Firebase project. 
Edit the list of authorized domains from the Firebase console. (auth/unauthorized-domain)
```

**Cause:** Your deployed website's domain is not in the authorized domains list

**Solution:**
1. Find your deployed domain (e.g., `phishguard.netlify.app`)
2. Go to Firebase Console → Authentication → **Settings** tab (not Sign-in method!)
3. Scroll to **Authorized domains** section
4. Click **Add domain**
5. Paste your domain **without** `https://` (e.g., `phishguard.netlify.app`)
6. Click **Add**
7. Refresh your deployed website and try again

**See detailed guide:** `AUTHORIZED_DOMAIN_FIX.md`

**Common domains to add:**
- Netlify: `your-site.netlify.app`
- Vercel: `your-site.vercel.app`
- GitHub Pages: `username.github.io`
- Custom: `yourdomain.com` and `www.yourdomain.com`

### Issue 3: Popup Blocked by Browser

**Cause:** Browser is blocking the Google Sign-In popup

**Solution:**
- Allow popups for your site
- Check browser address bar for popup blocked icon
- Click "Always allow popups from this site"

### Issue 4: "Firebase: Error (auth/popup-closed-by-user)"

**Cause:** User closed the Google Sign-In popup before completing

**Solution:**
- This is normal user behavior
- Just try signing in again
- Complete the Google Sign-In flow

### Issue 5: Google Sign-In works but profile not created

**Cause:** Firestore rules or profile creation issue

**Solution:**
1. Check browser console for errors
2. Verify Firestore security rules allow profile creation
3. Check `firebase-db.js` is loaded

---

## 🧪 Testing Checklist

After setup, verify:

- [ ] Google provider enabled in Firebase Console
- [ ] Project support email selected
- [ ] Authorized domains configured
- [ ] Browser cache cleared
- [ ] "Continue with Google" button visible
- [ ] Clicking button opens Google Sign-In popup
- [ ] Can select Google account
- [ ] Successfully signed in
- [ ] User created in Firebase Authentication
- [ ] User profile created in Firestore
- [ ] Redirected to Dashboard

---

## 🔍 Debug Mode

### Check Console for Errors

Open browser console (F12) and look for:

**Success messages:**
```
Firebase database functions loaded
User signed in with Google successfully
User profile created successfully
```

**Error messages:**
```
auth/popup-closed-by-user - User closed popup (normal)
auth/unauthorized-domain - Domain not authorized
auth/operation-not-allowed - Google provider not enabled
```

### Test Firebase Google Auth

Open browser console and run:

```javascript
// Check if Google provider is available
const provider = new firebase.auth.GoogleAuthProvider();
console.log('Google provider created:', provider);

// Check if signInWithPopup is available
console.log('signInWithPopup available:', typeof firebase.auth().signInWithPopup);
```

---

## 📋 Firebase Console Checklist

Make sure these are set up in Firebase Console:

### Authentication Tab:
- [x] Authentication enabled
- [x] Email/Password provider enabled
- [x] **Google provider enabled** ← IMPORTANT!
- [x] Project support email selected

### Firestore Database Tab:
- [x] Database created
- [x] Security rules configured
- [x] `users` collection exists (created automatically on first sign up)
- [x] `scans` collection exists (created automatically on first scan)

### Settings Tab:
- [x] Authorized domains include your domain
- [x] `localhost` in authorized domains (for local testing)

---

## 🎯 Visual Guide

### Firebase Console → Authentication → Sign-in method:

```
Sign-in providers:

┌─────────────────────────────────────┐
│ Email/Password          [Enabled]   │
├─────────────────────────────────────┤
│ Google                  [Enabled]   │ ← Should say "Enabled"
│ Project support email: your@email   │
├─────────────────────────────────────┤
│ Phone                   [Disabled]  │
├─────────────────────────────────────┤
│ Anonymous               [Disabled]  │
└─────────────────────────────────────┘
```

---

## 💡 How Google Sign-In Works

### Flow Diagram:

```
User clicks "Continue with Google"
         ↓
App calls signInWithGoogleProvider()
         ↓
Firebase opens Google Sign-In popup
         ↓
User selects Google account
         ↓
User grants permissions
         ↓
Google returns user data to Firebase
         ↓
Firebase creates/signs in user
         ↓
App checks if user profile exists in Firestore
         ↓
If new user: Creates profile in Firestore
         ↓
If existing: Loads profile from Firestore
         ↓
Loads scan history from Firestore
         ↓
Redirects to Dashboard
```

---

## 🔐 Security Notes

### What Data is Stored:

When you sign in with Google, we store:
- ✅ Name (from Google profile)
- ✅ Email (from Google account)
- ✅ Profile Picture URL (from Google)
- ✅ Login Method: "Google"
- ✅ Created At timestamp

We **DO NOT** store:
- ❌ Google password
- ❌ Google access tokens (managed by Firebase)
- ❌ Personal Google data

### Privacy:

- Google Sign-In is handled by Firebase/Google servers
- We only receive basic profile information you approve
- You can revoke access anytime from Google Account settings

---

## 🚀 Alternative: Email/Password Sign-In

If Google Sign-In is not working or you prefer email/password:

1. Click **"Sign Up"** tab
2. Enter:
   - Full Name
   - Email
   - Password
   - Confirm Password
3. Check "I agree to terms"
4. Click **"Create Account →"**

Email/Password authentication works independently and doesn't require Google setup.

---

## ✅ Success!

You'll know Google Sign-In is working when:

1. ✅ Button opens Google Sign-In popup
2. ✅ Can select Google account
3. ✅ Popup closes automatically after selection
4. ✅ See "Signed in with Google!" toast message
5. ✅ Redirected to Dashboard
6. ✅ User appears in Firebase Console → Authentication
7. ✅ Profile created in Firestore → users collection
8. ✅ Can see your Google profile picture in nav

---

## 📞 Still Having Issues?

If Google Sign-In still doesn't work:

1. **Share the error** from browser console
2. **Check Firebase Console** → Authentication → Sign-in method
   - Verify Google provider shows "Enabled"
   - Verify project support email is selected
3. **Check authorized domains** include your domain
4. **Try in incognito mode** to rule out cache/extensions
5. **Test Email/Password sign-in** to verify Firebase is working

---

**Enable Google Sign-In in Firebase Console and you're all set!** 🎉

