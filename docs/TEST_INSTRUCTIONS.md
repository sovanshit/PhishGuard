# Testing Instructions

## Issues Fixed:

### 1. Dashboard Not Showing Updated History
**Fix Applied:** Added `saveSession()` call after adding new scan results to history in the `doScan()` function.

**How to Test:**
1. Open `check.html` in your browser
2. Scan a URL (e.g., "google.com")
3. Wait for the scan to complete
4. Navigate to `dashboard.html`
5. You should now see the scanned URL in the "Scan History" table at the bottom
6. The metrics at the top should also reflect the new scan

**Note:** You need to be signed in to see the dashboard content. If not signed in, you'll see a "Sign In Required" message.

### 2. Paste Button Not Working
**Fix Applied:** Improved the `pasteURL()` function with better error handling and user feedback.

**How to Test:**
1. Copy any URL to your clipboard (e.g., copy "https://github.com")
2. Open `check.html` in your browser
3. Click the "PASTE" button next to the URL input field
4. The copied URL should appear in the input field
5. The "Scan URL" button should become enabled

**Important Notes:**
- The clipboard API requires HTTPS or localhost to work
- If testing on `file://` protocol, the paste button may not work due to browser security restrictions
- If clipboard access is denied, you'll see an error toast message
- For best results, test on a local server (e.g., using Live Server extension in VS Code)

### 3. Additional Improvement
**Changed:** Increased history limit from 10 to 100 items so more scan history is preserved.

## Quick Test Workflow:

1. **Sign Up/Sign In:**
   - Open `signin.html`
   - Click "Sign Up" tab
   - Fill in name, email, password
   - Check the terms checkbox
   - Click "Create Account"

2. **Scan URLs:**
   - Navigate to `check.html`
   - Test the paste button with a copied URL
   - Scan multiple URLs (try both safe and suspicious ones)
   - Examples to test:
     - google.com (should be Safe)
     - paypa1-login.xyz (should be Malicious/Phishing)
     - github.com (should be Safe)

3. **Check Dashboard:**
   - Navigate to `dashboard.html`
   - Verify all scanned URLs appear in the history table
   - Check that metrics are updated
   - Try the filter buttons (All, Safe, Suspicious, Malicious)
   - Try the search box to filter URLs

## Troubleshooting:

**If history is not showing:**
- Open browser DevTools (F12)
- Go to Application/Storage tab
- Check localStorage for `phishguard_history` key
- If it exists, the data is being saved correctly

**If paste button doesn't work:**
- Make sure you're testing on localhost or HTTPS
- Check browser console for any errors
- Try manually pasting (Ctrl+V) as a fallback
- Some browsers may require explicit clipboard permission

**If dashboard shows "Sign In Required":**
- You need to sign in first via `signin.html`
- Check localStorage for `phishguard_user` key
- If missing, sign in again
