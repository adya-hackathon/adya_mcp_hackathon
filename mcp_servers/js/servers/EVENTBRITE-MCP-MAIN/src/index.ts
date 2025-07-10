#!/usr/bin/env node

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

// Load .env file from the project root
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env") });

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosInstance } from "axios";

// Get the API key from environment variables or use working default
const API_KEY = process.env.EVENTBRITE_API_KEY || "NUYEGTUZJIAFB4DA32DB";

if (!API_KEY) {
  console.error("Error: EVENTBRITE_API_KEY environment variable is required");
  console.error("");
  console.error("To use this tool, run it with your Eventbrite API key:");
  console.error(
    "EVENTBRITE_API_KEY=your-api-key npx @ibraheem4/eventbrite-mcp"
  );
  console.error("");
  console.error("Or set it in your environment:");
  console.error("export EVENTBRITE_API_KEY=your-api-key");
  console.error("npx @ibraheem4/eventbrite-mcp");
  process.exit(1);
}

// Eventbrite API interfaces
interface EventbriteEvent {
  id: string;
  name: {
    text: string;
    html: string;
  };
  description?: {
    text: string;
    html: string;
  };
  url: string;
  start: {
    timezone: string;
    local: string;
    utc: string;
  };
  end: {
    timezone: string;
    local: string;
    utc: string;
  };
  venue_id?: string;
  venue?: {
    id: string;
    name: string;
    address: {
      address_1: string;
      address_2?: string;
      city: string;
      region?: string;
      postal_code: string;
      country: string;
    };
  };
  capacity?: number;
  category_id?: string;
  is_free: boolean;
  logo_id?: string;
  logo?: {
    url: string;
  };
}

interface EventbriteVenue {
  id: string;
  name: string;
  address: {
    address_1: string;
    address_2?: string;
    city: string;
    region?: string;
    postal_code: string;
    country: string;
  };
  capacity?: number;
}

interface EventbriteCategory {
  id: string;
  name: string;
  short_name?: string;
}

interface SearchEventsParams {
  q?: string;
  location?: {
    latitude: number;
    longitude: number;
    within?: string;
  };
  categories?: string[];
  start_date?: string;
  end_date?: string;
  price?: "free" | "paid";
  page?: number;
  page_size?: number;
}

// Create Eventbrite API client
class EventbriteApiClient {
  private client: AxiosInstance;
  private baseUrl = "https://www.eventbriteapi.com/v3";

