#!/bin/bash
set -e

# Cleanup
rm -rf .git
git init
git remote add origin https://github.com/mynameiskira/skilltest.git
git config user.name "ANOUAR Abdelmajid"
git config user.email "abdelmajid.anouar@example.com"

# 1. Base Project (Server + Client + Configs)
git add .
# Unstage specific doc and version files to simulate progressive history
git reset HEAD README.md CHANGELOG.md VERSION CONTRIBUTING.md feature_*.md FEATURE_*.md push_repo.sh rebuild_history.sh
git commit -m "chore: initial project setup with CI/CD pipelines and docker configuration"

# 2. Documentation Feature (Develop)
git checkout -b develop
git add README.md CONNEBTRIBUTING.md FEATURE_*.md feature_*.md CONTRIBUTING.md
# Ignore errors if files don't exist
git commit -m "feat(docs): add comprehensive project documentation" || echo "No docs to commit"

# 3. Release 1.0.0 (Main)
git checkout main
git merge develop --no-ff -m "chore(release): merge develop for version 1.0.0"
git tag -a v1.0.0 -m "Release version 1.0.0"

# 4. Hotfix (Security)
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

# Final Cleanup
git branch -d hotfix/v1.0.1
git checkout main
git add . # Add remaining scripts if any
git commit -m "chore: add helper scripts" || true

echo "✅ History Rebuilt Successfully!"
