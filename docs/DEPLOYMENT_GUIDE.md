# PhishGuard - Complete Deployment Guide

This guide will walk you through deploying PhishGuard to your custom domain.

---

## 🎯 Overview

We'll cover multiple deployment options:
1. **Netlify** (Recommended - Easiest)
2. **Vercel** (Great for developers)
3. **Firebase Hosting** (Integrated with Firebase)
4. **Traditional Hosting** (cPanel, shared hosting)

Choose the method that works best for you!

---

## ✅ Prerequisites

- ✅ Firebase setup completed ([DATABASE_SETUP_GUIDE.md](DATABASE_SETUP_GUIDE.md))
- ✅ Domain name purchased
- ✅ PhishGuard project files ready
- ✅ Git installed (for Netlify/Vercel)

---

# 🚀 Method 1: Netlify (Recommended)

**Best for**: Beginners, quick setup, automatic HTTPS
**Time**: 10-15 minutes
**Cost**: Free tier available

## Step 1: Prepare Your Project

### 1.1 Create Git Repository (Optional but Recommended)

**Option A: Using GitHub Desktop**
1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in with GitHub account
3. Click "Add" → "Create New Repository"
4. Name: `PhishGuard`
5. Local Path: Select your PhishGuard folder
6. Click "Create Repository"
7. Click "Publish repository" to GitHub

**Option B: Using Command Line**
```bash
cd path/to/PhishGuard_mine
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/phishguard.git
git push -u origin main
```

### 1.2 Or Use Drag & Drop (Simpler)
Skip Git - we'll drag and drop files directly to Netlify!

---

## Step 2: Deploy to Netlify

### 2.1 Sign Up for Netlify
1. Go to: https://www.netlify.com/
2. Click "Sign up"
3. Sign up with GitHub (if using Git) or Email
4. Verify your email

### 2.2 Deploy Your Site

**Method A: Using Git**
1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Authorize Netlify to access GitHub
4. Select your `PhishGuard` repository
5. Configure:
   - **Branch**: `main`
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (or leave empty)
6. Click "Deploy site"

**Method B: Drag & Drop (Easier)**
1. Click "Add new site" → "Deploy manually"
2. Drag your entire PhishGuard folder to the upload area
3. Wait for upload and deployment (1-2 minutes)

### 2.3 Your Site is Live!
- Netlify gives you a random URL like: `https://random-name-12345.netlify.app`
- Your site is now live at this URL!
- Test it to make sure everything works

---

## Step 3: Connect Your Custom Domain

### 3.1 Add Custom Domain to Netlify
1. In Netlify Dashboard, click your site
2. Go to "Domain settings"
3. Click "Add custom domain"
4. Enter your domain: `yourdomain.com`
5. Click "Verify"
6. Click "Add domain"

### 3.2 Configure DNS

You'll see DNS configuration instructions. Two options:

**Option A: Use Netlify DNS (Easiest)**
1. Netlify shows you nameservers like:
   - `dns1.p01.nsone.net`
   - `dns2.p01.nsone.net`
   - `dns3.p01.nsone.net`
   - `dns4.p01.nsone.net`
2. Go to your domain registrar (where you bought domain)
3. Find "DNS Settings" or "Nameservers"
4. Replace nameservers with Netlify's nameservers
5. Save changes
6. Wait 24-48 hours for propagation (usually faster)

**Option B: Use Existing DNS (Manual)**
1. Keep your current nameservers
2. Add these DNS records at your registrar:

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: 75.2.60.5
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

3. Save changes
4. Wait 1-24 hours for propagation

### 3.3 Enable HTTPS
1. In Netlify, go to "Domain settings"
2. Scroll to "HTTPS"
3. Click "Verify DNS configuration"
4. Once verified, click "Provision certificate"
5. Wait 1-2 minutes
6. HTTPS is now enabled! 🔒

---

## Step 4: Update Firebase Authorized Domains

### 4.1 Add Your Domain to Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your PhishGuard project
3. Click **"Authentication"** in sidebar
4. Click **"Settings"** tab
5. Scroll to **"Authorized domains"**
6. Click **"Add domain"**
7. Enter your domain: `yourdomain.com`
8. Click "Add"
9. Repeat for `www.yourdomain.com` if using www

### 4.2 Test Google Sign-In
1. Visit your live site
2. Try signing in with Google
3. Should work without errors!

---

## Step 5: Final Testing

### 5.1 Test All Features
- ✅ Home page loads
- ✅ Sign up works
- ✅ Sign in works
- ✅ Google sign-in works
- ✅ URL scanning works
- ✅ Dashboard loads
- ✅ Profile page works
- ✅ Password change works
- ✅ Theme toggle works

### 5.2 Test on Mobile
- Open site on phone
- Test responsive design
- Test all features

---

# 🔥 Method 2: Firebase Hosting

**Best for**: Firebase users, simple deployment
**Time**: 15-20 minutes

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase

```bash
firebase login
```

Your browser will open - sign in with your Google account.

## Step 3: Initialize Firebase Hosting

```bash
cd path/to/PhishGuard_mine
firebase init hosting
```

**Configure:**
1. Select your Firebase project
2. **Public directory**: Enter `.` (current directory)
3. **Configure as SPA**: Yes
4. **Set up automatic builds**: No
5. **Overwrite index.html**: No

## Step 4: Deploy

```bash
firebase deploy --only hosting
```

Your site is live at: `https://your-project-id.web.app`

## Step 5: Connect Custom Domain

