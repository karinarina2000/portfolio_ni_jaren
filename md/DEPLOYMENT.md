# Deployment Guide

## Step 1: Push to GitHub

Run these commands in your terminal (from the `portfolio` folder):

```bash
# Replace 'your-username' with your GitHub username
git remote add origin https://github.com/your-username/portfolio.git

# Rename branch to main (GitHub's default)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

Your site will be live at: `https://your-username.github.io/portfolio/`

## Step 3: Deploy to Netlify

### Option A: Connect via GitHub (Recommended)

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **Add new site** → **Import an existing project**
3. Click **GitHub** and authorize Netlify
4. Find and select your `portfolio` repository
5. Build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `/` (or leave as default)
6. Click **Deploy site**

### Option B: Drag and Drop

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **Add new site** → **Deploy manually**
3. Drag and drop the `portfolio` folder
4. Wait for deployment to complete

Your site will be live at: `https://random-name.netlify.app`

You can customize the domain in **Site settings** → **Domain management**

## Step 4: Customize Domain (Optional)

### GitHub Pages
1. Go to Settings → Pages
2. Under "Custom domain", enter your domain
3. Update your DNS records at your domain registrar

### Netlify
1. Go to Site settings → Domain management
2. Click **Add custom domain**
3. Follow the DNS configuration instructions

## Quick Commands Reference

```bash
# Check git status
git status

# Make changes and commit
git add .
git commit -m "Your message here"

# Push changes to GitHub (auto-deploys to both)
git push

# View remote URL
git remote -v
```

## Auto-Deploy

Both GitHub Pages and Netlify will **automatically redeploy** whenever you push changes to the `main` branch. No manual steps needed after the initial setup!
