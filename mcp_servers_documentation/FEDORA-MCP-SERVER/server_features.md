---

###   *About MCP Server, Features, and Capabilities*
```markdown
# FEDORA-MCP-SERVER Overview

## What is the FEDORA-MCP-SERVER?
The FEDORA-MCP-SERVER is a secure command-line interface MCP server that enables AI assistants to execute Unix/Linux commands safely through WSL (Windows Subsystem for Linux) integration, providing controlled CLI access with robust security measures.

---

## Key Features
- ✅ **Secure Command Execution**: Strict validation and whitelisting
- ✅ **WSL Integration**: Seamless Linux command execution on Windows
- ✅ **Path Traversal Prevention**: Secure directory restrictions
- ✅ **Command Whitelisting**: Configurable allowed commands and flags
- ✅ **File System Operations**: Safe file and directory management
- ✅ **System Information**: Comprehensive system details retrieval
- ✅ **Shell Operator Support**: Configurable shell command chaining
- ✅ **Execution Timeouts**: Prevents runaway processes

---

## Tool Categories & Capabilities
| Category | Tools | Description |
|----------|-------|-------------|
| **Command Execution** | 1 tool | Execute Unix/Linux commands securely |
| **File Operations** | 4 tools | Create, read, write, and search files |
| **Directory Management** | 2 tools | List and create directories |
| **System Information** | 2 tools | Get system info and security rules |

---

## Available Tools (9 Total)

### Command Execution
- `run_command` - Execute Unix/Linux commands with security validation

### File Operations
- `read_file` - Read file contents safely
- `write_file` - Create or update files with validation
- `get_file_info` - Get file metadata and properties
- `search_files` - Search for files using patterns

### Directory Management
- `list_directory` - List directory contents with details
- `create_directory` - Create new directories safely

### System & Security
- `system_info` - Get comprehensive system information
- `show_security_rules` - Display current security configuration

---
