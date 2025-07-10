# MOBILE-MCP-MAIN Demo Videos & Examples

## Overview
This document provides links to demonstration videos and practical examples showing the MOBILE-MCP-MAIN server in action.

---

## 📹 Official Demo Videos

### Primary Demo Video
**Mobile MCP Testing Demo**
- **Link**: [Watch Video](https://drive.google.com/file/d/1iiUomFFrBAR7HZrKhV2m99ic2-U4gHHN/view?usp=sharing)
- **Duration**: Comprehensive demonstration
- **Content**: Shows mobile device automation capabilities
- **Covers**: Device connection, app interaction, screen automation

---
## 🔐 Credential JSON Payload
Example payload format for sending credentials to the MCP Server which going to be use it in Client API paylod:
```json
{
  "selected_server_credentials": {
    "MOBILE-MCP-MAIN": {}
  },
  "client_details": {
    "api_key": "your-gemini-api-key",
    "temperature": 0.1,
    "max_token": 20000,
    "input": "Use the mobile_list_available_devices tool to list available mobile devices",
    "input_type": "text",
    "prompt": "you are a helpful assistant",
    "chat_model": "gemini-2.5-flash",
    "chat_history": [{"role": "user", "content": "Hello"}]
  },
  "selected_client": "MCP_CLIENT_GEMINI",
  "selected_servers": ["MOBILE-MCP-MAIN"]
}