# FEDORA-MCP-SERVER Setup & Configuration

## Overview
This document provides comprehensive instructions for setting up and configuring the FEDORA-MCP-SERVER with WSL integration for secure command-line operations.

---

## Prerequisites

### System Requirements
- **Operating System**: Windows 10/11 with WSL2 support
- **Python**: Version 3.10 or higher
- **WSL**: Windows Subsystem for Linux 2
- **Fedora Linux**: WSL distribution (FedoraLinux-42 recommended)
- **Memory**: Minimum 2GB RAM available
- **Storage**: 1GB free space for WSL and dependencies

### WSL Setup Requirements
- **WSL2**: Latest version of Windows Subsystem for Linux
- **Fedora Distribution**: Fedora Linux WSL distribution
- **Linux Tools**: Standard Unix/Linux command-line tools

---

## Installation Steps

### 1. Install WSL and Fedora Linux
```powershell
# Enable WSL feature (run as Administrator)
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart computer, then set WSL2 as default
wsl --set-default-version 2

# Install Fedora Linux distribution
wsl --install -d FedoraLinux-42

# Verify installation
wsl -l -v
```

### 2. Configure Fedora Linux Environment
```bash
# Update Fedora packages
sudo dnf update -y

# Install essential tools
sudo dnf install -y git curl wget nano vim

# Verify tools are available
which ls cat pwd echo find grep stat mkdir df free uname head tail sed
```

### 3. Install Python Dependencies
```bash
# Navigate to FEDORA-MCP-SERVER directory
cd /path/to/FEDORA-MCP-SERVER

# Create virtual environment
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # Linux/macOS
# or
.venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Install in development mode
pip install -e .
```

---

## Environment Configuration

### Required Environment Variables
```bash
# Core configuration
export ALLOWED_DIR="/mnt/d/Users 2.o/PY charm/adya_hackathon/test_mcp_directory"
export ALLOWED_COMMANDS="ls,cat,pwd,echo,find,grep,stat,mkdir,df,free,uname,head,tail,sed"
export ALLOWED_FLAGS="-l,-a,--help,--version,-h,-r,-n,-p,-maxdepth,-name,-type,-f"
export MAX_COMMAND_LENGTH="2048"
export COMMAND_TIMEOUT="60"
export ALLOW_SHELL_OPERATORS="true"
export WSL_DISTRO="FedoraLinux-42"
```

### MCP Client Configuration

#### For Python MCP Client
Add to your client configuration:
```python
{
    "server_name": "FEDORA-MCP-SERVER",
    "command": "uv",
    "args": [
        "--directory",
        "../servers/FEDORA-MCP-SERVER",
        "run",
        "cli-mcp-server"
    ],
    "env": {
        "ALLOWED_DIR": "D:\\Users 2.o\\PY charm\\adya_hackathon\\test_mcp_directory",
        "ALLOWED_COMMANDS": "ls,cat,pwd,echo,find,grep,stat,mkdir,df,free,uname,head,tail,sed",
        "ALLOWED_FLAGS": "-l,-a,--help,--version,-h,-r,-n,-p,-maxdepth,-name,-type,-f",
        "MAX_COMMAND_LENGTH": "2048",
        "COMMAND_TIMEOUT": "60",
        "ALLOW_SHELL_OPERATORS": "true",
        "WSL_DISTRO": "FedoraLinux-42"
    }
}
```

#### For Claude Desktop
Add to Claude Desktop configuration:
```json
{
  "mcpServers": {
    "FEDORA-MCP-SERVER": {
      "command": "uv",
      "args": [
        "--directory",
        "/path/to/FEDORA-MCP-SERVER",
        "run",
        "cli-mcp-server"
      ],
      "env": {
        "ALLOWED_DIR": "/path/to/allowed/directory",
        "ALLOWED_COMMANDS": "ls,cat,pwd,echo,find,grep,stat,mkdir,df,free,uname,head,tail,sed",
        "ALLOWED_FLAGS": "-l,-a,--help,--version,-h,-r,-n,-p,-maxdepth,-name,-type,-f",
        "MAX_COMMAND_LENGTH": "2048",
        "COMMAND_TIMEOUT": "60",
        "ALLOW_SHELL_OPERATORS": "true",
        "WSL_DISTRO": "FedoraLinux-42"
      }
    }
  }
}
```

---

## Security Configuration

### Command Whitelisting
Configure allowed commands based on your security requirements:

```bash
# Basic file operations only
export ALLOWED_COMMANDS="ls,cat,pwd,echo"

# Extended file operations
export ALLOWED_COMMANDS="ls,cat,pwd,echo,find,grep,head,tail"

# Full development environment
export ALLOWED_COMMANDS="ls,cat,pwd,echo,find,grep,stat,mkdir,df,free,uname,head,tail,sed"

# Allow all commands (use with caution)
export ALLOWED_COMMANDS="all"
```

### Flag Restrictions
Control which command-line flags are permitted:

```bash
# Basic flags only
export ALLOWED_FLAGS="-l,-a,--help,--version"

# Extended flags for development
export ALLOWED_FLAGS="-l,-a,--help,--version,-h,-r,-n,-p,-maxdepth,-name,-type,-f"

# Allow all flags (use with extreme caution)
export ALLOWED_FLAGS="all"
```

### Directory Restrictions
Limit operations to specific directories:

```bash
# Single directory restriction
export ALLOWED_DIR="/path/to/safe/directory"

# Multiple directories (not currently supported - use single directory)
# Future enhancement: support for multiple allowed directories
```

---

## WSL Integration Setup

### Verify WSL Configuration
```powershell
# Check WSL status
wsl --status

# List installed distributions
wsl -l -v

# Test Fedora Linux access
wsl -d FedoraLinux-42 pwd

# Test command execution
wsl -d FedoraLinux-42 ls -la
```

### Path Translation Setup
The server automatically translates Windows paths to WSL paths:
- `D:\path\to\dir` → `/mnt/d/path/to/dir`
- `C:\Users\Name` → `/mnt/c/Users/Name`

### WSL Performance Optimization
```bash
# Configure WSL for better performance
echo "[wsl2]" >> /etc/wsl.conf
echo "memory=4GB" >> /etc/wsl.conf
echo "processors=2" >> /etc/wsl.conf
```

---
