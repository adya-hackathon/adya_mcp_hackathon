# Structured Metadata MCP Server Credentials

## Overview
This document provides instructions on obtaining and structuring the credentials needed to connect the Structured Metadata MCP Server in the Adya Hackathon Platform.

---

## Credential Format
```json
{
  "STRUCTURED_METADATA": {
    "cloudName": "your-cloud-name",
    "apiKey": "your-api-key",
    "apiSecret": "your-api-secret"
  }
}
```

- `cloudName`: Your Cloudinary cloud name.
- `apiKey`: Your Cloudinary API key.
- `apiSecret`: Your Cloudinary API secret.

## Important Changes
- **Environment Variables Removed**: The server no longer reads credentials from environment variables.
- **Client-Side Credential Passing**: All credentials are now passed through the MCP client.
- **Dynamic Authentication**: Credentials are injected into each tool call for secure, dynamic authentication.

## How It Works
1. Credentials are provided in the client payload under `selected_server_credentials`
2. The client automatically injects credentials into tool arguments as `__credentials__`
3. The server creates a new SDK client instance for each request with the provided credentials
4. No credentials are stored or cached on the server side

Store these credentials in the configuration file as required by the platform. 