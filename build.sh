#!/usr/bin/env bash
# This script tells the Render server how to build your app.

# exit on error
set -o errexit

echo "--- Installing Node.js dependencies ---"
npm install

echo "--- Downloading and installing yt-dlp ---"
# Download the latest yt-dlp binary from GitHub to a standard system path
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp

# Make the binary executable
chmod a+rx /usr/local/bin/yt-dlp

echo "--- Installing ffmpeg ---"
# Update package list and install ffmpeg (needed for merging formats)
apt-get update && apt-get install -y ffmpeg

echo "--- Build finished ---"
