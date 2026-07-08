/* ═══════════════════════════════════════════════════════════════
   FIREBASE DATABASE FUNCTIONS FOR PHISHGUARD
   
   This file handles all Firebase database operations including:
   - User profile management
   - Scan history storage
   - Authentication
   - Real-time data sync
═══════════════════════════════════════════════════════════════ */

// Check if Firebase is initialized
function isFirebaseReady() {
  return typeof firebase !== 'undefined' && firebase.apps.length > 0;
}

/* ─────────────────────────────────────────────────────────────
   USER MANAGEMENT
───────────────────────────────────────────────────────────── */

/**
 * Create user profile in Firestore
 * @param {string} userId - Firebase user ID
 * @param {object} userData - User data (name, email, etc.)
 * @returns {Promise<boolean>} Success status
 */
async function createUserProfile(userId, userData) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return false;
  }
  
  try {
    await db.collection('users').doc(userId).set({
      name: userData.name,
      email: userData.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      profilePicture: userData.profilePicture || null,
      loginMethod: userData.loginMethod || 'Email'
    });
    console.log('User profile created successfully');
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
}

/**
 * Get user profile from Firestore
 * @param {string} userId - Firebase user ID
 * @returns {Promise<object|null>} User profile data or null
 */
async function getUserProfile(userId) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return null;
  }
  
  try {
    const doc = await db.collection('users').doc(userId).get();
    if (doc.exists) {
      return doc.data();
    }
    console.log('User profile not found');
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Update user profile in Firestore
 * @param {string} userId - Firebase user ID
 * @param {object} updates - Fields to update
 * @returns {Promise<boolean>} Success status
 */
async function updateUserProfile(userId, updates) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return false;
  }
  
  try {
    // If profilePicture is too large, don't save it to Firestore
    if (updates.profilePicture && updates.profilePicture.length > 1000000) {
      console.warn('Profile picture too large for Firestore, skipping cloud sync');
      // Remove profilePicture from updates to avoid Firestore error
      const { profilePicture, ...otherUpdates } = updates;
      if (Object.keys(otherUpdates).length > 0) {
        await db.collection('users').doc(userId).update(otherUpdates);
      }
      console.log('User profile updated successfully (without profile picture)');
      return true;
    }
    
    await db.collection('users').doc(userId).update(updates);
    console.log('User profile updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

/**
 * Delete user profile and all associated data
 * @param {string} userId - Firebase user ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteUserProfile(userId) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return false;
  }
  
  try {
    // Delete all user scans first
    await clearUserScans(userId);
    
    // Delete user profile
    await db.collection('users').doc(userId).delete();
    
    // Delete Firebase auth account
    const user = auth.currentUser;
    if (user && user.uid === userId) {
      await user.delete();
    }
    
    console.log('User profile deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   SCAN HISTORY MANAGEMENT
───────────────────────────────────────────────────────────── */

/**
 * Save scan result to Firestore
 * @param {string} userId - Firebase user ID
 * @param {object} scanData - Scan result data
 * @returns {Promise<boolean>} Success status
 */
async function saveScanResult(userId, scanData) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return false;
  }
  
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
      clr: scanData.clr,
      bgClr: scanData.bgClr,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('Scan result saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving scan:', error);
    return false;
  }
}

/**
 * Get user's scan history from Firestore
 * @param {string} userId - Firebase user ID
 * @param {number} limit - Maximum number of scans to retrieve
 * @returns {Promise<Array>} Array of scan results
 */
async function getUserScans(userId, limit = 100) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return [];
  }
  
  try {
    // Try to get scans with orderBy - if index doesn't exist, fall back to simple query
    let snapshot;
    try {
      snapshot = await db.collection('scans')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
    } catch (indexError) {
      // If index error, just get scans without ordering
      console.log('Firestore index not created yet, fetching without ordering');
      snapshot = await db.collection('scans')
        .where('userId', '==', userId)
        .limit(limit)
        .get();
    }
    
    const scans = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      scans.push({
        id: doc.id,
        ...data,
        date: data.timestamp?.toDate().toLocaleString() || 'Unknown',
        safe: data.score >= 80
      });
    });
    
    // Sort manually if we couldn't use orderBy
    scans.sort((a, b) => {
      const timeA = a.timestamp?.toDate().getTime() || 0;
      const timeB = b.timestamp?.toDate().getTime() || 0;
      return timeB - timeA;
    });
    
    console.log(`Retrieved ${scans.length} scans for user`);
    return scans;
  } catch (error) {
    console.error('Error getting scans:', error);
    return [];
  }
}

/**
 * Delete a specific scan
 * @param {string} scanId - Scan document ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteScan(scanId) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return false;
  }
  
  try {
    await db.collection('scans').doc(scanId).delete();
    console.log('Scan deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting scan:', error);
    return false;
  }
}

/**
 * Clear all scans for a user
 * @param {string} userId - Firebase user ID
 * @returns {Promise<boolean>} Success status
 */