1. In Firebase Console → **Hosting**
2. Click "Add custom domain"
3. Enter your domain
4. Follow DNS configuration instructions
5. Add provided DNS records to your domain registrar
6. Wait for verification (1-24 hours)

---

# ⚡ Method 3: Vercel

**Best for**: Developers, automatic deployments
**Time**: 10 minutes

## Step 1: Push to Git

Make sure your project is on GitHub (see Netlify Step 1.1)

## Step 2: Deploy to Vercel

1. Go to: https://vercel.com/
2. Sign up with GitHub
3. Click "New Project"
4. Import your PhishGuard repository
5. Configure:
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: `.`
6. Click "Deploy"

## Step 3: Add Custom Domain

1. In Vercel dashboard, click your project
2. Go to "Settings" → "Domains"
3. Add your domain
4. Configure DNS as instructed
5. Wait for verification

---

# 🖥️ Method 4: Traditional Hosting (cPanel)

**Best for**: Existing hosting, full control
**Time**: 20-30 minutes

## Step 1: Prepare Files

1. Open your PhishGuard folder
2. Make sure all files are ready
3. No build step needed - it's a static site!

## Step 2: Upload Files

### Using File Manager
1. Login to cPanel
2. Open "File Manager"
3. Navigate to `public_html` (or your domain folder)
4. Click "Upload"
5. Select all PhishGuard files
6. Upload all files and folders

### Using FTP
1. Download FileZilla: https://filezilla-project.org/
2. Connect using FTP credentials from your host
3. Navigate to `public_html`
4. Drag all PhishGuard files to server
5. Wait for upload to complete

## Step 3: Configure Domain

1. In cPanel, go to "Domains"
2. Add your domain or verify it points to `public_html`
3. Save changes

## Step 4: Enable HTTPS

1. In cPanel, go to "SSL/TLS Status"
2. Select your domain
3. Click "Run AutoSSL"
4. Wait for certificate installation
5. Force HTTPS redirect:

Add to `.htaccess` in root:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Step 5: Update Firebase

Add your domain to Firebase Authorized Domains (see Netlify Step 4)

---

# 🔧 Post-Deployment Checklist

## Security

- ✅ HTTPS enabled
- ✅ Firebase security rules configured
- ✅ Authorized domains added
- ✅ No sensitive data in code

## Performance

- ✅ Site loads quickly
- ✅ Images optimized
- ✅ No console errors

## Functionality

- ✅ All pages accessible
- ✅ Sign up/Sign in works
- ✅ Database operations work
- ✅ Google sign-in works
- ✅ Forgot password works
- ✅ Profile updates work
- ✅ URL scanning works
- ✅ CSV export works

## SEO (Optional)

- ✅ Update meta tags in `index.html`
- ✅ Add sitemap
- ✅ Submit to Google Search Console

---

# 🌐 DNS Configuration Reference

## Common DNS Records

### For Netlify
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

### For Vercel
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### For Firebase
Firebase provides specific TXT and A records during setup.

---

# 🔍 Troubleshooting

## Site Not Loading

1. Check DNS propagation: https://dnschecker.org/
2. Wait 24-48 hours for DNS to propagate
3. Clear browser cache (Ctrl + Shift + R)
4. Try incognito/private mode

## HTTPS Not Working

1. Wait for SSL certificate provisioning (can take 24 hours)
2. Check domain verification
3. Try forcing HTTPS in settings

## Firebase Errors

1. Check Firebase config in `index.html`
2. Verify authorized domains in Firebase Console
3. Check browser console for error messages

## Google Sign-In Not Working

1. Add domain to Firebase Authorized Domains
2. Wait 5-10 minutes after adding
3. Clear cookies and try again

---

# 📊 Monitoring Your Site

## Netlify Analytics
- Go to Netlify Dashboard
- Click "Analytics" tab
- View traffic, performance

## Firebase Analytics (Optional)
1. Enable in Firebase Console
2. Add Analytics code to site
3. View user activity

## Uptime Monitoring
Free services:
- UptimeRobot: https://uptimerobot.com/
- Pingdom: https://www.pingdom.com/

---

# 🚀 Continuous Deployment

## Auto-Deploy on Git Push

**Netlify/Vercel**:
- Any push to main branch auto-deploys
- No manual upload needed!

**Firebase Hosting**:
Add to your workflow:
```bash
git add .
git commit -m "Update"
git push
firebase deploy --only hosting
```

---

# 💡 Pro Tips

1. **Use Git**: Easier updates and version control
2. **Enable CDN**: Most platforms enable this automatically
3. **Monitor Performance**: Use Lighthouse or PageSpeed Insights
4. **Backup Regularly**: Keep local copies of your code
5. **Test Before Deploy**: Test locally first
6. **Use Environment Variables**: For different Firebase configs (dev/prod)

---

# 📱 Next Steps

After deployment:

1. ✅ Test everything thoroughly
2. ✅ Share with friends/colleagues
3. ✅ Monitor for errors
4. ✅ Install browser extension
5. ✅ Set up analytics
6. ✅ Add to bookmarks
7. ✅ Enjoy your live PhishGuard site! 🎉

---

# 🆘 Getting Help

**Deployment Issues**:
- Netlify Docs: https://docs.netlify.com/
- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs/hosting

**DNS Issues**:
- Contact your domain registrar support
- Use DNS checker tools
- Wait for propagation (24-48 hours)

**Firebase Issues**:
- Check Firebase Console
- Review error messages
- See DATABASE_SETUP_GUIDE.md

---

**Deployment Complete! 🎉**

Your PhishGuard is now live at your custom domain!
