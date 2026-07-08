# PhishGuard Extension Changelog

## Version 1.1.0 - Dashboard Integration Update

### 🎉 New Features

#### Dashboard Integration
- ✅ "View Dashboard" button now opens the PhishGuard website dashboard
- ✅ Automatically navigates to dashboard page (`#dashboard`)
- ✅ Works with both local and deployed websites
- ✅ Shares authentication with website (same browser)

#### Configuration System
- ✅ New `config.js` file for easy setup
- ✅ Configurable website URL
- ✅ Auto-scan toggle option
- ✅ Notification preferences
- ✅ Scan delay settings

### 📝 Configuration

The extension now requires configuration before use. Update `config.js`:

```javascript
const CONFIG = {
  WEBSITE_URL: 'https://yourdomain.com',  // Your deployed website
  AUTO_SCAN: true,
  SHOW_NOTIFICATIONS: true,
  SCAN_DELAY: 500
};
```

### 🔧 Fixes

- Fixed dashboard link to open website instead of local copy
- Added hash-based navigation support for direct page access
- Improved documentation with configuration guide

### 📚 Documentation

- ✅ Added `CONFIGURATION.md` - Complete setup guide
- ✅ Updated `INSTALLATION_GUIDE.md` - Added configuration step
- ✅ Updated `README.md` - Added setup instructions

### 🚀 Deployment Notes

When deploying your website:
1. Update `WEBSITE_URL` in `config.js`
2. Reload extension in browser
3. Test dashboard integration
4. Verify authentication works

### 🔄 Breaking Changes

None - Existing functionality remains unchanged.

### ⚡ Performance

- No impact on extension performance
- Dashboard opens in new tab efficiently
- Config loads once on startup

---

## Version 1.0.0 - Initial Release

### Features

- Real-time URL scanning
- Threat detection and alerts
- Visual badge indicators
- Scan history tracking
- Statistics dashboard
- iOS-style UI
- Multi-browser support

---

## Upcoming Features

### Planned for Future Versions

- [ ] Sync scan history with website account
- [ ] Custom scanning rules
- [ ] Whitelist/blacklist management
- [ ] Export scan reports
- [ ] Advanced threat analytics
- [ ] Multiple website profiles
- [ ] Keyboard shortcuts
- [ ] Dark/Light theme toggle

---

## Migration Guide

### From v1.0.0 to v1.1.0

1. **Update Files**
   - Replace extension files with new version
   - Keep existing icons

2. **Configure**
   - Create/update `config.js` with your website URL

3. **Reload Extension**
   - Go to `chrome://extensions/`
   - Click reload button on PhishGuard

4. **Test**
   - Click extension icon
   - Click "View Dashboard"
   - Verify it opens your website

No data loss - all scan history preserved!

---

## Support

For issues or questions:
- Check `CONFIGURATION.md` for setup help
- Review browser console for errors
- Verify `config.js` syntax
- Test with local website first

---

**Last Updated**: Current Version 1.1.0
