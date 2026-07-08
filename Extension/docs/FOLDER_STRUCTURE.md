# PhishGuard Extension - Folder Structure

## 📁 Complete Structure

```
Extension/
│
├── 📄 manifest.json              # Extension configuration & permissions
├── ⚙️ config.js                  # Configuration (EDIT THIS: website URL, settings)
├── 📄 popup.html                 # Extension popup interface
├── 📄 popup.js                   # Popup logic & URL analysis
├── 🎨 popup.css                  # Popup styling (iOS glass UI)
├── 🔧 background.js              # Background service worker
├── 📖 README.md                  # Quick start & overview
│
├── 📚 docs/                      # Documentation folder
│   ├── README.md                 # Complete feature guide
│   ├── INSTALLATION_GUIDE.md     # Installation instructions
│   ├── CONFIGURATION.md          # Configuration guide
│   ├── TESTING_GUIDE.md          # Testing checklist
│   ├── CHANGELOG.md              # Version history
│   ├── ICONS_README.md           # Icon creation guide
│   └── FOLDER_STRUCTURE.md       # This file
│
└── 🎨 icons/                     # Extension icons
    ├── icon16.png                # 16x16 - Toolbar icon
    ├── icon48.png                # 48x48 - Extension management
    └── icon128.png               # 128x128 - Chrome Web Store
```

---

## 📄 File Purposes

### Core Extension Files

| File | Purpose | Edit? |
|------|---------|-------|
| `manifest.json` | Extension metadata, permissions, version | Sometimes |
| `config.js` | Website URL & settings | **YES - Edit this!** |
| `popup.html` | Extension popup structure | Rarely |
| `popup.js` | Scanning logic & UI interactions | Sometimes |
| `popup.css` | Extension styling | Sometimes |
| `background.js` | Auto-scanning & notifications | Sometimes |

### Configuration File ⚙️

**`config.js`** - The ONLY file you need to edit for basic setup:

```javascript
const CONFIG = {
  WEBSITE_URL: 'https://yourdomain.com',  // ← Change this!
  AUTO_SCAN: true,
  SHOW_NOTIFICATIONS: true,
  SCAN_DELAY: 500
};
```

### Documentation Files 📚

| File | Contents |
|------|----------|
| `docs/README.md` | Complete feature list, usage guide, how it works |
| `docs/INSTALLATION_GUIDE.md` | Step-by-step installation for all browsers |
| `docs/CONFIGURATION.md` | Detailed configuration options & examples |
| `docs/TESTING_GUIDE.md` | Comprehensive testing checklist |
| `docs/CHANGELOG.md` | Version history & update notes |
| `docs/ICONS_README.md` | Icon requirements & creation guide |
| `docs/FOLDER_STRUCTURE.md` | This document - folder organization |

### Icon Files 🎨

| File | Size | Usage |
|------|------|-------|
| `icons/icon16.png` | 16×16 | Browser toolbar (required) |
| `icons/icon48.png` | 48×48 | Extension management page (required) |
| `icons/icon128.png` | 128×128 | Chrome Web Store listing (required) |

---

## 🎯 What to Edit

### For First Time Setup

1. **`config.js`** - Update `WEBSITE_URL` to your deployed website
   - Local: `http://localhost/PhishGuard_mine/index.html`
   - Production: `https://yourdomain.com`

That's it! No other files need editing for basic setup.

### For Customization

2. **`popup.css`** - Change colors, spacing, styling
3. **`popup.js`** - Modify threat detection rules
4. **`manifest.json`** - Update version, name, description
5. **`icons/`** - Replace with custom icons

### Never Edit (Unless You Know What You're Doing)

- ❌ `background.js` - Core scanning functionality
- ❌ `popup.html` - Structured for CSS styling

---

## 📚 Documentation Organization

All documentation is now organized in the `docs/` folder:

```
docs/
├── README.md                    # Start here for features
├── INSTALLATION_GUIDE.md        # Installation instructions
├── CONFIGURATION.md             # Configuration help
├── TESTING_GUIDE.md             # Testing checklist
├── CHANGELOG.md                 # What's new
├── ICONS_README.md              # Icon requirements
└── FOLDER_STRUCTURE.md          # This document
```

### Why This Organization?

