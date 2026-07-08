# Extension Icons

You need to create 3 icon files for the extension:

## Required Icons

1. **icon16.png** - 16x16 pixels (toolbar icon)
2. **icon48.png** - 48x48 pixels (extension management)
3. **icon128.png** - 128x128 pixels (Chrome Web Store)

## Design Guidelines

### Recommended Design
Use the PhishGuard shield logo:
- Green gradient shield (#22C55E to #16A34A)
- White checkmark inside
- Transparent or dark background
- Clean, simple, recognizable at small sizes

### Creating Icons

**Option 1: Use the Logo from Website**
- Take a screenshot of the logo from the PhishGuard website
- Crop to square
- Resize to 16x16, 48x48, and 128x128 pixels
- Save as PNG with transparency

**Option 2: Online Icon Generator**
- Use: https://favicon.io/ or https://realfavicongenerator.net/
- Upload a square version of your logo
- Generate all sizes automatically

**Option 3: Design Tool**
- Use Figma, Photoshop, or GIMP
- Create green shield with checkmark
- Export in all three sizes

### Quick Temporary Solution

Until you create proper icons, you can:
1. Create simple colored squares as placeholders
2. Use any shield/security icon from free icon sites (flaticon.com, icons8.com)
3. Convert the SVG shield from the HTML into PNG using an online converter

### SVG to PNG Conversion

Use the shield SVG code from popup.html:
```svg
<svg width="128" height="128" viewBox="0 0 44 44">
  <defs>
    <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22C55E"/>
      <stop offset="100%" stop-color="#4ade80"/>
    </linearGradient>
  </defs>
  <path d="M22 3.5L5 11v10c0 10 7.5 18.8 17 21 9.5-2.2 17-11 17-21V11L22 3.5z" 
        fill="rgba(34,197,94,.08)" stroke="url(#sg)" stroke-width="1.4"/>
  <path d="M15 22.5l5 5 9-9" 
        stroke="url(#sg)" stroke-width="2" 
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

Convert this to PNG at different sizes using:
- https://svgtopng.com/
- https://cloudconvert.com/svg-to-png

## Placement

Save all icons in the `Extension/icons/` folder:
```
Extension/
  └── icons/
      ├── icon16.png
      ├── icon48.png
      └── icon128.png
```

Once icons are created, the extension will be ready to install!
