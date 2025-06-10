#!/usr/bin/env bash
# This script tells the Render server how to build your app.

# exit on error
set -o errexit

# Install Node.js dependencies
npm install

# Install yt-dlp (the python package)
pip install yt-dlp

# Install ffmpeg (a common dependency for yt-dlp to merge video/audio)
apt-get update && apt-get install -y ffmpeg