- ✅ Keeps root folder clean
- ✅ All docs in one place
- ✅ Easy to find help
- ✅ Professional structure
- ✅ Scalable for future docs

---

## 🚀 Quick Navigation

### I want to...

| Task | Go to |
|------|-------|
| Install the extension | `docs/INSTALLATION_GUIDE.md` |
| Configure website URL | `config.js` + `docs/CONFIGURATION.md` |
| Test all features | `docs/TESTING_GUIDE.md` |
| Understand features | `docs/README.md` |
| See what changed | `docs/CHANGELOG.md` |
| Create custom icons | `docs/ICONS_README.md` |
| Understand structure | `docs/FOLDER_STRUCTURE.md` (here!) |

---

## 🔄 Development Workflow

### Making Changes

1. Edit files in `Extension/` folder
2. Go to `chrome://extensions/`
3. Click reload button on PhishGuard
4. Test changes in popup

### Adding Documentation

1. Create `.md` file in `docs/` folder
2. Update root `README.md` to link to it
3. Add to this file's navigation table

### Version Updates

1. Update `manifest.json` version number
2. Document changes in `docs/CHANGELOG.md`
3. Update any affected documentation
4. Test thoroughly
5. Reload extension

---

## 📦 For Distribution

### Files to Include

When sharing or publishing:

- ✅ All `.js`, `.html`, `.css` files
- ✅ `manifest.json`
- ✅ `config.js`
- ✅ `icons/` folder with all 3 PNG files
- ✅ `docs/` folder with all documentation
- ✅ Root `README.md`

### Files to Exclude

- ❌ `.git/` folder (if using Git)
- ❌ `.DS_Store` (Mac)
- ❌ `Thumbs.db` (Windows)
- ❌ Personal notes or temp files

### Publishing to Chrome Web Store

Required files checklist:
- [x] `manifest.json` - Updated version, description
- [x] `icons/icon128.png` - 128×128 PNG
- [x] `icons/icon48.png` - 48×48 PNG  
- [x] `icons/icon16.png` - 16×16 PNG
- [x] All JS/HTML/CSS files
- [x] Screenshots (1280×800 or 640×400)
- [x] Promotional images (440×280)
- [x] Privacy policy (if collecting data)

---

## 🗂️ File Sizes

Typical file sizes for reference:

```
manifest.json         ~1 KB
config.js            ~1 KB
popup.html           ~3 KB
popup.js             ~8 KB
popup.css           ~15 KB
background.js        ~5 KB
icon16.png          ~1 KB
icon48.png          ~2 KB
icon128.png         ~5 KB
docs/ (all files)   ~50 KB
```

**Total Extension Size**: ~100 KB (very lightweight!)

---

## 🔍 Finding Things

### Looking for...

**Configuration options?**
→ Open `config.js` OR read `docs/CONFIGURATION.md`

**Installation help?**
→ Read `docs/INSTALLATION_GUIDE.md`

**Testing checklist?**
→ Read `docs/TESTING_GUIDE.md`

**Feature list?**
→ Read `docs/README.md`

**Version history?**
→ Read `docs/CHANGELOG.md`

**Icon requirements?**
→ Read `docs/ICONS_README.md`

**Folder structure?**
→ You're reading it! 😊

---

## 📝 Notes

- Root `README.md` = Quick start guide
- `docs/README.md` = Complete feature guide
- Both are useful but serve different purposes
- Keep them in sync when updating features

---

## ✅ Organization Benefits

### Before (scattered):
```
Extension/
├── manifest.json
├── popup.html
├── README.md
├── INSTALLATION_GUIDE.md
├── CONFIGURATION.md
├── CHANGELOG.md
├── TESTING_GUIDE.md
└── icons/ICONS_README.md  ← Inconsistent location
```

### After (organized):
```
Extension/
├── manifest.json
├── popup.html
├── README.md  ← Quick start
└── docs/  ← All documentation here
    ├── README.md
    ├── INSTALLATION_GUIDE.md
    ├── CONFIGURATION.md
    └── ... all docs
```

**Result**: Cleaner, more professional, easier to navigate! 🎉

---

<div align="center">

**Folder Structure Guide**

Part of PhishGuard Extension Documentation

</div>
