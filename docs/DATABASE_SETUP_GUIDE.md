# PhishGuard - Complete Database Setup Guide

This guide will walk you through setting up Firebase for PhishGuard from scratch.

---

## 📋 Prerequisites

- Google Account (Gmail)
- PhishGuard project files
- Web browser
- 10-15 minutes

---

## 🔥 Step 1: Create Firebase Project

### 1.1 Go to Firebase Console
1. Open your browser
2. Go to: https://console.firebase.google.com/
3. Click "Sign in" with your Google account
4. Click "Add project" or "Create a project"

### 1.2 Project Setup
1. **Project name**: Enter "PhishGuard" (or your preferred name)
2. Click "Continue"
3. **Google Analytics**: Toggle OFF (optional, you can enable if needed)
4. Click "Create project"
5. Wait 30-60 seconds for project creation
6. Click "Continue" when ready

---

## 🌐 Step 2: Register Web App

### 2.1 Add Web App
1. In Firebase Console, click the **Web icon** `</>`
2. **App nickname**: Enter "PhishGuard Web"
3. ✅ Check "Also set up Firebase Hosting" (optional, for easy deployment)
4. Click "Register app"

### 2.2 Copy Configuration
You'll see a code snippet like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**IMPORTANT**: Keep this window open or copy this configuration!

### 2.3 Update Your Code
1. Open `index.html` in your code editor
2. Find this section (around line 520-530):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDd_1gm47flR8Gz7ce8Vady-yPXR9c8oPA",
  authDomain: "phishguard-38aaa.firebaseapp.com",
  projectId: "phishguard-38aaa",
  // ... rest of config
};
```

3. **Replace** with YOUR Firebase configuration from Step 2.2
4. Save the file

### 2.4 Click "Continue to console"

---

## 🔐 Step 3: Enable Authentication

### 3.1 Enable Email/Password Authentication
1. In Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click on **"Sign-in method"** tab
4. Click on **"Email/Password"** provider
5. Toggle **"Enable"** switch to ON
6. Click **"Save"**

### 3.2 Enable Google Sign-In
1. Still in "Sign-in method" tab
2. Click on **"Google"** provider
3. Toggle **"Enable"** switch to ON
4. **Project support email**: Select your email from dropdown
5. Click **"Save"**

### 3.3 Add Authorized Domains
1. Still in Authentication section
2. Click **"Settings"** tab
3. Scroll to **"Authorized domains"**
4. You'll see `localhost` and `your-project.firebaseapp.com` already listed
5. When you deploy to your domain, click **"Add domain"**
6. Enter your domain (e.g., `phishguard.com` or `yoursite.netlify.app`)
7. Click **"Add"**

**Note**: Do this AFTER deploying your website (Step covered in deployment guide)

---

## 📊 Step 4: Create Firestore Database

### 4.1 Create Database
1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. **Security rules**: Select **"Start in test mode"** (we'll update later)
4. Click **"Next"**
5. **Location**: Choose closest to your users (e.g., `us-central` for USA, `europe-west` for Europe)
6. Click **"Enable"**
7. Wait 1-2 minutes for database creation

### 4.2 Database Structure
Firebase will automatically create collections when your app writes data. The structure will be:

```
📁 Firestore Database
  └── 📁 users (collection)
      └── 📄 [userId] (document)
          ├── name: "John Doe"
          ├── email: "john@example.com"
          ├── createdAt: timestamp
          ├── loginMethod: "Email" or "Google"
          └── 📁 scans (subcollection)
              └── 📄 [scanId] (document)
                  ├── url: "https://example.com"
                  ├── status: "Safe"
                  ├── score: 94
                  ├── timestamp: timestamp
                  └── ... other scan data
