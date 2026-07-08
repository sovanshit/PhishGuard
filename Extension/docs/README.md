# PhishGuard Browser Extension

Real-time protection against phishing threats. Automatically detects and alerts you about suspicious and malicious URLs.

## Features

✅ **Auto-Detection**: Automatically scans every URL you visit
✅ **Real-Time Alerts**: Instant notifications for suspicious/malicious sites
✅ **Threat Analysis**: Advanced URL analysis with scoring system
✅ **Visual Indicators**: Color-coded badges on extension icon
✅ **Detailed Reports**: View threat indicators and risk levels
✅ **Scan History**: Track all analyzed URLs
✅ **Statistics**: Monitor total scans and blocked threats
✅ **Dashboard Integration**: Opens your PhishGuard website dashboard
✅ **Beautiful UI**: iOS-style liquid glass interface

## ⚙️ Setup & Installation

### Step 1: Configure Extension

**IMPORTANT**: Before installing, configure the extension to connect with your website:

1. Open `config.js` in the Extension folder
2. Update `WEBSITE_URL`:
   ```javascript
   WEBSITE_URL: 'https://yourdomain.com',  // Change to your website
   ```
3. Save the file

See `CONFIGURATION.md` for detailed setup instructions.

### Step 2: Install Extension

### Chrome/Edge/Brave

1. Open your browser and go to extensions page:
   - **Chrome**: `chrome://extensions`
   - **Edge**: `edge://extensions`
   - **Brave**: `brave://extensions`

2. Enable "Developer mode" (toggle in top-right)

3. Click "Load unpacked"

4. Select the `Extension` folder from PhishGuard

5. The extension is now installed! Look for the PhishGuard icon in your toolbar

### Firefox

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`

2. Click "Load Temporary Add-on"

3. Select the `manifest.json` file from the Extension folder

4. The extension is now installed!

## How to Use

### Automatic Protection

- The extension automatically scans every page you visit
- Green badge = Safe site
- Yellow/Orange badge (⚠) = Suspicious site
- Red badge (✗) = Malicious site
- Notifications appear for dangerous sites

### Manual Scan

1. Click the PhishGuard icon in your toolbar
2. View the current page analysis
3. Click "Scan This Page" to rescan
4. Click "View Dashboard" to open the full web app

### Understanding Scores

- **80-100**: Safe - Low risk, trusted site
- **58-79**: Suspicious - Proceed with caution
- **0-57**: Malicious - High risk, avoid if possible

## Threat Indicators

The extension checks for:
- Suspicious domain extensions (.xyz, .tk, etc.)
- Lookalike domains (paypa1.com vs paypal.com)
- IP addresses instead of domains
- Missing SSL certificates (HTTP only)
- Phishing keywords (login, verify, urgent, etc.)
- URL shorteners
- Excessive subdomains
- Unusual URL patterns

## Privacy

- All analysis happens locally in your browser
- No data is sent to external servers
- Your browsing history stays private
- Optional: Sync with PhishGuard web app for cross-device protection

## Support

For issues or questions:
- Open an issue on GitHub
- Email: support@phishguard.com
- Visit: https://phishguard.app

## Version

Current version: 1.0.0

## License

MIT License - See main project for details
