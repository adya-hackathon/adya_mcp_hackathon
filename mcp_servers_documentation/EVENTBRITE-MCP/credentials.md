# EVENTBRITE-MCP-MAIN Server Credentials & Setup

## Overview
This document provides comprehensive instructions for obtaining and configuring Eventbrite API credentials for the EVENTBRITE-MCP-MAIN server.

---

## Prerequisites

### System Requirements
- **Node.js**: Version 16 or higher
- **NPM**: Latest version
- **Eventbrite Account**: Active Eventbrite account (free or paid)
- **API Access**: Eventbrite API access permissions

### Account Requirements
- **Eventbrite Account**: Personal or organization account
- **Developer Access**: API development permissions
- **Organization ID**: For organization-specific operations
- **Event Management**: Permission to manage events (if required)

---

## Eventbrite API Credentials Setup

### 1. Create Eventbrite Developer Account
1. **Visit Eventbrite Developers**: Go to [https://www.eventbrite.com/platform/](https://www.eventbrite.com/platform/)
2. **Sign In**: Use your existing Eventbrite account or create a new one
3. **Access Developer Console**: Navigate to the developer dashboard
4. **Create Application**: Register a new application for API access

### 2. Generate API Credentials
1. **Create App**: In the developer console, create a new application
2. **App Details**: Provide application name, description, and website
3. **Generate Keys**: Create API keys and tokens
4. **Copy Credentials**: Save all generated credentials securely

### 3. Required Credential Types

#### API Key (Required)
- **Purpose**: Primary authentication for API requests
- **Format**: Alphanumeric string
- **Example**: `NUYEGTUZJIAFB4DA32DB`
- **Usage**: Include in all API requests

#### Public Token (Optional)
- **Purpose**: Public-facing operations
- **Format**: Alphanumeric string
- **Example**: `SEHCHLEDGJWW4YNLJFP7`
- **Usage**: Client-side operations

#### Private Token (Optional)
- **Purpose**: Server-side sensitive operations
- **Format**: Alphanumeric string
- **Example**: `YS7UGZ7LPD2MAFFBVMDI`
- **Usage**: Backend operations

#### Client Secret (Optional)
- **Purpose**: OAuth authentication flows
- **Format**: Long alphanumeric string
- **Example**: `GXMIVLF6ZYJZ4ZY7QQHJXDEZOQR46XCTWHJROWSUPQ6UKSDHTU`
- **Usage**: OAuth token exchange

---

## Configuration Setup

### Environment Variables
```bash
# Primary API authentication
export EVENTBRITE_API_KEY="NUYEGTUZJIAFB4DA32DB"

# Optional additional tokens
export EVENTBRITE_PUBLIC_TOKEN="SEHCHLEDGJWW4YNLJFP7"
export EVENTBRITE_PRIVATE_TOKEN="YS7UGZ7LPD2MAFFBVMDI"
export EVENTBRITE_CLIENT_SECRET="GXMIVLF6ZYJZ4ZY7QQHJXDEZOQR46XCTWHJROWSUPQ6UKSDHTU"

# Organization settings
export EVENTBRITE_ORGANIZATION_ID="2829748307341"
```

### MCP Client Configuration

#### For Python MCP Client
```python
{
    "server_name": "EVENTBRITE-MCP-MAIN",
    "command": "node",
    "args": ["../../js/servers/EVENTBRITE-MCP-MAIN/build/index.js"],
    "env": {
        "EVENTBRITE_API_KEY": "NUYEGTUZJIAFB4DA32DB"
    }
}
```

#### For Claude Desktop
```json
{
  "mcpServers": {
    "EVENTBRITE-MCP-MAIN": {
      "command": "node",
      "args": [
        "/path/to/EVENTBRITE-MCP-MAIN/build/index.js"
      ],
      "env": {
        "EVENTBRITE_API_KEY": "NUYEGTUZJIAFB4DA32DB"
      }
    }
  }
}
```

#### For API Testing (Postman-style)
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