```

**No manual setup needed** - the app creates this automatically!

---

## 🔒 Step 5: Update Security Rules

### 5.1 Set Firestore Rules
1. In **Firestore Database**, click **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read/write only their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Scans subcollection
      match /scans/{scanId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Click **"Publish"**

### 5.2 Set Storage Rules (if using Storage)
1. In sidebar, click **"Storage"**
2. Click **"Get started"**
3. Select **"Start in test mode"**
4. Click **"Next"**
5. Choose same location as Firestore
6. Click **"Done"**

**Note**: Currently PhishGuard doesn't use Storage, but good to have for future profile pictures if needed.

---

## 📇 Step 6: Create Firestore Indexes (Important!)

### 6.1 Why Indexes?
Indexes improve query performance for sorting and filtering scan history.

### 6.2 Create Indexes
1. In **Firestore Database**, click **"Indexes"** tab
2. Click **"Create Index"**
3. **Collection ID**: `users/{userId}/scans`
4. Add fields:
   - Field: `timestamp`, Order: `Descending`
   - Field: `status`, Order: `Ascending`
5. **Query scope**: `Collection`
6. Click **"Create"**

Wait 2-3 minutes for index to build (status will show "Building..." then "Enabled")

---

## ✅ Step 7: Verify Setup

### 7.1 Test Connection
1. Open your `index.html` in a browser
2. Open Browser Console (F12)
3. Check for errors
4. You should see: `Firebase initialized successfully` (or no errors)

### 7.2 Test Sign Up
1. Go to Sign Up page
2. Enter name, email, password
3. Click "Create Account"
4. Should redirect to Dashboard

### 7.3 Verify in Firebase
1. Go to Firebase Console → **Authentication**
2. Click **"Users"** tab
3. You should see your new user listed!
4. Go to **Firestore Database**
5. You should see `users` collection with your user document

### 7.4 Test Sign Out & Sign In
1. Click profile → Sign Out
2. Sign In with your credentials
3. Should work successfully ✅

---

## 🔧 Troubleshooting

### "Firebase: This domain is not authorized"
**Solution**: Add your domain to Authorized domains (Step 3.3)

### "Permission denied" errors in Firestore
**Solution**: Check security rules (Step 5.1)

### "Index required" errors
**Solution**: Create indexes (Step 6)

### Firebase not loading
**Solution**: 
1. Check if Firebase config is correct in `index.html`
2. Check browser console for errors
3. Verify Firebase SDK scripts are loading

### Sign up not working
**Solution**:
1. Check if Email/Password auth is enabled
2. Check browser console for errors
3. Verify Firebase config is correct

---

## 📱 Step 8: Optional - Enable Phone Authentication

1. In **Authentication** → **Sign-in method**
2. Click **"Phone"**
3. Enable toggle
4. Follow setup instructions (requires SMS service)

---

## 💾 Step 9: Database Backup (Recommended)

### 9.1 Automatic Backups
Firebase automatically backs up your data, but for manual exports:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Export Firestore:
```bash
firebase firestore:export gs://your-bucket-name/backups/$(date +%Y%m%d)
```

---

## 📊 Step 10: Monitor Usage

### 10.1 Check Usage Limits
Free tier limits:
- **Firestore**: 50K reads, 20K writes, 20K deletes per day
- **Authentication**: Unlimited users
- **Storage**: 5GB stored, 1GB transferred per month

### 10.2 Monitor Usage
1. Go to Firebase Console
2. Click **"Usage and billing"** in sidebar
3. View usage stats
4. Set up billing alerts if needed

---

## 🎯 Quick Summary

✅ **Step 1**: Create Firebase project
✅ **Step 2**: Register web app & copy config
✅ **Step 3**: Enable Email & Google authentication
✅ **Step 4**: Create Firestore database
✅ **Step 5**: Update security rules
✅ **Step 6**: Create indexes
✅ **Step 7**: Test everything works

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for error messages
2. Review this guide again
3. Check Firebase documentation
4. Search for the specific error message

---

**Database Setup Complete! 🎉**

Next: See `DEPLOYMENT_GUIDE.md` to deploy your website to your domain!
