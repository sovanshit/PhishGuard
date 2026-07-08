# 🚀 Quick Database Setup (5 Minutes)

## Step 1: Create Firebase Project (2 min)

1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Name it: **PhishGuard**
4. Disable Google Analytics (optional)
5. Click **"Create project"**

---

## Step 2: Enable Firestore (1 min)

1. In left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for now)
4. Choose your region (closest to you)
5. Click **"Enable"**

---

## Step 3: Enable Authentication (1 min)

1. In left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click **"Email/Password"** → Enable it → Save
4. (Optional) Click **"Google"** → Enable it → Save

---

## Step 4: Get Your Config (1 min)

1. Click the **gear icon** ⚙️ → **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the **web icon** `</>`
4. Register app name: **PhishGuard**
5. **Copy the firebaseConfig object**

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "phishguard-xxx.firebaseapp.com",
  projectId: "phishguard-xxx",
  storageBucket: "phishguard-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## Step 5: Add to Your Project (30 sec)

Open `index.html` and add **before** `</body>`:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>

<!-- Firebase Configuration -->
<script>
  // PASTE YOUR CONFIG HERE
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

<!-- Your App (keep this last) -->
<script src="assets/js/app.js"></script>
</body>
</html>
```

---

## ✅ That's It!

Your database is now connected! 

### Test It:
1. Open `index.html` in browser
2. Click **"Sign Up"**
3. Create an account
4. Go to Firebase Console → Firestore Database
5. You should see your user data! 🎉

---

## 🔒 Important: Secure Your Database

After testing, update Firestore rules:

1. Go to **Firestore Database** → **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
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

3. Click **"Publish"**

---

## 📊 What You Get:

- ✅ Real user authentication
- ✅ Data saved to cloud
- ✅ Access from any device
- ✅ Automatic backups
- ✅ Real-time sync
- ✅ Free tier: 50K reads/day, 20K writes/day

---

## 🆘 Troubleshooting

### "Firebase is not defined"
- Check if Firebase scripts are loaded before app.js
- Check internet connection

### "Permission denied"
- Make sure you're signed in
- Check Firestore rules

### Data not showing
- Open browser console (F12)
- Check for error messages
- Verify Firebase config is correct

---

## 📚 Next Steps

1. **Test authentication** - Sign up, sign in, sign out
2. **Test scans** - Scan URLs and check Firestore
3. **Secure rules** - Update Firestore security rules
4. **Monitor usage** - Check Firebase console regularly

---

**Need more help?** Check `DATABASE_INTEGRATION_GUIDE.md` for detailed instructions!
