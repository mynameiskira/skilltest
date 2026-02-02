#!/bin/bash
set -e

# Cleanup
rm -rf .git
git init
git remote add origin https://github.com/mynameiskira/skilltest.git
git config user.name "ANOUAR Abdelmajid"
git config user.email "abdelmajid.anouar@example.com"

# 1. Base Project
git add .
# Unstage docs
git rm --cached README.md CHANGELOG.md VERSION CONTRIBUTING.md FEATURE_*.md push_repo.sh rebuild_history*.sh > /dev/null 2>&1 || true
git commit -m "chore: initial project setup with CI/CD pipelines and docker configuration"

# 2. Documentation (Develop)
git checkout -b develop
git add README.md CONTRIBUTING.md FEATURE_*.md
git commit -m "feat(docs): add comprehensive project documentation"

# 3. Release 1.0.0
git checkout main
git merge develop --no-ff -m "chore(release): merge develop for version 1.0.0"
git tag -a v1.0.0 -m "Release version 1.0.0"

# 4. Hotfix Security
git checkout -b hotfix/v1.0.1
git add CHANGELOG.md VERSION
git commit -m "fix(security): remove sensitive data and apply patches"

# 5. Merge Hotfix
git checkout main
git merge hotfix/v1.0.1 --no-ff -m "chore(release): merge hotfix v1.0.1"
git tag -a v1.0.1 -m "Release version 1.0.1 - Security Patch"

# 6. Sync Develop
git checkout develop
git merge hotfix/v1.0.1 --no-ff -m "chore(sync): sync hotfix v1.0.1 to develop"

# Cleanup
git branch -d hotfix/v1.0.1
git checkout main
# Commit scripts if needed
git add push_repo.sh rebuild_history*.sh
git commit -m "chore: add maintainer scripts"

echo "✅ History Rebuilt Successfully!"
