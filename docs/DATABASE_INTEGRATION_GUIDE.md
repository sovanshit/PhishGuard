# 🗄️ Database Integration Guide for PhishGuard

## Overview

This guide will help you connect PhishGuard to a database for persistent data storage. Currently, the app uses **localStorage** (client-side only). Adding a database will enable:

- ✅ Data persistence across devices
- ✅ Multi-user support
- ✅ Real-time sync
- ✅ Advanced analytics
- ✅ Backup and recovery
- ✅ Scalability

---

## 🎯 Database Options

### Option 1: Firebase (Recommended for Beginners)
**Best for:** Quick setup, real-time features, no backend coding

**Pros:**
- Free tier available
- Real-time database
- Built-in authentication
- No server management
- Easy to integrate

**Cons:**
- Vendor lock-in
- Limited free tier
- NoSQL structure

### Option 2: Supabase (PostgreSQL)
**Best for:** SQL lovers, open-source preference

**Pros:**
- PostgreSQL database
- Open source
- Real-time subscriptions
- Built-in auth
- Generous free tier

**Cons:**
- Slightly more complex than Firebase
- Newer platform

### Option 3: MongoDB Atlas
**Best for:** NoSQL, flexible schema

**Pros:**
- Free tier (512MB)
- Flexible document structure
- Good for JSON data
- Cloud-hosted

**Cons:**
- Requires backend API
- NoSQL learning curve

### Option 4: Traditional Backend (Node.js + MySQL/PostgreSQL)
**Best for:** Full control, custom requirements

**Pros:**
- Complete control
- Any database choice
- Custom business logic
- No vendor lock-in

**Cons:**
- Requires server setup
- More code to write
- Hosting costs

---

## 🚀 Quick Start: Firebase Integration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "PhishGuard"
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select your region
5. Click "Enable"

### Step 3: Enable Authentication

1. Click "Authentication" in sidebar
2. Click "Get Started"
3. Enable "Email/Password"
4. Enable "Google" (optional)

### Step 4: Get Firebase Config

1. Click the gear icon → "Project Settings"
2. Scroll to "Your apps"
3. Click the web icon `</>`
4. Register your app
5. Copy the Firebase config object

### Step 5: Add Firebase to Your Project

Add this to your `index.html` **before** the closing `</body>` tag:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>

<!-- Firebase Configuration -->
<script>
  // Your Firebase configuration
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Get references
  const auth = firebase.auth();
  const db = firebase.firestore();
</script>

<!-- Your app.js -->
<script src="assets/js/app.js"></script>
```

---

## 📝 Database Schema Design

### Collections Structure:

```
phishguard/
├── users/
│   └── {userId}/
│       ├── name: string
│       ├── email: string
│       ├── createdAt: timestamp
│       ├── profilePicture: string (base64 or URL)
│       └── loginMethod: string
│
├── scans/
│   └── {scanId}/
│       ├── userId: string
│       ├── url: string
│       ├── score: number
│       ├── status: string (Safe/Suspicious/Malicious)
│       ├── flags: array
│       ├── timestamp: timestamp
│       ├── domain: string
│       ├── ssl: string
│       └── reputation: string
│
└── settings/
    └── {userId}/
        ├── theme: string
        ├── notifications: boolean
        └── preferences: object
```

---

## 💻 Code Implementation

### 1. Create `assets/js/firebase-db.js`

```javascript
/* ═══════════════════════════════════════════════════════════════
   FIREBASE DATABASE FUNCTIONS
═══════════════════════════════════════════════════════════════ */

// Check if Firebase is initialized
function isFirebaseReady() {
  return typeof firebase !== 'undefined' && firebase.apps.length > 0;
}

/* ─────────────────────────────────────────────────────────────
   USER MANAGEMENT
───────────────────────────────────────────────────────────── */

