# PhishGuard Browser Extension

<div align="center">

🛡️ **Real-time protection against phishing threats**

[![Chrome](https://img.shields.io/badge/Chrome-Compatible-green?logo=googlechrome)](https://www.google.com/chrome/)
[![Edge](https://img.shields.io/badge/Edge-Compatible-blue?logo=microsoftedge)](https://www.microsoft.com/edge)
[![Brave](https://img.shields.io/badge/Brave-Compatible-orange?logo=brave)](https://brave.com/)

</div>

---

## 🚀 Quick Start

### 1️⃣ Configure

Open `config.js` and update your website URL:

```javascript
WEBSITE_URL: 'https://yourdomain.com',
```

### 2️⃣ Install

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `Extension` folder

### 3️⃣ Use

- Extension automatically scans pages
- Click icon to see threat analysis
- Click "View Dashboard" to open website

---

## ✨ Features

- ✅ **Auto-Detection** - Scans every URL automatically
- ✅ **Real-Time Alerts** - Instant notifications for threats
- ✅ **Threat Analysis** - Advanced URL scoring system
- ✅ **Visual Badges** - Color-coded safety indicators
- ✅ **Dashboard Integration** - Opens your PhishGuard website
- ✅ **Scan History** - Track analyzed URLs
- ✅ **Statistics** - Monitor scans and blocked threats
- ✅ **Beautiful UI** - iOS-style liquid glass interface

---

## 📁 Extension Structure

```
Extension/
├── manifest.json          # Extension configuration
├── config.js             # Website URL & settings (CONFIGURE THIS!)
├── popup.html            # Extension popup interface
├── popup.js              # Popup logic & URL analysis
├── popup.css             # Popup styling
├── background.js         # Background service worker
├── icons/                # Extension icons (16, 48, 128)
└── docs/                 # 📚 Documentation
    ├── README.md                  # Detailed features & usage
    ├── INSTALLATION_GUIDE.md      # Step-by-step installation
    ├── CONFIGURATION.md           # Configuration options
    ├── TESTING_GUIDE.md           # Testing checklist
    ├── CHANGELOG.md               # Version history
    └── ICONS_README.md            # Icon creation guide
```

---

## 📚 Documentation

**Quick Links:**

- 🚀 [Complete Feature Guide](docs/README.md)
- 💿 [Installation Instructions](docs/INSTALLATION_GUIDE.md)
- ⚙️ [Configuration Guide](docs/CONFIGURATION.md)
- ✅ [Testing Checklist](docs/TESTING_GUIDE.md)
- 📝 [Version History](docs/CHANGELOG.md)
- 🎨 [Icon Creation Guide](docs/ICONS_README.md)
- 📁 [Folder Structure](docs/FOLDER_STRUCTURE.md)
- 📖 [Documentation Index](docs/INDEX.md)

**All documentation is organized in the [`docs/`](docs/) folder.**

---

## ⚙️ Configuration Options

Edit `config.js` to customize behavior:

```javascript
const CONFIG = {
  WEBSITE_URL: 'https://yourdomain.com',  // Your website URL
  AUTO_SCAN: true,                         // Auto-scan pages
  SHOW_NOTIFICATIONS: true,                // Show threat alerts
  SCAN_DELAY: 500                          // Delay before auto-scan (ms)
};
```

See [Configuration Guide](docs/CONFIGURATION.md) for details.

---

## 🎯 How It Works

### Automatic Protection

1. You visit a website
2. Extension automatically scans the URL
3. Analysis completes in < 1 second
4. Badge shows result:
   - 🟢 **Green (✓)** = Safe
   - 🟡 **Yellow (⚠)** = Suspicious
   - 🔴 **Red (✗)** = Malicious

### Dashboard Integration

Click "View Dashboard" in popup → Opens your PhishGuard website dashboard

- If logged in: Shows scan history and analytics
- If not logged in: Shows sign-in prompt

---

## 🔒 Privacy & Security

- ✅ All data stored locally in browser
- ✅ No external tracking or analytics
- ✅ No data sent to third parties
- ✅ Open source analysis algorithm
- ✅ Works offline (no API calls required)

---

## 🌐 Browser Support

| Browser | Status | Version |
|---------|--------|---------|
| Google Chrome | ✅ Fully Supported | 88+ |
| Microsoft Edge | ✅ Fully Supported | 88+ |
| Brave | ✅ Fully Supported | Latest |
| Opera | ✅ Fully Supported | Latest |
| Firefox | ⚠️ Partial Support | Requires Manifest v2 |

---

## 🛠️ Development

### File Overview

- **`manifest.json`** - Extension metadata and permissions
- **`config.js`** - Configuration (website URL, settings)
- **`popup.html/js/css`** - Extension popup interface
- **`background.js`** - Background service worker
- **`icons/`** - Extension icons (PNG format)

### Making Changes

1. Edit files in Extension folder
2. Go to `chrome://extensions/`
3. Click reload button on PhishGuard
4. Test changes in popup

---

## 📊 Threat Detection

The extension analyzes URLs for:

- ❌ Suspicious TLDs (.xyz, .tk, .ml, etc.)
- ❌ Lookalike domains (paypa1, g00gle, etc.)
- ❌ IP addresses instead of domains
- ❌ Missing SSL/HTTPS
- ❌ Phishing keywords (login, verify, urgent, etc.)
- ❌ URL shorteners
- ❌ Excessive subdomains
- ❌ Unusually long URLs

---

## 🆘 Troubleshooting

### Extension Won't Load

- Check all icon files exist (icon16.png, icon48.png, icon128.png)
- Verify manifest.json has no syntax errors
- Enable Developer Mode in `chrome://extensions/`

### Dashboard Opens Wrong URL

- Update `WEBSITE_URL` in `config.js`
- Reload extension
- Clear browser cache

### No Notifications

- Check browser notification permissions
- Set `SHOW_NOTIFICATIONS: true` in config
- Reload extension

See [Configuration Guide](docs/CONFIGURATION.md) for more help.

---

## 📝 Notes

- **First Install**: Configure `config.js` before installing
- **After Deployment**: Update website URL in `config.js`
- **Updates**: Reload extension after any file changes
- **Permissions**: Extension requires tab access for URL scanning

---

## 🚀 Next Steps

1. ✅ Configure `config.js` with your website URL
2. ✅ Install extension in browser
3. ✅ Test scanning functionality
4. ✅ Test dashboard integration
5. ✅ Review [Testing Guide](docs/TESTING_GUIDE.md)
6. ✅ Deploy website and update config
7. ✅ Enjoy real-time protection!

---

## 📞 Support

For detailed help, see the documentation in the `docs/` folder:

- Installation issues → [Installation Guide](docs/INSTALLATION_GUIDE.md)
- Configuration help → [Configuration Guide](docs/CONFIGURATION.md)
- Testing checklist → [Testing Guide](docs/TESTING_GUIDE.md)
- Feature questions → [Main README](docs/README.md)

---

<div align="center">

**Built with ❤️ for a safer web**

🛡️ **PhishGuard** - Verify Before You Trust

</div>