  constructor(private apiKey: string) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Get user's organizations
   */
  async getOrganizations(): Promise<any[]> {
    try {
      const response = await this.client.get("/users/me/organizations/");
      return response.data.organizations;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description || error.message
          }`
        );
      }
      throw error;
    }
  }

  /**
   * List events by organization
   */
  async listEventsByOrganization(
    organizationId: string,
    params: SearchEventsParams = {}
  ): Promise<{ events: EventbriteEvent[]; pagination: any }> {
    try {
      const queryParams: Record<string, any> = {};

      if (params.q) {
        queryParams.q = params.q;
      }

      if (params.start_date) {
        queryParams.start_date = params.start_date;
      }

      if (params.end_date) {
        queryParams.end_date = params.end_date;
      }

      if (params.page) {
        queryParams.page = params.page;
      }

      if (params.page_size) {
        queryParams.page_size = params.page_size;
      }

      const response = await this.client.get(
        `/organizations/${organizationId}/events/`,
        {
          params: queryParams,
        }
      );
      return {
        events: response.data.events,
        pagination: response.data.pagination,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description || error.message
          }`
        );
      }
      throw error;
    }
  }

  /**
   * Search for events (using organization events as a replacement for the deprecated search API)
   */
  async searchEvents(
    params: SearchEventsParams
  ): Promise<{ events: EventbriteEvent[]; pagination: any }> {
    try {
      // Get the user's organizations
      const organizations = await this.getOrganizations();

      if (!organizations || organizations.length === 0) {
        return { events: [], pagination: { page_count: 0 } };
      }

      // Use the first organization to list events
      const organizationId = organizations[0].id;

      return await this.listEventsByOrganization(organizationId, params);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description || error.message
          }`
        );
      }
      throw error;
    }
  }

  /**
   * Get event details by ID
   */
  async getEvent(eventId: string): Promise<EventbriteEvent> {
    try {
      const response = await this.client.get(`/events/${eventId}/`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description || error.message
          }`
        );
      }
      throw error;
    }
  }

  /**
   * Get venue details by ID
   */
  async getVenue(venueId: string): Promise<EventbriteVenue> {
    try {
      const response = await this.client.get(`/venues/${venueId}/`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description || error.message
          }`
        );
      }
      throw error;
    }
  }

  /**
   * Get categories
   */
  async getCategories(): Promise<EventbriteCategory[]> {
    try {
      const response = await this.client.get("/categories/");
      return response.data.categories;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorDetails = {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          url: error.config?.url,
          method: error.config?.method,
          authHeader: error.config?.headers?.Authorization
        };
        console.error('Eventbrite API Error Details:', JSON.stringify(errorDetails, null, 2));
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description ||
            error.response?.data?.error ||
            error.message
          } (Status: ${error.response?.status})`
        );
      }
      throw error;
    }
  }

  /**
   * Get attendees summary for an event (read-only)
   */
  async getEventAttendeesSummary(eventId: string): Promise<any> {
    try {
      // Try the summary endpoint first
      const response = await this.client.get(`/events/${eventId}/attendees/summary/`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorDetails = {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method,
        };
        console.error('Eventbrite Attendees Summary API Error Details:', JSON.stringify(errorDetails, null, 2));
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description ||
            error.response?.data?.error ||
            error.message
          } (Status: ${error.response?.status})`
        );
      }
      throw error;
    }
  }

  /**
   * Get ticket classes for an event
   */
  async getEventTicketClasses(eventId: string): Promise<any[]> {
    try {
      const response = await this.client.get(
        `/events/${eventId}/ticket_classes/`
      );
      return response.data.ticket_classes;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description || error.message
          }`
        );
      }
      throw error;
    }
  }

  /**
   * Get orders for an event (read-only)
   */
  async getEventOrders(eventId: string, status?: string): Promise<any> {
    try {
      const params: any = {};
      if (status) params.status = status;

      const response = await this.client.get(
        `/events/${eventId}/orders/`,
        {
          params,
        }
      );
      return {
        orders: response.data.orders,
        pagination: response.data.pagination,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description || error.message
          }`
        );
      }
      throw error;
    }
  }

  /**
   * Get enhanced organization events with better filtering
   */
  async getOrganizationEvents(
    organizationId: string,
    params: any = {}
  ): Promise<any> {
    try {
      const queryParams: Record<string, any> = {
        expand: "venue,ticket_classes,category",
        ...params,
      };

      const response = await this.client.get(
        `/organizations/${organizationId}/events/`,
        { params: queryParams }
      );
      return {
        events: response.data.events,
        pagination: response.data.pagination,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description || error.message
          }`
        );
      }
      throw error;
    }
  }

  /**
   * Get discount codes for an event
   */
  async getEventDiscounts(eventId: string): Promise<any[]> {
    try {
      const response = await this.client.get(`/events/${eventId}/discounts/`);
      return response.data.discounts;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description || error.message
          }`
        );
      }
      throw error;
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<any> {
    try {
      const response = await this.client.get("/users/me/");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Eventbrite API error: ${
            error.response?.data?.error_description || error.message
          }`
        );
      }
      throw error;
    }
  }
}

// Initialize the Eventbrite API client
const eventbriteClient = new EventbriteApiClient(API_KEY);

// Create the MCP server
const server = new Server(
  {
    name: "eventbrite-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {
        eventbrite_event: true,
      },
      tools: {
        search_events: true,
        get_event: true,
        get_categories: true,
        get_venue: true,
        get_event_attendees_summary: true,
        get_event_ticket_classes: true,
        get_event_orders: true,
        get_organization_events: true,
        get_event_discounts: true,
        get_user_profile: true,
      },
    },
  }
);

// Set up resource handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [],
}));

