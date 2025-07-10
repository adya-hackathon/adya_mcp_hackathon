# EVENTBRITE-MCP-MAIN Demo Videos & Examples

## Overview
This document provides links to demonstration videos and practical examples showing the EVENTBRITE-MCP-MAIN server's event management and API integration capabilities.

---

## 📹 Official Demo Videos

### Credentials Setup Video
**Eventbrite MCP Credentials Setup**
- **Link**: [Watch Video](https://drive.google.com/file/d/1DKX2dLg-qJRlCSBmrebbw-Du8PSgLXqA/view?usp=sharing)
- **Duration**: Step-by-step credential configuration
- **Content**: Shows how to obtain and configure Eventbrite API credentials
- **Covers**: API key generation, environment setup, authentication testing

### Testing Demo Video
**Eventbrite MCP Testing Demo**
- **Link**: [Watch Video](https://drive.google.com/file/d/1H7RICV2bEndzrTmQECEGN4OyNmNAaex9/view?usp=sharing)
- **Duration**: Comprehensive testing demonstration
- **Content**: Shows all 10 Eventbrite MCP tools in action
- **Covers**: Event search, venue details, ticket management, user profiles

---
## 🔐 Credential JSON Payload
Example payload format for sending credentials to the MCP Server which going to be use it in Client API paylod:
```json
{
  "selected_server_credentials": {
    "EVENTBRITE-MCP-MAIN": {
      "api_key": "NUYEGTUZJIAFB4DA32DB",
      "public_token": "SEHCHLEDGJWW4YNLJFP7",
      "organization_id": "2829748307341"
    }
  },
  "client_details": {
    "api_key": "your-gemini-api-key",
    "temperature": 0.1,
    "max_token": 20000,
    "input": "Use get_categories to list all available event categories",
    "input_type": "text",
    "prompt": "you are a helpful assistant",
    "chat_model": "gemini-2.5-flash",
    "chat_history": [{"role": "user", "content": "Hello"}]
  },
  "selected_client": "MCP_CLIENT_GEMINI",
  "selected_servers": ["EVENTBRITE-MCP-MAIN"]
}
```
