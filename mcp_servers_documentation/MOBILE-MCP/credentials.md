# MOBILE-MCP-MAIN Server Setup & Configuration

## Overview
This document provides comprehensive instructions for setting up and configuring the MOBILE-MCP-MAIN server for mobile device automation and testing.

---


## Installation Steps

### 1. Install Node.js Dependencies
```bash
# Navigate to MOBILE-MCP-MAIN directory
cd /path/to/MOBILE-MCP-MAIN

# Install dependencies
npm install

# Install Appium globally
npm install -g appium

# Install Appium drivers
appium driver install uiautomator2  # For Android
appium driver install xcuitest      # For iOS (macOS only)
```

### 2. Configure Android Environment
```bash
# Set Android SDK path (add to ~/.bashrc or ~/.zshrc)
export ANDROID_HOME=/path/to/android-sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Verify ADB installation
adb version

# List connected Android devices
adb devices
```

### 3. Configure iOS Environment (macOS only)
```bash
# Install Xcode command line tools
xcode-select --install

# Verify iOS Simulator
xcrun simctl list

# Boot an iOS simulator
xcrun simctl boot "iPhone 16"
```

### 4. Start Appium Server
```bash
# Start Appium server on default port
appium server --port 4723

# Or start with custom configuration
appium server --port 4723 --log-level debug
```

---

## MCP Client Configuration

### For Claude Desktop
Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application\ Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "MOBILE-MCP-MAIN": {
      "command": "node",
      "args": [
        "/path/to/MOBILE-MCP-MAIN/lib/index.js"
      ]
    }
  }
}
```

### For Other MCP Clients
```json
{
  "server_name": "MOBILE-MCP-MAIN",
  "command": "node",
  "args": ["/path/to/MOBILE-MCP-MAIN/lib/index.js"],
  "env": {
    "APPIUM_SERVER_URL": "http://localhost:4723"
  }
}
```

---
