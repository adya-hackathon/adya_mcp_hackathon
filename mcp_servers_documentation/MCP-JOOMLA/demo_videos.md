# MCP-JOOMLA Demo Videos & Examples

## Overview
This document provides links to demonstration videos and practical examples showing the MCP-JOOMLA server's content management and Joomla! CMS integration capabilities.

---

## 📹 Official Demo Videos

### Credentials Setup Video
**Joomla MCP Credentials Setup**
- **Link**: [Watch Video](https://drive.google.com/file/d/1eXJCE2PqgX-wZ582q3_DGzAxNWx5n1cC/view?usp=sharing)
- **Duration**: Step-by-step credential configuration
- **Content**: Shows how to obtain and configure Joomla API credentials
- **Covers**: Bearer token generation, REST API setup, authentication testing

### Testing Demo Video
**Joomla MCP Testing Demo**
- **Link**: [Watch Video](https://drive.google.com/file/d/1LD7NNYvd9r1Mj7JN73bZEBqpKY6uclhT/view?usp=sharing)
- **Duration**: Comprehensive testing demonstration
- **Content**: Shows all 12 Joomla MCP tools in action
- **Covers**: Article management, user profiles, site administration, content operations

---
## 🔐 Credential JSON Payload
Example payload format for sending credentials to the MCP Server which going to be use it in Client API paylod:
```json
{
  "selected_server_credentials": {
    "MCP-JOOMLA": {
      "base_url": "https://ashhs.joomla.com/",
      "bearer_token": "c2hhMjU2Ojg4NDplNzQxYTM0MzQ3NjQ0ZDYzNWE3NTVjNmYwN2JkNTk3YjIwZjM3M2U5MjIzYzI3MzNkNTE1NTJhZjBjNDRlMWFj"
    }
  },
  "client_details": {
    "base_url": "https://ashhs.joomla.com/",
    "bearer_token": "c2hhMjU2Ojg4NDplNzQxYTM0MzQ3NjQ0ZDYzNWE3NTVjNmYwN2JkNTk3YjIwZjM3M2U5MjIzYzI3MzNkNTE1NTJhZjBjNDRlMWFj",
    "api_key": "your-gemini-api-key",
    "temperature": 0.1,
    "max_token": 20000,
    "input": "Use get_site_info to get comprehensive information about the Joomla site",
    "input_type": "text",
    "prompt": "you are a helpful assistant",
    "chat_model": "gemini-2.5-flash",
    "chat_history": [{"role": "user", "content": "Hello"}]
  },
  "selected_client": "MCP_CLIENT_GEMINI",
  "selected_servers": ["MCP-JOOMLA"]
}