# PhishGuard Extension Configuration Guide

## 📋 Overview

This guide explains how to configure your PhishGuard browser extension to connect with your deployed website.

---

## ⚙️ Configuration Steps

### Step 1: Open config.js

1. Navigate to the Extension folder
2. Open `config.js` in a text editor

### Step 2: Update Website URL

Find this line in `config.js`:

```javascript
WEBSITE_URL: 'http://localhost/PhishGuard_mine/index.html',
```

Replace it with your actual website URL:

#### For Local Testing
```javascript
WEBSITE_URL: 'http://localhost/PhishGuard_mine/index.html',
```

#### For Netlify Deployment
```javascript
WEBSITE_URL: 'https://your-site-name.netlify.app',
```

#### For Custom Domain
```javascript
WEBSITE_URL: 'https://phishguard.com',
```

#### For Vercel
```javascript
WEBSITE_URL: 'https://your-project.vercel.app',
```

#### For Firebase Hosting
```javascript
WEBSITE_URL: 'https://your-project.web.app',
```

### Step 3: Save Changes

1. Save the `config.js` file
2. Reload the extension in Chrome:
   - Go to `chrome://extensions/`
   - Click the reload icon on PhishGuard extension
   - Or toggle the extension off and on

### Step 4: Test Dashboard Link

1. Click the PhishGuard extension icon
2. Click "View Dashboard" button
3. It should open your website's dashboard page
4. If not logged in, it will show the login prompt

---

## 🔧 Configuration Options

### AUTO_SCAN

Controls whether the extension automatically scans pages when you visit them.

```javascript
AUTO_SCAN: true  // Default: true
```

- `true`: Automatically scan every page you visit
- `false`: Manual scan only (click "Scan This Page")

### SHOW_NOTIFICATIONS

Controls whether to show browser notifications for threats.

```javascript
SHOW_NOTIFICATIONS: true  // Default: true
```

- `true`: Show notifications for suspicious/malicious sites
- `false`: Silent mode, no notifications

### SCAN_DELAY

Time to wait before auto-scanning (in milliseconds).

```javascript
SCAN_DELAY: 500  // Default: 500ms
```

- Lower values = faster scans
- Higher values = less CPU usage

---

## 🌐 Dashboard Integration

### How It Works

When you click "View Dashboard" in the extension:

1. ✅ Opens a new tab with your website
2. ✅ Navigates directly to the dashboard page (`#dashboard`)
3. ✅ Uses the same authentication (cookies/localStorage)
4. ✅ Shows your scan history and stats

### Important Notes

- **Same Browser**: The extension and website must be in the same browser to share authentication
- **HTTPS Required**: For production, your website should use HTTPS
- **Login Required**: Users must be logged in to see dashboard data

---

## 🔄 After Deployment Checklist

After deploying your website:

1. ✅ Update `WEBSITE_URL` in `config.js`
2. ✅ Save the file
3. ✅ Reload extension in Chrome
4. ✅ Test dashboard link
5. ✅ Test with logged in account
6. ✅ Test with logged out account
7. ✅ Verify scan history syncs

---

## 🚀 Publishing the Extension

If you plan to publish to Chrome Web Store:

### Before Publishing

1. Update `WEBSITE_URL` to your production domain
2. Test thoroughly with production website
3. Ensure all features work
4. Update version in `manifest.json` if needed

### For Multiple Environments

If you want different configs for dev/prod:

**Development:**
```javascript
WEBSITE_URL: 'http://localhost/PhishGuard_mine/index.html',
```

**Production:**
```javascript
WEBSITE_URL: 'https://phishguard.com',
```

Create two versions of the extension folder and use the appropriate one.

---

## 🐛 Troubleshooting

### Dashboard Opens Wrong URL

**Problem**: Dashboard button opens wrong website

**Solution**:
1. Check `config.js` has correct URL
2. Reload extension
3. Clear browser cache
4. Try again

### Dashboard Shows Login Page

**Problem**: Dashboard always shows login even when logged in

**Solution**:
1. Make sure you're logged in on the website first
2. Extension and website share same browser storage
3. Try logging in on website, then click extension dashboard

### Extension Not Loading

**Problem**: Extension shows errors after config change

**Solution**:
1. Check `config.js` syntax (no extra commas, quotes match)
2. Reload extension
3. Check browser console for errors (`F12` → Console)

---

## 📝 Example Configurations

### Complete Local Setup
```javascript
const CONFIG = {
  WEBSITE_URL: 'http://localhost/PhishGuard_mine/index.html',
  AUTO_SCAN: true,
  SHOW_NOTIFICATIONS: true,
  SCAN_DELAY: 500
};
```

### Complete Production Setup
```javascript
const CONFIG = {
  WEBSITE_URL: 'https://phishguard.com',
  AUTO_SCAN: true,
  SHOW_NOTIFICATIONS: true,
  SCAN_DELAY: 500
};
```

### Silent Mode (No Notifications)
```javascript
const CONFIG = {
  WEBSITE_URL: 'https://phishguard.com',
  AUTO_SCAN: true,
  SHOW_NOTIFICATIONS: false,
  SCAN_DELAY: 500
};
```

---

## 🔒 Security Notes

- Never commit real API keys or secrets to config.js
- The extension only connects to your website
- All user data stays in browser storage
- No external analytics or tracking

---

## ✅ Testing Checklist

After configuration:

- [ ] Extension loads without errors
- [ ] Current page scanning works
- [ ] Dashboard button opens correct website
- [ ] Dashboard shows login if not authenticated
- [ ] Dashboard shows data if authenticated
- [ ] Stats count correctly
- [ ] Notifications work (if enabled)
- [ ] Manual scan button works

---

## 📞 Support

If you need help:
1. Check browser console for errors
2. Verify `config.js` syntax
3. Test with local website first
4. Ensure website is deployed and accessible

---

**Configuration Complete! 🎉**

Your extension is now connected to your website dashboard!
