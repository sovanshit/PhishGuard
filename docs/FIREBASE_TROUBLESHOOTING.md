# 🔧 Firebase Troubleshooting Guide

## Issue: Sign up credentials not storing to Firebase

### ✅ Fix Applied

**Problem:** The `firebase-db.js` file was not being loaded in `index.html`

**Solution:** Added the script tag to load `firebase-db.js` before `app.js`

```html
<!-- Firebase Database Functions -->
<script src="assets/js/firebase-db.js"></script>

<!-- Your app.js -->
<script src="assets/js/app.js"></script>
```

---

## 🧪 Testing Steps

### 1. Clear Browser Cache
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or clear cache manually in browser settings

### 2. Open Browser Console
- Press `F12` to open Developer Tools
- Go to **Console** tab
- Look for any errors (red text)

### 3. Test Sign Up

1. **Open your app** in browser
2. **Click "Sign In"** button
3. **Switch to "Sign Up"** tab
4. **Fill in the form:**
   - Full Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
   - ✅ Check "I agree to terms"
5. **Click "Create Account →"**

### 4. Check Browser Console

You should see:
```
Firebase database functions loaded
User profile created successfully
```

If you see errors, note them down.

### 5. Check Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **PhishGuard** project
3. Go to **Authentication** → You should see the new user
4. Go to **Firestore Database** → You should see:
   - `users` collection
   - Document with user ID
   - User data (name, email, etc.)

---

## 🐛 Common Issues & Solutions

### Issue 1: "firebase is not defined"

**Cause:** Firebase scripts not loaded

**Solution:**
1. Check internet connection
2. Verify Firebase CDN scripts are in `index.html`:
```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
```

### Issue 2: "signUpWithEmail is not defined"

**Cause:** `firebase-db.js` not loaded

**Solution:**
- Verify `firebase-db.js` exists in `assets/js/` folder
- Check script tag is present in `index.html`:
```html
<script src="assets/js/firebase-db.js"></script>
```

### Issue 3: "Permission denied" in Firestore

**Cause:** Firestore security rules too restrictive

**Solution:**
1. Go to Firebase Console → Firestore Database → Rules
2. Update rules to:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /scans/{scanId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```
3. Click **Publish**

### Issue 4: "Email already in use"

**Cause:** User already exists in Firebase

**Solution:**
- Use a different email address
- Or delete the user from Firebase Console → Authentication

### Issue 5: Authentication works but Firestore doesn't save

**Cause:** Firestore not enabled or wrong rules

**Solution:**
1. Go to Firebase Console → Firestore Database
2. If not enabled, click "Create database"
3. Choose "Start in test mode"
4. Update security rules (see Issue 3)

---

## 🔍 Debug Mode

### Enable Console Logging

Open `assets/js/firebase-db.js` and check that console.log statements are present:

```javascript
async function createUserProfile(userId, userData) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');  // Should see this if Firebase not ready
    return false;
  }
  
  try {
    await db.collection('users').doc(userId).set({...});
    console.log('User profile created successfully');  // Should see this on success
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);  // Should see this on error
    return false;
  }
}
```

### Check Firebase Initialization

Open browser console and type:
```javascript
console.log('Firebase available:', typeof firebase !== 'undefined');
console.log('Firebase apps:', firebase.apps.length);
console.log('useFirebase:', useFirebase);
```

Expected output:
```
Firebase available: true
Firebase apps: 1
useFirebase: true
```

---

## 📋 Verification Checklist

After the fix, verify:

- [ ] `firebase-db.js` exists in `assets/js/` folder
- [ ] `firebase-db.js` is loaded in `index.html` (before `app.js`)
- [ ] Browser cache cleared
- [ ] No errors in browser console
- [ ] Sign up creates user in Firebase Authentication
- [ ] User document created in Firestore `users` collection
- [ ] Can sign in with created account
- [ ] Scan URLs save to Firestore `scans` collection

---

## 🧪 Quick Test Script

Open browser console and run:

```javascript
// Test Firebase connection
console.log('Testing Firebase...');

// Check if Firebase is loaded
if (typeof firebase === 'undefined') {
  console.error('❌ Firebase not loaded');
} else {
  console.log('✅ Firebase loaded');
  console.log('Apps:', firebase.apps.length);
}

// Check if firebase-db.js functions are available
if (typeof isFirebaseReady === 'undefined') {
  console.error('❌ firebase-db.js not loaded');
} else {
  console.log('✅ firebase-db.js loaded');
  console.log('Firebase ready:', isFirebaseReady());
}

// Check if app.js is loaded
if (typeof useFirebase === 'undefined') {
  console.error('❌ app.js not loaded or useFirebase not defined');
} else {
  console.log('✅ app.js loaded');
  console.log('useFirebase:', useFirebase);
}
```

Expected output:
```
Testing Firebase...
✅ Firebase loaded
Apps: 1
✅ firebase-db.js loaded
Firebase ready: true
✅ app.js loaded
useFirebase: true
```

---

## 🎯 Step-by-Step Debug Process

### Step 1: Verify Files Exist
```powershell
# Check if files exist
dir "d:\Projects\PhishGuard_split\assets\js\firebase-db.js"
dir "d:\Projects\PhishGuard_split\assets\js\app.js"
```

### Step 2: Check Script Order in index.html
Scripts should be in this order:
1. Firebase SDK scripts (app, auth, firestore)
2. Firebase config initialization
3. `firebase-db.js`
4. `app.js`

### Step 3: Test in Browser
1. Open `index.html` in browser
2. Open Console (F12)
3. Look for "Firebase database functions loaded" message
4. Try signing up
5. Check for errors

### Step 4: Check Firebase Console
1. Go to Firebase Console
2. Check Authentication for new user
3. Check Firestore for user document

---

## 💡 Additional Tips

### Tip 1: Use Incognito Mode
Test in incognito/private browsing to avoid cache issues

### Tip 2: Check Network Tab
1. Open DevTools → Network tab
2. Reload page
3. Check if `firebase-db.js` loads successfully (status 200)

### Tip 3: Verify Firebase Config
Make sure your Firebase config in `index.html` matches your Firebase project:
- `apiKey` should be correct
- `projectId` should match your project
- `authDomain` should be `your-project.firebaseapp.com`

### Tip 4: Test with Simple Account
Use a simple email and password for testing:
- Email: test@test.com
- Password: test123

---

## 🆘 Still Not Working?

If you're still having issues:

1. **Share the error message** from browser console
2. **Check Firebase Console** → Authentication → Sign-in method
   - Verify "Email/Password" is enabled
3. **Check Firestore Rules** → Make sure they're not too restrictive
4. **Try the test script** above and share the output

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ No errors in browser console
2. ✅ "User profile created successfully" appears in console
3. ✅ New user appears in Firebase Console → Authentication
4. ✅ User document appears in Firestore → users collection
5. ✅ Can sign in with the created account
6. ✅ Dashboard loads with user data

---

**The fix has been applied!** Clear your browser cache and try signing up again. 🚀
