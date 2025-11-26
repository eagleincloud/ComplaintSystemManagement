#!/bin/bash

echo "🚀 Eagle Complaint System - Deployment Helper"
echo "=============================================="
echo ""
echo "Your project is ready to deploy!"
echo ""
echo "EASIEST METHOD (No installation needed):"
echo "1. Go to https://vercel.com and sign up/login"
echo "2. Click 'Add New Project'"
echo "3. Drag and drop this entire folder onto the Vercel dashboard"
echo "4. Your app will be live in seconds!"
echo ""
echo "ALTERNATIVE: Push to GitHub first, then deploy:"
echo ""
read -p "Do you want to push to GitHub now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "Please provide your GitHub repository URL:"
    read -p "GitHub repo URL (e.g., https://github.com/username/repo.git): " repo_url
    
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"
        git branch -M main
        git push -u origin main
        echo ""
        echo "✅ Pushed to GitHub!"
        echo "Now go to https://vercel.com and import your repository."
    else
        echo "No URL provided. Skipping GitHub push."
    fi
fi

echo ""
echo "📋 Demo Accounts to share with client:"
echo "  Customer: customer1@demo.com / Customer@123"
echo "  Agent L1: agent1@demo.com / Agent@123"
echo "  Agent L2: l2agent@demo.com / Agent@123"
echo "  Manager: manager@demo.com / Manager@123"
echo "  Admin: admin@demo.com / Admin@123"
echo ""
echo "✨ Your app is ready to deploy!"

