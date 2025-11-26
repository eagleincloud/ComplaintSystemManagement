#!/bin/bash

echo "🚀 Push to GitHub Helper"
echo "========================"
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "✅ Remote 'origin' already configured:"
    git remote -v
    echo ""
    read -p "Push to existing remote? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -u origin main
        echo ""
        echo "✅ Code pushed to GitHub!"
        exit 0
    fi
fi

echo "Please provide your GitHub repository URL:"
echo "Example: https://github.com/username/repo-name.git"
read -p "GitHub repo URL: " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "Setting up remote and pushing..."
git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Your repository: $repo_url"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   1. The repository URL is correct"
    echo "   2. You have access to the repository"
    echo "   3. You're authenticated with GitHub"
fi