// Create user profile in Firestore
async function createUserProfile(userId, userData) {
  if (!isFirebaseReady()) return false;
  
  try {
    await db.collection('users').doc(userId).set({
      name: userData.name,
      email: userData.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      profilePicture: userData.profilePicture || null,
      loginMethod: userData.loginMethod || 'Email'
    });
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
}

// Get user profile
async function getUserProfile(userId) {
  if (!isFirebaseReady()) return null;
  
  try {
    const doc = await db.collection('users').doc(userId).get();
    if (doc.exists) {
      return doc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Update user profile
async function updateUserProfile(userId, updates) {
  if (!isFirebaseReady()) return false;
  
  try {
    await db.collection('users').doc(userId).update(updates);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   SCAN HISTORY
───────────────────────────────────────────────────────────── */

// Save scan result
async function saveScanResult(userId, scanData) {
  if (!isFirebaseReady()) return false;
  
  try {
    await db.collection('scans').add({
      userId: userId,
      url: scanData.url,
      score: scanData.score,
      status: scanData.status,
      flags: scanData.flags || [],
      domain: scanData.domain,
      ssl: scanData.ssl,
      reputation: scanData.reputation,
      risk: scanData.risk,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error saving scan:', error);
    return false;
  }
}

// Get user's scan history
async function getUserScans(userId, limit = 100) {
  if (!isFirebaseReady()) return [];
  
  try {
    const snapshot = await db.collection('scans')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    const scans = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      scans.push({
        id: doc.id,
        ...data,
        date: data.timestamp?.toDate().toLocaleString() || 'Unknown'
      });
    });
    
    return scans;
  } catch (error) {
    console.error('Error getting scans:', error);
    return [];
  }
}

// Delete scan
async function deleteScan(scanId) {
  if (!isFirebaseReady()) return false;
  
  try {
    await db.collection('scans').doc(scanId).delete();
    return true;
  } catch (error) {
    console.error('Error deleting scan:', error);
    return false;
  }
}

// Clear all user scans
async function clearUserScans(userId) {
  if (!isFirebaseReady()) return false;
  
  try {
    const snapshot = await db.collection('scans')
      .where('userId', '==', userId)
      .get();
    
    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error clearing scans:', error);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   AUTHENTICATION
───────────────────────────────────────────────────────────── */

// Sign up with email/password
async function signUpWithEmail(email, password, name) {
  if (!isFirebaseReady()) return { success: false, error: 'Firebase not initialized' };
  
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Create user profile
    await createUserProfile(user.uid, {
      name: name,
      email: email,
      loginMethod: 'Email'
    });
    
    return { success: true, user: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign in with email/password
async function signInWithEmail(email, password) {
  if (!isFirebaseReady()) return { success: false, error: 'Firebase not initialized' };
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Get user profile
    const profile = await getUserProfile(user.uid);
    
    return { success: true, user: user, profile: profile };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign in with Google
async function signInWithGoogleProvider() {
  if (!isFirebaseReady()) return { success: false, error: 'Firebase not initialized' };
  
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    
    // Check if user profile exists
    let profile = await getUserProfile(user.uid);
    
    // Create profile if doesn't exist
    if (!profile) {
      await createUserProfile(user.uid, {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        loginMethod: 'Google'
      });
      profile = await getUserProfile(user.uid);
    }
    
    return { success: true, user: user, profile: profile };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign out
async function signOutUser() {
  if (!isFirebaseReady()) return false;
  
  try {
    await auth.signOut();
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}

// Listen to auth state changes
function onAuthStateChanged(callback) {
  if (!isFirebaseReady()) return;
  
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      callback({ user: user, profile: profile });
    } else {
      callback(null);
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   REAL-TIME LISTENERS
───────────────────────────────────────────────────────────── */

// Listen to user's scans in real-time
function listenToUserScans(userId, callback) {
  if (!isFirebaseReady()) return null;
  
  return db.collection('scans')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(100)
    .onSnapshot(snapshot => {
      const scans = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        scans.push({
          id: doc.id,
          ...data,
          date: data.timestamp?.toDate().toLocaleString() || 'Unknown'
        });
      });
      callback(scans);
    });
}
```

### 2. Update `assets/js/app.js`

Add Firebase integration to your existing app.js. Here are the key changes:

```javascript
// At the top of app.js, after state declaration:

// Check if Firebase is available
const useFirebase = typeof firebase !== 'undefined' && firebase.apps.length > 0;

// Modified saveSession function
function saveSession() {
  try {
    // Always save to localStorage as backup
    if (state.user) localStorage.setItem('phishguard_user', JSON.stringify(state.user));
    else localStorage.removeItem('phishguard_user');
    localStorage.setItem('phishguard_history', JSON.stringify(state.history));
    if (state.profilePicture) localStorage.setItem('phishguard_profile_pic', JSON.stringify(state.profilePicture));
    else localStorage.removeItem('phishguard_profile_pic');
    
    // Also save to Firebase if available
    if (useFirebase && state.user && state.user.uid) {
      updateUserProfile(state.user.uid, {
        name: state.user.name,
        profilePicture: state.profilePicture
      });
    }
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

// Modified doScan function - add Firebase save
function doScan() {
  // ... existing scan code ...
  
  // After showing result:
  const scanResult = {
    ...r,
    url: rawUrl,
    date: new Date().toLocaleString()
  };
  
  state.history.unshift(scanResult);
  if (state.history.length > 100) state.history.pop();
  
  // Save to localStorage
  saveSession();
  
  // Save to Firebase if user is logged in
  if (useFirebase && state.user && state.user.uid) {
    saveScanResult(state.user.uid, scanResult);
  }
  
  renderHistory();
}

// Modified submitAuth function
async function submitAuth() {
  // ... existing validation code ...
  
  if (useFirebase) {
    // Use Firebase authentication
    if (authMode === 'signup') {
      const result = await signUpWithEmail(email, password, name);
      if (result.success) {
        state.user = {
          uid: result.user.uid,
          name: name,
          email: email,
          loginMethod: 'Email'
        };
        saveSession();
        updateNavAuth();
        showToast('Account created successfully!', 'success');
        setTimeout(() => navigateSPA('dashboard'), 800);
      } else {
        showToast(result.error, 'error');
      }
    } else {
      const result = await signInWithEmail(email, password);
      if (result.success) {
        state.user = {
          uid: result.user.uid,
          name: result.profile.name,
          email: result.profile.email,
          loginMethod: result.profile.loginMethod
        };
        
        // Load user's scan history from Firebase
        const scans = await getUserScans(result.user.uid);
        state.history = scans;
        
        saveSession();
        updateNavAuth();
        showToast('Welcome back!', 'success');
        setTimeout(() => navigateSPA('dashboard'), 800);
      } else {
        showToast(result.error, 'error');
      }
    }
  } else {
    // Fallback to localStorage (existing code)
    // ... your existing auth code ...
  }
}

// Modified signInWithGoogle function
async function signInWithGoogle() {
  if (useFirebase) {
    const result = await signInWithGoogleProvider();
    if (result.success) {
      state.user = {
        uid: result.user.uid,
        name: result.profile.name,
        email: result.profile.email,
        loginMethod: 'Google'
      };
      
      if (result.profile.profilePicture) {
        state.profilePicture = result.profile.profilePicture;
      }
      
      // Load user's scan history
      const scans = await getUserScans(result.user.uid);
      state.history = scans;
      
      saveSession();
      updateNavAuth();
      showToast('Signed in with Google!', 'success');
      setTimeout(() => navigateSPA('dashboard'), 800);
    } else {
      showToast(result.error, 'error');
    }
  } else {
    // Fallback to demo mode (existing code)
    // ... your existing Google sign-in simulation ...
  }
}

// Modified logout function
async function logout() {
  if (useFirebase) {
    await signOutUser();
  }
  
  state.user = null;
  state.history = [];
  saveSession();
  updateNavAuth();
  closeUserMenu();
  showToast('Signed out successfully', 'success');
  setTimeout(() => navigateSPA('home'), 500);
}

// Add auth state listener on page load
if (useFirebase) {
  onAuthStateChanged(async (authData) => {
    if (authData) {
      state.user = {
        uid: authData.user.uid,
        name: authData.profile.name,
        email: authData.profile.email,
        loginMethod: authData.profile.loginMethod
      };
      
      if (authData.profile.profilePicture) {
        state.profilePicture = authData.profile.profilePicture;
      }
      
      // Load scan history
      const scans = await getUserScans(authData.user.uid);
      state.history = scans;
      
      updateNavAuth();
      if (state.page === 'dashboard') {
        renderDashboard();
      }
    }
  });
}
```

### 3. Update `index.html`

Add Firebase scripts before your app.js:

```html
<!-- Before closing </body> tag -->

<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>

<!-- Firebase Configuration -->
<script>
  // Replace with your Firebase config
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
</script>

<!-- Firebase Database Functions -->
<script src="assets/js/firebase-db.js"></script>

<!-- Your App -->
<script src="assets/js/app.js"></script>
</body>
</html>
```

---

## 🔒 Security Rules

### Firestore Security Rules:

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Users can read and write their own profile
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Scans collection
    match /scans/{scanId} {
      // Users can read their own scans
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Users can create scans
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Users can delete their own scans
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 📊 Testing Your Integration

### Test Checklist:

1. **Sign Up**
   - [ ] Create new account
   - [ ] Check Firestore for user document
   - [ ] Verify authentication works

2. **Sign In**
   - [ ] Sign in with existing account
   - [ ] Check if user data loads
   - [ ] Verify session persists

3. **Scan URLs**
   - [ ] Perform URL scan
   - [ ] Check Firestore for scan document
   - [ ] Verify scan appears in dashboard

4. **Profile Updates**
   - [ ] Update profile name
   - [ ] Upload profile picture
   - [ ] Check Firestore for updates

5. **Sign Out**
   - [ ] Sign out
   - [ ] Verify data clears
   - [ ] Check localStorage cleared

---

## 🚀 Alternative: Supabase Integration

If you prefer PostgreSQL over Firebase:

### Quick Setup:

1. Go to [Supabase](https://supabase.com/)
2. Create new project
3. Get your API keys
4. Install Supabase client:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const supabase = supabase.createClient(
    'YOUR_SUPABASE_URL',
    'YOUR_SUPABASE_ANON_KEY'
  );
</script>
```

### Database Schema (SQL):

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  profile_picture TEXT,
  login_method TEXT DEFAULT 'Email',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scans table
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  score INTEGER NOT NULL,
  status TEXT NOT NULL,
  flags JSONB DEFAULT '[]',
  domain TEXT,
  ssl TEXT,
  reputation TEXT,
  risk TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);
```

---

## 📱 Next Steps

1. **Choose your database** (Firebase recommended for beginners)
2. **Set up the project** (follow steps above)
3. **Add Firebase scripts** to index.html
4. **Create firebase-db.js** file
5. **Update app.js** with Firebase integration
6. **Test thoroughly** with the checklist
7. **Deploy** your app

---

## 🎯 Benefits After Integration

- ✅ **Multi-device sync** - Access data from anywhere
- ✅ **Real authentication** - Secure user accounts
- ✅ **Persistent storage** - Data never lost
- ✅ **Scalability** - Handle thousands of users
- ✅ **Real-time updates** - Live data sync
- ✅ **Analytics** - Track usage patterns
- ✅ **Backup** - Automatic data backup

---

## 💡 Pro Tips

1. **Start with Firebase** - Easiest to set up
2. **Test locally first** - Use test mode
3. **Secure your rules** - Don't leave in test mode
4. **Monitor usage** - Check Firebase console
5. **Backup regularly** - Export Firestore data
6. **Use environment variables** - Don't commit API keys
7. **Add error handling** - Graceful fallbacks

---

## 🆘 Troubleshooting

### Firebase not loading?
- Check internet connection
- Verify Firebase scripts are loaded
- Check browser console for errors

### Authentication failing?
- Verify email/password is enabled in Firebase
- Check security rules
- Clear browser cache

### Data not saving?
- Check Firestore rules
- Verify user is authenticated
- Check browser console

### CORS errors?
- Add your domain to Firebase authorized domains
- Check Firebase hosting settings

---

**Ready to integrate?** Start with Firebase - it's the easiest option! 🚀

Need help? Check the Firebase documentation: https://firebase.google.com/docs
