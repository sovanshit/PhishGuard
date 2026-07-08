# PhishGuard Extension Testing Guide

## 🧪 Testing Checklist

Use this guide to verify all extension features work correctly.

---

## ✅ Pre-Installation Tests

### 1. Configuration Check

- [ ] `config.js` exists
- [ ] `WEBSITE_URL` is set correctly
- [ ] No syntax errors in config
- [ ] All settings are valid

**Test Command** (in browser console):
```javascript
// After loading popup
console.log(CONFIG);
// Should show your configuration object
```

---

## ✅ Installation Tests

### 2. Extension Loading

- [ ] Extension loads without errors
- [ ] Icons display correctly (16, 48, 128)
- [ ] Manifest is valid
- [ ] All permissions granted

**Check**: `chrome://extensions/` → PhishGuard should show "No errors"

---

## ✅ Functionality Tests

### 3. Current Page Scanning

**Test Steps:**
1. Open a safe website (e.g., google.com)
2. Click PhishGuard extension icon
3. Extension should auto-scan

**Expected Results:**
- [ ] Loading spinner appears briefly
- [ ] Status shows "Safe" with green color
- [ ] Score shows 80+ 
- [ ] SSL shows "Valid"
- [ ] Reputation shows "Clean"
- [ ] No threat flags appear

**Test URLs:**
- ✅ Safe: `https://github.com` → Should be Safe (90+)
- ⚠️ Suspicious: `http://paypa1-login.xyz` → Should be Suspicious/Malicious
- 🚨 Malicious: `https://verify-account-urgent.tk` → Should be Malicious

### 4. Manual Scan Button

**Test Steps:**
1. Click extension icon
2. Click "Scan This Page" button
3. Wait for analysis

**Expected Results:**
- [ ] Button triggers new scan
- [ ] Loading animation shows
- [ ] Results update correctly
- [ ] Stats increment

### 5. Dashboard Integration 🆕

**Test Steps:**
1. Open extension popup
2. Click "View Dashboard" button

