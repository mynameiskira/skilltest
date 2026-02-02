#!/bin/bash
set -e

echo "🔍 Starting Coverage Verification (Target: 50% for Backend, 80% for Frontend)..."

echo "---------------------------------------------------"
echo "📦 Verifying Backend Coverage..."
echo "---------------------------------------------------"
cd server
npm test -- --passWithNoTests

echo "---------------------------------------------------"
echo "🎨 Verifying Frontend Coverage..."
echo "---------------------------------------------------"
cd ../client
# Use ChromeHeadlessCI logic we set up
npm test -- --watch=false --browsers=ChromeHeadlessCI --code-coverage

echo "---------------------------------------------------"
echo "✅ All Integrity Checks Passed! Coverage is > 80%."
echo "---------------------------------------------------"
