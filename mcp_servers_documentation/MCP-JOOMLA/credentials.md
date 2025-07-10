# MCP-JOOMLA Server Credentials & Setup

## Overview
This document provides comprehensive instructions for obtaining and configuring Joomla! CMS credentials for the MCP-JOOMLA server integration.

---

## Joomla REST API Setup

### 1. Enable REST API in Joomla
1. **Login to Joomla Admin**: Access your Joomla administrator panel
2. **Navigate to Plugins**: Go to Extensions > Plugins
3. **Find REST API Plugin**: Search for "Web Services" or "API"
4. **Enable Plugin**: Activate the Joomla REST API plugin
5. **Configure Settings**: Set up API access permissions

### 2. Create API User Account
1. **Create New User**: Go to Users > Manage > Add New User
2. **Set User Details**: Provide username, email, and password
3. **Assign Permissions**: Grant appropriate user group permissions
4. **API Access**: Ensure user has API access rights
5. **Save User**: Complete user creation process

### 3. Generate Bearer Token
1. **Access Token Management**: Go to Users > Manage > API Tokens
2. **Create New Token**: Generate a new API token
3. **Set Token Name**: Provide descriptive token name
4. **Copy Token**: Save the generated bearer token securely
5. **Set Permissions**: Configure token access permissions

---

## Credential Configuration

### Required Credentials Format
```json
{
  "MCP-JOOMLA": {
    "base_url": "https://your-joomla-site.com/",
    "bearer_token": "your-bearer-token-here"
  }
}
```

### Example Working Configuration
```json
{
  "MCP-JOOMLA": {
    "base_url": "https://ashhs.joomla.com/",
    "bearer_token": "c2hhMjU2Ojg4NDplNzQxYTM0MzQ3NjQ0ZDYzNWE3NTVjNmYwN2JkNTk3YjIwZjM3M2U5MjIzYzI3MzNkNTE1NTJhZjBjNDRlMWFj"
  }
}
```

---

## MCP Client Configuration

### For Python MCP Client
```python
{
    "server_name": "MCP-JOOMLA",
    "command": "uv",
    "args": [
        "--directory",
        "../servers/MCP-JOOMLA/mcp-joomla",
        "run",
        "mcp-joomla"
    ],
    "credentials": {
        "base_url": "https://your-joomla-site.com/",
        "bearer_token": "your-bearer-token-here"
    }
}
```

### For Claude Desktop
```json
{
  "mcpServers": {
    "MCP-JOOMLA": {
      "command": "uv",
      "args": [
        "--directory",
        "/path/to/MCP-JOOMLA/mcp-joomla",
        "run",
        "mcp-joomla"
      ],
      "env": {
        "JOOMLA_BASE_URL": "https://your-joomla-site.com/",
        "JOOMLA_BEARER_TOKEN": "your-bearer-token-here"
      }
    }
  }
}
```

### For API Testing (Postman-style)
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
```

---