**Expected Results:**
- [ ] New tab opens
- [ ] URL matches your configured `WEBSITE_URL`
- [ ] Page loads successfully
- [ ] Navigates to dashboard section (#dashboard)

**With Login:**
- [ ] Dashboard shows user data
- [ ] Scan history visible
- [ ] Charts load correctly
- [ ] Profile info displays

**Without Login:**
- [ ] Shows "Sign In Required" card
- [ ] Sign in button works
- [ ] After login, dashboard loads

### 6. Statistics Tracking

**Test Steps:**
1. Scan multiple URLs
2. Check stats in extension popup

**Expected Results:**
- [ ] "Scans" count increases
- [ ] "Blocked" count increases for unsafe URLs
- [ ] Numbers persist after closing popup
- [ ] Stats accurate

### 7. Notifications

**Test Steps:**
1. Visit a malicious URL (or use test URL)
2. Check for browser notification

**Expected Results:**
- [ ] Notification appears for score < 58
- [ ] Message shows threat level
- [ ] Score displayed correctly
- [ ] Icon shows in notification

**Note**: Must allow notifications in browser settings

### 8. Visual Badges

**Test Steps:**
1. Visit different URLs
2. Check extension icon badge

**Expected Results:**
- [ ] Green checkmark (✓) for safe sites
- [ ] Yellow warning (⚠) for suspicious sites  
- [ ] Red X (✗) for malicious sites
- [ ] Badge color matches status

---

## ✅ Edge Cases

### 9. Special URLs

Test these special cases:

**Browser Pages:**
- [ ] `chrome://extensions/` → Should show "Cannot scan"
- [ ] `about:blank` → Should handle gracefully

**Invalid URLs:**
- [ ] Local files → Should not crash
- [ ] Data URLs → Should handle gracefully

**Very Long URLs:**
- [ ] URL with 200+ characters → Should scan with "long URL" flag

### 10. Multiple Tabs

**Test Steps:**
1. Open 5 different websites in tabs
2. Click extension in each tab
3. Verify each shows correct results

**Expected Results:**
- [ ] Each tab scans independently
- [ ] No cross-tab contamination
- [ ] Stats count all scans
- [ ] History includes all URLs

---

## ✅ Performance Tests

### 11. Speed & Resource Usage

**Test Steps:**
1. Open Task Manager
2. Check extension memory usage
3. Scan multiple pages

**Expected Results:**
- [ ] Memory usage < 50MB
- [ ] CPU usage minimal when idle
- [ ] Scans complete in < 1 second
- [ ] No memory leaks after 10+ scans

### 12. Auto-Scan Timing

**Test Steps:**
1. Navigate to new website
2. Immediately click extension
3. Check if scan started

**Expected Results:**
- [ ] Auto-scan triggers after page load
- [ ] Delay matches `CONFIG.SCAN_DELAY`
- [ ] No double-scanning

---

## ✅ Configuration Tests

### 13. Config Changes

**Test Steps:**
1. Change `WEBSITE_URL` in config
2. Reload extension
3. Click "View Dashboard"

**Expected Results:**
- [ ] Opens new URL
- [ ] No console errors
- [ ] Dashboard loads correctly

**Test Multiple Configs:**
- [ ] Local URL: `http://localhost/...`
- [ ] Netlify URL: `https://site.netlify.app`
- [ ] Custom domain: `https://yourdomain.com`

### 14. Settings Toggle

**Test Steps:**
1. Set `AUTO_SCAN: false`
2. Reload extension
3. Navigate to website

**Expected Results:**
- [ ] Page doesn't auto-scan
- [ ] Manual "Scan This Page" still works

**Test Steps:**
1. Set `SHOW_NOTIFICATIONS: false`
2. Reload extension
3. Visit malicious site

**Expected Results:**
- [ ] No browser notification
- [ ] Badge still shows status
- [ ] Popup still works

---

## ✅ Cross-Browser Tests

### 15. Browser Compatibility

Test in multiple browsers:

**Chrome:**
- [ ] Extension loads
- [ ] All features work
- [ ] Dashboard integration works

**Edge:**
- [ ] Extension loads
- [ ] All features work
- [ ] Dashboard integration works

**Brave:**
- [ ] Extension loads
- [ ] All features work
- [ ] Dashboard integration works

**Firefox:**
- [ ] Extension loads (if applicable)
- [ ] Features work
- [ ] Dashboard integration works

---

## ✅ Integration Tests

### 16. Website Integration

**Test Full Workflow:**
1. Install extension
2. Visit website and sign up
3. Scan URLs in extension
4. Click "View Dashboard" in extension
5. Check dashboard shows scan history

**Expected Results:**
- [ ] Extension scans save to browser storage
- [ ] Dashboard button opens website
- [ ] Authentication persists
- [ ] Both extension and website work together

### 17. Data Sync

**Test Steps:**
1. Scan URL in extension
2. Open website dashboard
3. Check if scan appears

**Current Behavior:**
- Extension scans: Store in `chrome.storage.local`
- Website scans: Store in Firebase/localStorage
- **Not synced** (separate storage)

**Note**: Future version may sync extension scans to website account.

---

## 🐛 Common Issues & Solutions

### Dashboard Opens Wrong URL
**Solution**: Update `WEBSITE_URL` in `config.js` and reload extension

### No Notifications
**Solution**: Check browser notification permissions

### Stats Don't Update
**Solution**: Check `chrome.storage.local` permissions

### Extension Crashes
**Solution**: Check browser console for errors

### Dashboard Shows Login
**Solution**: Log in to website first, then click dashboard

---

## 📊 Test Report Template

```
Date: ___________
Browser: ___________
Version: ___________

✅ = Pass | ❌ = Fail | ⚠️ = Warning

[ ] Pre-Installation Tests
[ ] Installation Tests  
[ ] Functionality Tests
[ ] Edge Cases
[ ] Performance Tests
[ ] Configuration Tests
[ ] Cross-Browser Tests
[ ] Integration Tests

Issues Found:
1. _____________________
2. _____________________

Notes:
_____________________
```

---

## ✅ Final Checklist

Before marking as production-ready:

- [ ] All tests pass
- [ ] No console errors
- [ ] Dashboard integration works
- [ ] Multiple browsers tested
- [ ] Configuration documented
- [ ] Performance acceptable
- [ ] Icons display correctly
- [ ] Notifications work
- [ ] Stats track correctly
- [ ] Website integration tested

---

**Testing Complete! 🎉**

If all tests pass, your PhishGuard extension is ready for use!