server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
  resourceTemplates: [
    {
      uriTemplate: "eventbrite://events/{eventId}",
      name: "Event details",
      mimeType: "application/json",
      description: "Get detailed information about a specific Eventbrite event",
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request: any) => {
  const eventMatch = request.params.uri.match(
    /^eventbrite:\/\/events\/([^/]+)$/
  );

  if (eventMatch) {
    const eventId = eventMatch[1];
    try {
      const event = await eventbriteClient.getEvent(eventId);

      // If the event has a venue_id but no venue data, fetch the venue
      if (event.venue_id && !event.venue) {
        try {
          event.venue = await eventbriteClient.getVenue(event.venue_id);
        } catch (error) {
          console.error(`Failed to fetch venue: ${error}`);
          // Continue without venue data
        }
      }

      return {
        contents: [
          {
            uri: request.params.uri,
            mimeType: "application/json",
            text: JSON.stringify(event, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to fetch event: ${error}`
      );
    }
  }

  throw new McpError(
    ErrorCode.InvalidRequest,
    `Invalid URI format: ${request.params.uri}`
  );
});

// Set up tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "search_events",
      description: "Search for Eventbrite events based on various criteria",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query for events",
          },
          location: {
            type: "object",
            properties: {
              latitude: { type: "number" },
              longitude: { type: "number" },
              within: {
                type: "string",
                description: "Distance (e.g., '10km', '10mi')",
              },
            },
            required: ["latitude", "longitude"],
          },
          categories: {
            type: "array",
            items: { type: "string" },
            description: "Category IDs to filter by",
          },
          start_date: {
            type: "string",
            description:
              "Start date in ISO format (e.g., '2023-01-01T00:00:00Z')",
          },
          end_date: {
            type: "string",
            description:
              "End date in ISO format (e.g., '2023-12-31T23:59:59Z')",
          },
          price: {
            type: "string",
            enum: ["free", "paid"],
            description: "Filter by free or paid events",
          },
          page: {
            type: "number",
            description: "Page number for pagination",
          },
          page_size: {
            type: "number",
            description: "Number of results per page (max 100)",
          },
        },
      },
    },
    {
      name: "get_event",
      description: "Get detailed information about a specific Eventbrite event",
      inputSchema: {
        type: "object",
        properties: {
          event_id: {
            type: "string",
            description: "Eventbrite event ID",
          },
        },
        required: ["event_id"],
      },
    },
    {
      name: "get_categories",
      description: "Get a list of Eventbrite event categories",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "get_venue",
      description: "Get information about a specific Eventbrite venue",
      inputSchema: {
        type: "object",
        properties: {
          venue_id: {
            type: "string",
            description: "Eventbrite venue ID",
          },
        },
        required: ["venue_id"],
      },
    },
    {
      name: "get_event_attendees_summary",
      description: "Get attendee count and summary for an event",
      inputSchema: {
        type: "object",
        properties: {
          event_id: {
            type: "string",
            description: "Eventbrite event ID",
          },
        },
        required: ["event_id"],
      },
    },
    {
      name: "get_event_ticket_classes",
      description: "Get ticket classes/types for an event",
      inputSchema: {
        type: "object",
        properties: {
          event_id: {
            type: "string",
            description: "Eventbrite event ID",
          },
        },
        required: ["event_id"],
      },
    },
    {
      name: "get_event_orders",
      description: "Get orders for an event",
      inputSchema: {
        type: "object",
        properties: {
          event_id: {
            type: "string",
            description: "Eventbrite event ID",
          },
          status: {
            type: "string",
            enum: ["placed", "refunded", "cancelled", "deleted"],
            description: "Filter orders by status",
          },
        },
        required: ["event_id"],
      },
    },
    {
      name: "get_organization_events",
      description: "Get enhanced list of organization events with expanded details",
      inputSchema: {
        type: "object",
        properties: {
          organization_id: {
            type: "string",
            description: "Organization ID (leave empty to use first organization)",
          },
          status: {
            type: "string",
            enum: ["live", "draft", "canceled", "ended"],
            description: "Filter events by status",
          },
          time_filter: {
            type: "string",
            enum: ["current_future", "past"],
            description: "Filter by time",
          },
          page: {
            type: "number",
            description: "Page number",
          },
          page_size: {
            type: "number",
            description: "Results per page (max 100)",
          },
        },
      },
    },
    {
      name: "get_event_discounts",
      description: "Get discount codes for an event",
      inputSchema: {
        type: "object",
        properties: {
          event_id: {
            type: "string",
            description: "Eventbrite event ID",
          },
        },
        required: ["event_id"],
      },
    },
    {
      name: "get_user_profile",
      description: "Get your Eventbrite user profile and account information",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  ],
}));

type SearchEventsArgs = {
  query?: string;
  location?: {
    latitude: number;
    longitude: number;
    within?: string;
  };
  categories?: string[];
  start_date?: string;
  end_date?: string;
  price?: "free" | "paid";
  page?: number;
  page_size?: number;
};

type GetEventArgs = {
  event_id: string;
};

type GetVenueArgs = {
  venue_id: string;
};

type GetEventAttendeesSummaryArgs = {
  event_id: string;
};

type GetEventTicketClassesArgs = {
  event_id: string;
};

type GetEventOrdersArgs = {
  event_id: string;
  status?: string;
};

type GetOrganizationEventsArgs = {
  organization_id?: string;
  status?: string;
  time_filter?: string;
  page?: number;
  page_size?: number;
};

type GetEventDiscountsArgs = {
  event_id: string;
};

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case "search_events": {
        const args = request.params.arguments as unknown as SearchEventsArgs;
        const params: SearchEventsParams = {};

        if (args.query) params.q = args.query;
        if (args.location) params.location = args.location;
        if (args.categories) params.categories = args.categories;
        if (args.start_date) params.start_date = args.start_date;
        if (args.end_date) params.end_date = args.end_date;
        if (args.price) params.price = args.price;
        if (args.page) params.page = args.page;
        if (args.page_size) params.page_size = args.page_size;

        const result = await eventbriteClient.searchEvents(params);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_event": {
        const args = request.params.arguments as unknown as GetEventArgs;
        if (!args?.event_id) {
          throw new Error("Event ID is required");
        }

        const event = await eventbriteClient.getEvent(args.event_id);

        // If the event has a venue_id but no venue data, fetch the venue
        if (event.venue_id && !event.venue) {
          try {
            event.venue = await eventbriteClient.getVenue(event.venue_id);
          } catch (error) {
            console.error(`Failed to fetch venue: ${error}`);
            // Continue without venue data
          }
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(event, null, 2),
            },
          ],
        };
      }

      case "get_categories": {
        const categories = await eventbriteClient.getCategories();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(categories, null, 2),
            },
          ],
        };
      }

      case "get_venue": {
        const args = request.params.arguments as unknown as GetVenueArgs;
        if (!args?.venue_id) {
          throw new Error("Venue ID is required");
        }

        const venue = await eventbriteClient.getVenue(args.venue_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(venue, null, 2),
            },
          ],
        };
      }

      case "get_event_attendees_summary": {
        const args = request.params.arguments as unknown as GetEventAttendeesSummaryArgs;
        if (!args?.event_id) {
          throw new Error("Event ID is required");
        }

        const summary = await eventbriteClient.getEventAttendeesSummary(args.event_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      }

      case "get_event_ticket_classes": {
        const args = request.params.arguments as unknown as GetEventTicketClassesArgs;
        if (!args?.event_id) {
          throw new Error("Event ID is required");
        }

        const ticketClasses = await eventbriteClient.getEventTicketClasses(args.event_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(ticketClasses, null, 2),
            },
          ],
        };
      }

      case "get_event_orders": {
        const args = request.params.arguments as unknown as GetEventOrdersArgs;
        if (!args?.event_id) {
          throw new Error("Event ID is required");
        }

        const orders = await eventbriteClient.getEventOrders(args.event_id, args.status);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(orders, null, 2),
            },
          ],
        };
      }

      case "get_organization_events": {
        const args = request.params.arguments as unknown as GetOrganizationEventsArgs;
        
        let organizationId = args.organization_id;
        if (!organizationId) {
          // Get first organization if not specified
          const organizations = await eventbriteClient.getOrganizations();
          if (!organizations || organizations.length === 0) {
            throw new Error("No organizations found");
          }
          organizationId = organizations[0].id;
        }

        const params: any = {};
        if (args.status) params.status = args.status;
        if (args.time_filter) params.time_filter = args.time_filter;
        if (args.page) params.page = args.page;
        if (args.page_size) params.page_size = args.page_size;

        const events = await eventbriteClient.getOrganizationEvents(organizationId!, params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(events, null, 2),
            },
          ],
        };
      }

      case "get_event_discounts": {
        const args = request.params.arguments as unknown as GetEventDiscountsArgs;
        if (!args?.event_id) {
          throw new Error("Event ID is required");
        }

        const discounts = await eventbriteClient.getEventDiscounts(args.event_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(discounts, null, 2),
            },
          ],
        };
      }

      case "get_user_profile": {
        const profile = await eventbriteClient.getUserProfile();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(profile, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
    }
  } catch (error: any) {
    console.error("Eventbrite API Error:", error);
    return {
      content: [
        {
          type: "text",
          text: `Eventbrite API error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Eventbrite MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
