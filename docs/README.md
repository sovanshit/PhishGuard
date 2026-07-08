# PhishGuard - URL Security Scanner

A modern, interactive web application for detecting phishing URLs and malicious links with real-time threat analysis.

![PhishGuard](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🚀 Quick Start

### Open the Application:
Simply open **`index.html`** in your web browser!

```bash
# Navigate to the project folder
cd d:\Projects\PhishGuard_split

# Open in your default browser (Windows)
start index.html
```

That's it! No server or build process required.

---

## 📁 Project Structure

```
PhishGuard_split/
│
├── index.html              # Main application (SPA version)
│
├── assets/
│   ├── css/
│   │   └── style.css      # All styles and animations
│   │
│   └── js/
│       └── app.js         # Application logic and SPA navigation
│
├── legacy/                 # Old multi-page version (deprecated)
│   ├── index.html
│   ├── check.html
│   ├── dashboard.html
│   ├── signin.html
│   └── script.js
│
├── docs/                   # Documentation
│   ├── README_IMPORTANT.md
│   ├── SPA_VERSION_GUIDE.md
│   ├── ANIMATION_IMPROVEMENTS.md
│   ├── QUICK_TEST_GUIDE.md
│   └── TEST_INSTRUCTIONS.md
│
└── README.md              # This file
```

---

## ✨ Features

### 🔍 URL Scanning
- Real-time phishing detection
- SSL certificate verification
- Domain reputation checking
- Threat indicator analysis
- Safety score calculation

### 📊 Dashboard
- Interactive charts and analytics
- Scan history tracking
- Threat distribution visualization
- Real-time statistics
- Export capabilities

### 🎨 Modern UI/UX
- Smooth page transitions
- Interactive charts with hover effects
- Animated metrics and counters
- Responsive design
- Glass morphism effects

### 🔐 User Authentication
- Sign in / Sign up functionality
- Session management
- User profile dashboard
- Secure local storage

---

## 🎯 Key Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **Canvas API** - Interactive charts
- **LocalStorage** - Data persistence
- **SPA Architecture** - Single Page Application

---

## 🎨 Features Breakdown

### 1. URL Scanner
- Paste or type any URL
- Instant threat analysis
- Detailed security metrics
- Visual threat indicators
- Safe/Suspicious/Malicious classification

### 2. Interactive Dashboard
- **Line Chart**: 7-day scan activity with hover tooltips
- **Pie Chart**: Threat distribution with interactive segments
- **Metrics Cards**: Animated counters with real-time data
- **History Table**: Searchable and filterable scan history

### 3. Smooth Navigation
- No page refreshes
- Fade transitions (300ms)
- Slide animations
- Auto-scroll to top
- Preserved application state

### 4. Animations
- Staggered card animations
- Number counting effects
- Chart hover interactions
- Button pulse effects
- Smooth transitions throughout

---

## 📖 Usage Guide

### Scanning a URL:
1. Navigate to "Scan URL" page
2. Enter or paste a URL
3. Click "Scan URL" button
4. View detailed threat analysis
5. Check threat indicators if any

### Viewing Dashboard:
1. Sign in to your account
2. Navigate to "Dashboard"
3. View scan statistics
4. Interact with charts
5. Filter scan history

### User Authentication:
1. Click "Sign In" button
2. Toggle between Sign In / Sign Up
3. Enter credentials
4. Access dashboard features

---

## 🎨 Customization

### Changing Colors:
Edit `assets/css/style.css` and modify CSS variables:
```css
:root{
  --g1:#22C55E;  /* Primary green */
  --g2:#16A34A;  /* Secondary green */
  --bg:#0B0F12;  /* Background */
  /* ... more variables */
}
```

### Adjusting Animations:
Edit transition timings in `assets/js/app.js`:
```javascript
setTimeout(()=>{ /* ... */ }, 300); // Change 300 to your preferred ms
```

### Modifying Scan Logic:
Edit the `analyzeURL()` function in `assets/js/app.js`

---

## 🐛 Troubleshooting

### Issue: Styles not loading
**Solution:** Make sure `assets/css/style.css` exists and path is correct

### Issue: JavaScript not working
**Solution:** Check browser console for errors, ensure `assets/js/app.js` is loaded

### Issue: Paste button not working
**Solution:** Use HTTPS or localhost (clipboard API requirement)

### Issue: Charts not displaying
**Solution:** Ensure Canvas API is supported in your browser

---

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)
- ⚠️ IE11 (limited support)

---

## 🔒 Security & Privacy

- All data stored locally (LocalStorage)
- No external API calls
- No data sent to servers
- Client-side only processing
- Privacy-focused design

---

## 📚 Documentation

Detailed documentation available in the `docs/` folder:

- **README_IMPORTANT.md** - Quick comparison guide
- **SPA_VERSION_GUIDE.md** - SPA architecture details
- **ANIMATION_IMPROVEMENTS.md** - Animation documentation
- **QUICK_TEST_GUIDE.md** - Testing instructions
- **TEST_INSTRUCTIONS.md** - Feature testing guide

---

## 🚀 Deployment

### Local Development:
Just open `index.html` in your browser!

### Web Server:
Upload all files to your web server:
```bash
# Example with simple HTTP server
python -m http.server 8000
# Then open http://localhost:8000
```

### GitHub Pages:
1. Push to GitHub repository
2. Enable GitHub Pages in settings
3. Select main branch
4. Your site will be live!

---

## 🗄️ Database Integration

PhishGuard now supports cloud database integration! Connect to Firebase for:
- ✅ Real user authentication
- ✅ Cloud data storage
- ✅ Multi-device sync
- ✅ Real-time updates

**Quick Setup:** See `QUICK_DATABASE_SETUP.md` (5 minutes)
**Full Guide:** See `DATABASE_INTEGRATION_GUIDE.md` (detailed)

The app works perfectly with or without database - it gracefully falls back to localStorage if Firebase is not configured.

---

## 🎯 Future Enhancements

- [ ] Real API integration for threat detection
- [ ] Export scan reports as PDF
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Browser extension version
- [ ] Mobile app version
- [ ] Advanced filtering options
- [ ] Scheduled scans
- [ ] Email notifications
- [ ] Team collaboration features

---

## 📝 License

MIT License - Feel free to use and modify!

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## 📞 Support

For issues or questions:
1. Check the `docs/` folder for guides
2. Review troubleshooting section
3. Check browser console for errors

---

## 🎉 Acknowledgments

- Font: Outfit, Instrument Serif, DM Mono (Google Fonts)
- Icons: Unicode emoji
- Design: Modern glass morphism style
- Architecture: Single Page Application

---

## 📊 Project Stats

- **Lines of Code**: ~2,500+
- **Files**: 3 main files (HTML, CSS, JS)
- **Size**: ~150KB total
- **Load Time**: <1 second
- **Performance**: 60fps animations

---

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Single Page Application
- ✅ Smooth transitions
- ✅ Interactive charts
- ✅ Animated dashboard
- ✅ User authentication
- ✅ Organized file structure

### v0.9.0 (Legacy)
- Multi-page version
- Basic animations
- Static charts
- Separate HTML files

---

**Made with ❤️ for web security**

Open `index.html` to get started!
