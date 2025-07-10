# EVENTBRITE-MCP-MAIN Server

[![MCP Badge](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)

A comprehensive Model Context Protocol (MCP) server that provides tools for interacting with the Eventbrite API. This server enables AI assistants to search for events, manage event details, retrieve venue information, handle ticketing, and perform comprehensive event management operations.

<a href="https://glama.ai/mcp/servers/ev69dbqhrk">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/ev69dbqhrk/badge" alt="Eventbrite Server MCP server" />
</a>

## 🎯 Key Features

- ✅ **Event Discovery**: Search events by location, date, category, and keywords
- ✅ **Event Management**: Retrieve detailed event information and metadata
- ✅ **Venue Information**: Access venue details and location data
- ✅ **Ticket Management**: View ticket classes, pricing, and availability
- ✅ **Order Processing**: Access order information and attendee data
- ✅ **Organization Management**: Manage organization events and settings
- ✅ **User Profile Access**: Retrieve user account information
- ✅ **Category Browsing**: Explore event categories and classifications
- ✅ **Discount Management**: Access promotional codes and discounts
- ✅ **API Integration**: Direct integration with Eventbrite's REST API

## 🛠️ Available Tools (10 Total)

### Event Operations (4 tools)
- **`search_events`**: Search for events based on various criteria
- **`get_event`**: Retrieve detailed information about a specific event
- **`get_organization_events`**: List events for a specific organization
- **`get_event_discounts`**: Retrieve discount codes and promotions

### Venue & Ticketing (3 tools)
- **`get_venue`**: Get detailed venue information including location
- **`get_event_ticket_classes`**: Retrieve ticket types and pricing
- **`get_event_orders`**: Access order information and purchase details

### User & Administration (3 tools)
- **`get_user_profile`**: Retrieve user account information
- **`get_categories`**: List available event categories
- **`get_event_attendees_summary`**: Get attendee statistics

## Installation

### From NPM

```bash
npm install -g @ibraheem4/eventbrite-mcp
```

### From Source

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Development

### Running in Development Mode

```bash
npm run dev
```

This will watch for changes in the source files, rebuild the project, and restart the server automatically.

### Running the MCP Server

You can run the MCP server using the provided run script:

```bash
./run.sh
```

This will start the MCP server using supergateway.

### Running with Inspector

To run the MCP server with the Inspector, you can use:

```bash
npm run inspector
```

This will start the Inspector, which provides a web interface for testing the MCP server. The Inspector will be available at http://localhost:5173.

### Running Manually

You can run the MCP server manually using:

```bash
npx -y supergateway --port 1337 --stdio "./build/index.js"
```

Or simply use the provided run script:

```bash
./run.sh
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Test the API directly
npm run test:api
```

## Configuration

To use this MCP server, you need to:

1. Obtain an Eventbrite API key from the [Eventbrite Developer Portal](https://www.eventbrite.com/platform/api)
2. Set up your API key in one of the following ways:
   - Create a `.env` file in the project root (copy from `.env.example`):
     ```
     EVENTBRITE_API_KEY=your_eventbrite_api_key_here
     ```
   - Or provide it as an environment variable:
     ```bash
     export EVENTBRITE_API_KEY=your_eventbrite_api_key_here
     ```
   - Or configure it in the MCP settings file (see below)
3. Test your API key:
   ```bash
   ./test-api-key.js
   ```
4. Configure the MCP server in your MCP settings file

### For Claude Desktop App

Add the following to your `~/Library/Application Support/Claude/claude_desktop_config.json` file (on macOS):

```json
{
  "mcpServers": {
    "eventbrite": {
      "command": "npx",
      "args": ["-y", "@ibraheem4/eventbrite-mcp"],
      "env": {
        "EVENTBRITE_API_KEY": "your-eventbrite-api-key"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### For Claude Developer Environment

Add the following to your `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` file (on macOS):

```json
{
  "mcpServers": {
    "eventbrite": {
      "command": "npx",
      "args": ["-y", "@ibraheem4/eventbrite-mcp"],
      "env": {
        "EVENTBRITE_API_KEY": "your-eventbrite-api-key"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Quick Start

If you've installed from source, you can use the provided run script:

```bash
./run.sh
```

This will build the project and start the MCP server.

## Available Tools

### search_events

Search for Eventbrite events based on various criteria.

Parameters:
- `query` (string, optional): Search query for events
- `location` (object, optional): Location to search around
  - `latitude` (number, required): Latitude coordinate
  - `longitude` (number, required): Longitude coordinate
  - `within` (string, optional): Distance (e.g., '10km', '10mi')
- `categories` (array of strings, optional): Category IDs to filter by
- `start_date` (string, optional): Start date in ISO format (e.g., '2023-01-01T00:00:00Z')
- `end_date` (string, optional): End date in ISO format (e.g., '2023-12-31T23:59:59Z')
- `price` (string, optional): Filter by 'free' or 'paid' events
- `page` (number, optional): Page number for pagination
- `page_size` (number, optional): Number of results per page (max 100)

### get_event

Get detailed information about a specific Eventbrite event.

Parameters:
- `event_id` (string, required): Eventbrite event ID

### get_categories

Get a list of Eventbrite event categories.

No parameters required.

### get_venue

Get information about a specific Eventbrite venue.

Parameters:
- `venue_id` (string, required): Eventbrite venue ID

## Available Resources

### Event Details Resource

URI Template: `eventbrite://events/{eventId}`

Get detailed information about a specific Eventbrite event.

## Example Usage

Once configured, you can ask Claude to use the Eventbrite MCP tools:

- "Search for music events in New York next weekend"
- "Get details about Eventbrite event with ID 123456789"
- "What categories of events are available on Eventbrite?"
- "Tell me about the venue with ID 987654321"

## 📚 Demo Videos & Documentation

### Demo Videos
- **Eventbrite MCP Credentials Setup**: [Watch Video](https://drive.google.com/file/d/1DKX2dLg-qJRlCSBmrebbw-Du8PSgLXqA/view?usp=sharing)
- **Eventbrite MCP Testing Demo**: [Watch Video](https://drive.google.com/file/d/1H7RICV2bEndzrTmQECEGN4OyNmNAaex9/view?usp=sharing)

### Comprehensive Documentation
For detailed documentation, please refer to:
- **📋 Server Features**: [EVENTBRITE-MCP Documentation](../../../mcp_servers_documentation/EVENTBRITE-MCP/server_features.md)
- **🔐 Credentials Setup**: [Setup Guide](../../../mcp_servers_documentation/EVENTBRITE-MCP/credentials.md)
- **🎥 Demo Videos**: [Video Examples](../../../mcp_servers_documentation/EVENTBRITE-MCP/demo_videos.md)

### API Credentials
This server requires Eventbrite API credentials:
- **API Key**: Primary authentication for API requests
- **Organization ID**: For organization-specific operations
- **Bearer Token**: For authenticated API access

---