async function clearUserScans(userId) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return false;
  }
  
  try {
    const snapshot = await db.collection('scans')
      .where('userId', '==', userId)
      .get();
    
    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Cleared ${snapshot.size} scans for user`);
    return true;
  } catch (error) {
    console.error('Error clearing scans:', error);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   AUTHENTICATION
───────────────────────────────────────────────────────────── */

/**
 * Sign up with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User full name
 * @returns {Promise<object>} Result object with success status
 */
async function signUpWithEmail(email, password, name) {
  if (!isFirebaseReady()) {
    return { success: false, error: 'Firebase not initialized' };
  }
  
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await createUserProfile(user.uid, {
      name: name,
      email: email,
      loginMethod: 'Email'
    });
    
    console.log('User signed up successfully');
    return { success: true, user: user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} Result object with user and profile data
 */
async function signInWithEmail(email, password) {
  if (!isFirebaseReady()) {
    return { success: false, error: 'Firebase not initialized' };
  }
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Get user profile from Firestore
    const profile = await getUserProfile(user.uid);
    
    console.log('User signed in successfully');
    return { success: true, user: user, profile: profile };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign in with Google
 * @returns {Promise<object>} Result object with user and profile data
 */
async function signInWithGoogleProvider() {
  if (!isFirebaseReady()) {
    return { success: false, error: 'Firebase not initialized' };
  }
  
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    
    // Check if user profile exists
    let profile = await getUserProfile(user.uid);
    
    // Create profile if it doesn't exist (first time sign in)
    if (!profile) {
      await createUserProfile(user.uid, {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        loginMethod: 'Google'
      });
      profile = await getUserProfile(user.uid);
    }
    
    console.log('User signed in with Google successfully');
    return { success: true, user: user, profile: profile };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign out current user
 * @returns {Promise<boolean>} Success status
 */
async function signOutUser() {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return false;
  }
  
  try {
    await auth.signOut();
    console.log('User signed out successfully');
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<object>} Result object with success status
 */
async function changeUserPassword(currentPassword, newPassword) {
  if (!isFirebaseReady()) {
    return { success: false, error: 'Firebase not initialized' };
  }
  
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No user signed in' };
    }
    
    // Re-authenticate user before changing password
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await user.reauthenticateWithCredential(credential);
    
    // Update password
    await user.updatePassword(newPassword);
    
    console.log('Password changed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error changing password:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Listen to authentication state changes
 * @param {function} callback - Callback function to handle auth state
 */
function onAuthStateChanged(callback) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return;
  }
  
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

/**
 * Listen to user's scans in real-time
 * @param {string} userId - Firebase user ID
 * @param {function} callback - Callback function to handle scan updates
 * @returns {function} Unsubscribe function
 */
function listenToUserScans(userId, callback) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return null;
  }
  
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
          date: data.timestamp?.toDate().toLocaleString() || 'Unknown',
          safe: data.score >= 80
        });
      });
      callback(scans);
    }, error => {
      console.error('Error listening to scans:', error);
    });
}

/**
 * Listen to user profile changes in real-time
 * @param {string} userId - Firebase user ID
 * @param {function} callback - Callback function to handle profile updates
 * @returns {function} Unsubscribe function
 */
function listenToUserProfile(userId, callback) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return null;
  }
  
  return db.collection('users')
    .doc(userId)
    .onSnapshot(doc => {
      if (doc.exists) {
        callback(doc.data());
      }
    }, error => {
      console.error('Error listening to profile:', error);
    });
}

/* ─────────────────────────────────────────────────────────────
   STATISTICS & ANALYTICS
───────────────────────────────────────────────────────────── */

/**
 * Get scan statistics for a user
 * @param {string} userId - Firebase user ID
 * @returns {Promise<object>} Statistics object
 */
async function getUserStats(userId) {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized');
    return { total: 0, safe: 0, suspicious: 0, malicious: 0 };
  }
  
  try {
    const snapshot = await db.collection('scans')
      .where('userId', '==', userId)
      .get();
    
    let total = 0;
    let safe = 0;
    let suspicious = 0;
    let malicious = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      total++;
      
      if (data.status === 'Safe') safe++;
      else if (data.status === 'Suspicious') suspicious++;
      else malicious++;
    });
    
    return { total, safe, suspicious, malicious };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { total: 0, safe: 0, suspicious: 0, malicious: 0 };
  }
}

/* ─────────────────────────────────────────────────────────────
   UTILITY FUNCTIONS
───────────────────────────────────────────────────────────── */

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
function isUserAuthenticated() {
  if (!isFirebaseReady()) return false;
  return auth.currentUser !== null;
}

/**
 * Get current user ID
 * @returns {string|null} User ID or null
 */
function getCurrentUserId() {
  if (!isFirebaseReady()) return null;
  return auth.currentUser?.uid || null;
}

/**
 * Get current user email
 * @returns {string|null} User email or null
 */
function getCurrentUserEmail() {
  if (!isFirebaseReady()) return null;
  return auth.currentUser?.email || null;
}

console.log('Firebase database functions loaded');
