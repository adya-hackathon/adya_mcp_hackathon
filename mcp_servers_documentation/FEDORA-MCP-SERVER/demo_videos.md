# FEDORA-MCP-SERVER Demo Videos & Examples

## Overview
This document provides links to demonstration videos and practical examples showing the FEDORA-MCP-SERVER with WSL integration in action.

---

## 📹 Official Demo Videos

### Primary Demo Video
**Fedora MCP Testing Demo**
- **Link**: [Watch Video](https://drive.google.com/file/d/1NY8UmxiFUwPWYSJhvXhD56dYRLAA-CGr/view?usp=sharing)
- **Duration**: Comprehensive demonstration
- **Content**: Shows WSL integration and secure command execution
- **Covers**: Command execution, file operations, security features

---
## 🔐 Credential JSON Payload
Example payload format for sending credentials to the MCP Server which going to be use it in Client API paylod:
```json
{
  "selected_server_credentials": {
    "FEDORA-MCP-SERVER": {}
  },
  "client_details": {
    "api_key": "your-gemini-api-key",
    "temperature": 0.1,
    "max_token": 20000,
    "input": "Use the run_command tool to execute the command 'pwd' to show current directory",
    "input_type": "text",
    "prompt": "you are a helpful assistant",
    "chat_model": "gemini-2.5-flash",
    "chat_history": [{"role": "user", "content": "Hello"}]
  },
  "selected_client": "MCP_CLIENT_GEMINI",
  "selected_servers": ["FEDORA-MCP-SERVER"]
}```