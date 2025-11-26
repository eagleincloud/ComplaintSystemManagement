# Deployment Guide

This is a static web application that can be deployed to various hosting platforms. Here are the easiest options:

## Option 1: Vercel (Recommended - Easiest)

### Via Web Interface:
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your Git repository (push this code to GitHub first) OR drag and drop the project folder
4. Vercel will automatically detect it's a static site
5. Click "Deploy"
6. Your app will be live in seconds!

### Via CLI (if you have Node.js):
```bash
npm i -g vercel
vercel --prod
```

## Option 2: Netlify (Also Very Easy)

### Via Web Interface:
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Drag and drop your project folder onto the Netlify dashboard
3. Your app will be live immediately!

### Via CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod
```

## Option 3: GitHub Pages

1. Push this code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main` or `master`)
4. Your app will be available at `https://yourusername.github.io/repository-name`

## Option 4: Surge.sh (Simple CLI)

```bash
npm install -g surge
surge
# Follow the prompts
```

## Quick Start (No Installation Required)

The easiest way without installing anything:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy via Vercel:**
   - Go to vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

Your app will be live with a shareable URL like: `https://your-app-name.vercel.app`

## Demo Accounts

Once deployed, you can share these demo accounts with your client:

- **Customer:** customer1@demo.com / Customer@123
- **Agent (L1):** agent1@demo.com / Agent@123
- **Agent (L2):** l2agent@demo.com / Agent@123
- **Manager:** manager@demo.com / Manager@123
- **Admin:** admin@demo.com / Admin@123

