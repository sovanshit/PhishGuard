# 🎨 Custom Logo Setup Guide

## 📁 Where to Put Your Logo

Place your logo file in:
```
PhishGuard_split/
└── assets/
    └── images/
        └── logo.png  ← Put your logo here
```

---

## 🖼️ Logo Requirements

### Recommended Specifications:
- **Format:** PNG (with transparent background) or SVG
- **Height:** 40-60px (will auto-scale)
- **Width:** Up to 200px max
- **Background:** Transparent preferred
- **File Size:** Under 100KB for fast loading

### Supported Formats:
- ✅ PNG (best for photos/complex logos)
- ✅ SVG (best for vector logos)
- ✅ JPG (if no transparency needed)
- ✅ WebP (modern format)
- ✅ GIF (if animated logo)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Prepare Your Logo
1. Open your logo in an image editor
2. Resize to approximately 40-60px height
3. Export as PNG with transparent background
4. Name it `logo.png`

### Step 2: Add to Project
1. Copy your `logo.png` file
2. Paste into `assets/images/` folder
3. That's it!

### Step 3: Test
1. Open `index.html` in browser
2. Your logo should appear in navigation
3. Check footer - logo should be there too

---

## 🎨 Logo Variations

### Option 1: PNG Logo (Current Setup)
```
File: assets/images/logo.png
```
Already configured! Just add your file.

### Option 2: SVG Logo
If you have an SVG logo:
```
File: assets/images/logo.svg
```

Update in `index.html`:
```html
<img src="assets/images/logo.svg" alt="PhishGuard Logo" class="nav-logo-img">
```

### Option 3: Different File Name
If your logo has a different name (e.g., `my-logo.png`):

Update in `index.html` (2 places):
```html
<!-- Navigation -->
<img src="assets/images/my-logo.png" alt="PhishGuard Logo" class="nav-logo-img">

<!-- Footer -->
<img src="assets/images/my-logo.png" alt="PhishGuard Logo" class="nav-logo-img">
```

---

## 🎯 Customizing Logo Size

### Make Logo Bigger:
Edit `assets/css/style.css`:
```css
.nav-logo-img{
  height:50px;  /* Change from 40px to 50px */
  width:auto;
  max-width:250px;  /* Increase max width */
}
```

### Make Logo Smaller:
```css
.nav-logo-img{
  height:30px;  /* Change from 40px to 30px */
  width:auto;
  max-width:150px;  /* Decrease max width */
}
```

### Fixed Width Logo:
```css
.nav-logo-img{
  height:40px;
  width:120px;  /* Set specific width */
  max-width:none;
}
```

---

## 🔄 Fallback System

### How It Works:
If your logo file is missing or fails to load, the site automatically shows the original PhishGuard text logo.

### Test Fallback:
1. Rename your logo file temporarily
2. Refresh browser
3. You'll see the text logo
4. Rename back to see your logo

---

## 🎨 Logo Design Tips

### For Best Results:

#### 1. **Transparent Background**
- Use PNG with alpha channel
- Looks professional on any background
- Works with scrolled nav (darker background)

#### 2. **Horizontal Layout**
- Wide logos work better in navigation
- Avoid tall/vertical logos
- Landscape orientation preferred

#### 3. **Light Colors**
- Site has dark background
- Use white or light-colored logos
- Or provide contrast

#### 4. **Simple Design**
- Clear at small sizes
- Readable text (if any)
- Not too detailed

---

## 🖼️ Creating a Logo (Quick Options)

### Option 1: Use Existing Logo
Just export at right size and add to folder.

### Option 2: Create Text Logo
Use free tools:
- Canva.com (free templates)
- Figma.com (design tool)
- Photopea.com (online Photoshop)

### Option 3: Generate Logo
AI logo generators:
- Looka.com
- Brandmark.io
- Hatchful by Shopify (free)

### Option 4: Hire Designer
- Fiverr.com (from $5)
- 99designs.com
- Upwork.com

---

## 📝 Example Logo Sizes

### Small Logo (Minimal):
```css
height: 30px;
max-width: 100px;
```

### Medium Logo (Default):
```css
height: 40px;
max-width: 200px;
```

### Large Logo (Bold):
```css
height: 50px;
max-width: 250px;
```

---

## 🎨 Advanced Customization

### Add Logo Hover Effect:
```css
.nav-logo-img{
  height:40px;
  width:auto;
  max-width:200px;
  transition: transform 0.3s ease;
}

.nav-logo-img:hover{
  transform: scale(1.05);
}
```

### Add Logo Glow:
```css
.nav-logo-img{
  height:40px;
  width:auto;
  max-width:200px;
  filter: drop-shadow(0 0 10px rgba(34,197,94,0.3));
}
```

### Different Logo for Scrolled Nav:
Add second logo and toggle with JavaScript (advanced).

---

## 🐛 Troubleshooting

### Logo Not Showing?

#### Check 1: File Location
```
✅ Correct: assets/images/logo.png
❌ Wrong: images/logo.png
❌ Wrong: logo.png
❌ Wrong: assets/logo.png
```

#### Check 2: File Name
- Must match exactly (case-sensitive)
- Check for spaces in filename
- Use lowercase recommended

#### Check 3: File Format
- Open file to verify it's valid
- Try different format (PNG → SVG)
- Check file isn't corrupted

#### Check 4: Browser Cache
- Hard refresh: Ctrl+Shift+R (Windows)
- Or: Cmd+Shift+R (Mac)
- Or: Clear browser cache

### Logo Too Big/Small?

Edit CSS:
```css
.nav-logo-img{
  height: 40px;  /* Adjust this value */
}
```

### Logo Blurry?

Use higher resolution:
- Export at 2x size
- Use SVG format (never blurry)
- Use PNG at 72-144 DPI

---

## 📱 Mobile Considerations

Logo automatically scales on mobile. To customize:

```css
@media(max-width:640px){
  .nav-logo-img{
    height: 32px;  /* Smaller on mobile */
    max-width: 150px;
  }
}
```

---

## ✅ Checklist

Before going live:
- [ ] Logo file in correct folder
- [ ] Logo displays in navigation
- [ ] Logo displays in footer
- [ ] Logo looks good on desktop
- [ ] Logo looks good on mobile
- [ ] Logo loads quickly
- [ ] Fallback works (test by renaming file)
- [ ] Logo is clear and readable

---

## 🎉 Quick Reference

### File Location:
```
assets/images/logo.png
```

### HTML (Navigation):
```html
<img src="assets/images/logo.png" alt="PhishGuard Logo" class="nav-logo-img">
```

### CSS:
```css
.nav-logo-img{height:40px;width:auto;max-width:200px}
```

---

## 💡 Pro Tips

1. **Use SVG** for crisp logos at any size
2. **Optimize PNG** with TinyPNG.com (reduce file size)
3. **Test on dark background** before adding
4. **Keep it simple** - complex logos don't scale well
5. **Backup original** before resizing

---

**Your logo is now ready to use!** 🎨

Just add your `logo.png` file to `assets/images/` and refresh the page!
