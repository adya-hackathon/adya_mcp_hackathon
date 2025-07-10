# MCP-JOOMLA Server

A comprehensive Model Context Protocol (MCP) server for Joomla! CMS integration that enables AI assistants to interact with Joomla websites through the Joomla REST API, providing content management and site administration capabilities.

## 🎯 Key Features

- ✅ **Article Management**: Create, read, update, search, and manage article states
- ✅ **Category Management**: Retrieve and organize content categories
- ✅ **User Management**: Access user information and profiles
- ✅ **Menu Management**: Retrieve site navigation structures
- ✅ **Site Information**: Get comprehensive site configuration
- ✅ **Content Operations**: Move articles to trash, publish/unpublish content
- ✅ **Search Capabilities**: Advanced search across articles and content
- ✅ **API Integration**: Full integration with Joomla's REST API
- ✅ **Security**: Bearer token authentication for secure API access
- ✅ **State Management**: Control article publication states
- ✅ **Rich Content**: Support for HTML content and metadata

## Installation

```bash
uv run mcp-joomla
```

## Usage

This server provides tools for managing Joomla content through the MCP protocol.

## Tools Available

### Article Management (6 tools)
- `get_joomla_articles` - Retrieve all articles from Joomla
- `create_article` - Create new articles with content and metadata
- `get_article_by_id` - Retrieve a specific article by its ID
- `search_articles` - Search articles by title, content, or criteria
- `manage_article_state` - Change article publication state (publish/unpublish/archive/trash)
- `move_article_to_trash` - Move articles to trash with recovery option
- `update_article` - Update existing articles with new content

### Category Management (1 tool)
- `get_joomla_categories` - Retrieve all article categories

### User Management (2 tools)
- `get_joomla_users` - Retrieve all users with optional limit
- `get_user_by_id` - Get detailed information about a specific user

### Site Management (2 tools)
- `get_joomla_menus` - Retrieve menu structures and navigation items
- `get_site_info` - Get general site configuration and information

**Total: 12 tools available**

## Configuration

The server requires Joomla API credentials to be provided when calling tools:
- `base_url` - Your Joomla site URL (e.g., "https://your-site.com/")
- `bearer_token` - Your Joomla API bearer token for authentication

### Example Configuration
```json
{
  "base_url": "https://ashhs.joomla.com/",
  "bearer_token": "c2hhMjU2Ojg4NDplNzQxYTM0MzQ3NjQ0ZDYzNWE3NTVjNmYwN2JkNTk3YjIwZjM3M2U5MjIzYzI3MzNkNTE1NTJhZjBjNDRlMWFj"
}
```

## 📚 Demo Videos & Documentation

### Demo Videos
- **Joomla MCP Credentials Setup**: [Watch Video](https://drive.google.com/file/d/1eXJCE2PqgX-wZ582q3_DGzAxNWx5n1cC/view?usp=sharing)
- **Joomla MCP Testing Demo**: [Watch Video](https://drive.google.com/file/d/1LD7NNYvd9r1Mj7JN73bZEBqpKY6uclhT/view?usp=sharing)

### Comprehensive Documentation
For detailed documentation, please refer to:
- **📋 Server Features**: [MCP-JOOMLA Documentation](../../../../mcp_servers_documentation/MCP-JOOMLA/server_features.md)
- **🔐 Credentials Setup**: [Setup Guide](../../../../mcp_servers_documentation/MCP-JOOMLA/credentials.md)
- **🎥 Demo Videos**: [Video Examples](../../../../mcp_servers_documentation/MCP-JOOMLA/demo_videos.md)

### Joomla Requirements
- **Joomla Version**: 3.9+ or 4.x
- **REST API**: Joomla REST API component enabled
- **HTTPS**: SSL certificate required for secure communication
- **Bearer Token**: API authentication token configured

## 🚀 Quick Start

1. **Enable Joomla REST API**: Activate the REST API plugin in your Joomla admin panel
2. **Generate Bearer Token**: Create an API token in Joomla user management
3. **Configure Server**: Set up base URL and bearer token credentials
4. **Test Connection**: Use `get_site_info` to verify connectivity

## 🔒 Security

- **Bearer Token Authentication**: Secure API access with tokens
- **HTTPS Required**: All communications must use HTTPS
- **Role-Based Access**: Joomla ACL integration for permissions
- **Input Validation**: Comprehensive data validation and sanitization
- `bearer_token` - API token for authentication
