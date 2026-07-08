# PhishGuard Extension Installation Guide

## ⚙️ Configuration First (Important!)

**Before installing**, configure the extension to connect with your website:

1. Open `Extension/config.js` in a text editor
2. Update `WEBSITE_URL` to your deployed website URL:
   - Local testing: `http://localhost/PhishGuard_mine/index.html`
   - Production: `https://yourdomain.com`
3. Save the file

See `CONFIGURATION.md` for detailed configuration options.

---

## Prerequisites

Before installing the extension, you need to create the icon files:

### Step 1: Create Icons

1. Navigate to `Extension/icons/` folder
2. Create three PNG files:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)  
   - `icon128.png` (128x128 pixels)

See `Extension/icons/ICONS_README.md` for detailed instructions on creating icons.

**Quick Solution**: Use any green shield icon or security icon from free icon websites temporarily.

---

## Installation Instructions

### Google Chrome / Microsoft Edge / Brave

1. **Open Extensions Page**
   - Chrome: Type `chrome://extensions` in address bar
   - Edge: Type `edge://extensions` in address bar
   - Brave: Type `brave://extensions` in address bar
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Look for "Developer mode" toggle in top-right corner
   - Turn it ON

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to and select the `Extension` folder (the one containing manifest.json)
   - Click "Select Folder"

4. **Verify Installation**
   - PhishGuard should appear in your extensions list
   - You'll see the PhishGuard icon in your browser toolbar
   - The extension is now active!

### Mozilla Firefox

1. **Open Debugging Page**
   - Type `about:debugging#/runtime/this-firefox` in address bar
   - Or: Menu → More Tools → Web Developer Tools → Settings

2. **Load Temporary Add-on**
   - Click "Load Temporary Add-on" button
   - Navigate to the `Extension` folder
   - Select the `manifest.json` file
   - Click "Open"

3. **Note**: Firefox extensions loaded this way are temporary and will be removed when you restart Firefox

### Opera

1. **Open Extensions Page**
   - Type `opera://extensions` in address bar
   - Or: Menu → Extensions → Extensions

2. **Enable Developer Mode**
   - Click "Developer mode" button in top-right

3. **Load Extension**
   - Click "Load unpacked extension"
   - Select the `Extension` folder
   - Click "Select Folder"

---

## First Time Setup

After installation:

1. **Pin the Extension**
   - Click the puzzle piece icon in your toolbar
   - Find "PhishGuard - URL Security Scanner"
   - Click the pin icon to keep it visible

2. **Grant Permissions**
   - The extension needs permissions to:
     - Read and scan URLs
     - Show notifications
     - Store scan history
   - Click "Allow" when prompted

3. **Test the Extension**
   - Visit any website
   - Click the PhishGuard icon
   - You should see the scan results

---

## Using the Extension

### Automatic Scanning

- Every page you visit is automatically scanned
- Check the badge on the icon:
  - **No badge** = Safe (green)
  - **⚠ symbol** = Suspicious (yellow/orange)
  - **✗ symbol** = Malicious (red)

### Manual Actions

1. **View Details**
   - Click the PhishGuard icon
   - See detailed threat analysis
   - View threat indicators

2. **Rescan**
   - Click "Scan This Page" button
   - Useful after page updates

3. **Open Dashboard**
   - Click "View Dashboard" button
   - Opens the full PhishGuard web app

### Notifications

- Dangerous sites trigger automatic alerts
- Notifications show:
  - Threat level
  - Risk score
  - Main threat indicators

---

## Troubleshooting

### Extension Not Showing Up

1. Make sure icons exist in `Extension/icons/` folder
2. Check that `manifest.json` is in the Extension folder
3. Try reloading the extension
4. Check browser console for errors

### Not Scanning Pages

1. Extension only works on HTTP/HTTPS pages
2. Cannot scan: `chrome://`, `edge://`, `about:` pages
3. Check extension permissions
4. Try re-installing

### Badge Not Updating

1. Reload the extension
2. Refresh the webpage
3. Check if extension is enabled

### Notifications Not Appearing

1. Check browser notification settings
2. Enable notifications for the extension
3. Check system notification settings

---

## Updating the Extension

When you make changes to the extension code:

1. Go to extensions page
2. Find PhishGuard
3. Click the refresh icon (🔄)
4. Or click "Remove" and reinstall

---

## Uninstalling

### Chrome/Edge/Brave
1. Go to extensions page
2. Find PhishGuard
3. Click "Remove"
4. Confirm removal

### Firefox
1. Go to `about:addons`
2. Find PhishGuard
3. Click "..." menu
4. Click "Remove"

---

## Features Overview

✅ **Auto-Detection**: Scans every URL automatically
✅ **Real-Time Alerts**: Instant notifications for threats
✅ **Visual Indicators**: Color-coded badges
✅ **Threat Analysis**: Detailed risk assessment
✅ **Scan History**: Track analyzed URLs
✅ **Statistics**: Monitor scans and blocks
✅ **Beautiful UI**: iOS-style liquid glass design

---

## Privacy & Security

- All scanning happens locally in your browser
- No data sent to external servers
- Your browsing history stays private
- Scan history stored locally

---

## Support

**Issues?**
- Check troubleshooting section above
- Review browser console for errors
- Ensure all files are in correct locations
- Verify icons are created

**Questions?**
- See README.md for feature details
- Check icons/ICONS_README.md for icon help

---

## Development

Want to customize the extension?

**Files:**
- `manifest.json` - Extension configuration
- `popup.html` - Popup interface
- `popup.css` - Popup styling
- `popup.js` - Popup logic
- `background.js` - Background monitoring
- `icons/` - Extension icons

**Making Changes:**
1. Edit the files
2. Save changes
3. Reload extension in browser
4. Test the changes

---

## Version

Current Version: 1.0.0

Last Updated: December 2024

---

Enjoy safe browsing with PhishGuard! 🛡️
