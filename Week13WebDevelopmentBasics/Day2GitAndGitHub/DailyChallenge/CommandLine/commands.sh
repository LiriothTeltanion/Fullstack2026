#!/usr/bin/env bash
# Command line practice: build a small project folder, move files around,
# then turn it into a Git repository. Everything happens inside a temporary
# folder, so running it never touches my real files.
set -euo pipefail

WORKDIR="$(mktemp -d)"
cd "$WORKDIR"
echo "1) Working in a temporary folder"

# Make folders (-p creates the parents too)
mkdir -p my-site/css my-site/js my-site/images
echo "2) Folders created:"
ls my-site

# Create files
touch my-site/index.html my-site/css/style.css my-site/js/app.js
echo "<h1>Hello from the command line</h1>" > my-site/index.html
echo "3) index.html says: $(cat my-site/index.html)"

# Copy, rename and delete
cp my-site/index.html my-site/about.html
mv my-site/about.html my-site/contact.html
rm my-site/contact.html
rmdir my-site/images
echo "4) After copy, rename and delete:"
ls my-site

# Append a line, then count lines
echo "<p>Second line</p>" >> my-site/index.html
echo "5) index.html now has $(wc -l < my-site/index.html) lines"

# Find every CSS and JS file
echo "6) Files found with find:"
find my-site -type f \( -name "*.css" -o -name "*.js" \) | sort

# Turn the folder into a Git repository with one commit
cd my-site
git init --quiet
git -c core.autocrlf=false add .
git -c user.name="Practice" -c user.email="practice@example.com" commit --quiet -m "Initial commit"
echo "7) Git log:"
git log --oneline | sed 's/^[0-9a-f]* /<hash> /'

# Clean up the temporary folder
cd /
rm -rf "$WORKDIR"
echo "8) Temporary folder removed"
