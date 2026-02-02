#!/bin/bash
echo "🚀 Pushing SkillTest repository to GitHub..."

# Push all branches
git push origin --all

# Push all tags
git push origin --tags

echo "✅ Deployment complete! Check your Actions tab on GitHub."
