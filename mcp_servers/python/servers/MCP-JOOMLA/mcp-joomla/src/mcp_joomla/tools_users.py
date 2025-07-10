from mcp.types import Tool, TextContent
from .toolhandler import ToolHandler
from .joomla_client import joomla_client
import json


class GetUsersToolHandler(ToolHandler):
    def __init__(self):
        super().__init__("get_joomla_users")

    def get_tool_description(self) -> Tool:
        return Tool(
            name=self.name,
            description="Retrieve user accounts and user information from the Joomla website. Use this tool specifically for getting user data, user lists, or user management information.",
            inputSchema={
                "type": "object",
                "properties": {
                    "base_url": {
                        "type": "string",
                        "description": "Joomla website base URL (e.g., https://example.com)"
                    },
                    "bearer_token": {
                        "type": "string",
                        "description": "Bearer token for Joomla API authentication"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Optional: Limit the number of users returned (default: 20)"
                    }
                },
                "required": ["base_url", "bearer_token"]
            }
        )

    async def run_tool(self, args: dict) -> list[TextContent]:
        base_url = args.get("base_url")
        bearer_token = args.get("bearer_token")
        limit = args.get("limit", 20)

        # Initialize client if not already done
        if not joomla_client.is_initialized():
            joomla_client.initialize(base_url, bearer_token)

        result = await joomla_client.get_users(limit)
        
        if result["success"]:
            return [TextContent(type="text", text=result["data"])]
        else:
            return [TextContent(type="text", text=result["error"])]


class GetUserByIdToolHandler(ToolHandler):
    def __init__(self):
        super().__init__("get_user_by_id")

    def get_tool_description(self) -> Tool:
        return Tool(
            name=self.name,
            description="Retrieve a specific user by their ID from the Joomla website.",
            inputSchema={
                "type": "object",
                "properties": {
                    "base_url": {
                        "type": "string",
                        "description": "Joomla website base URL (e.g., https://example.com)"
                    },
                    "bearer_token": {
                        "type": "string",
                        "description": "Bearer token for Joomla API authentication"
                    },
                    "user_id": {
                        "type": "integer",
                        "description": "The ID of the user to retrieve"
                    }
                },
                "required": ["base_url", "bearer_token", "user_id"]
            }
        )

    async def run_tool(self, args: dict) -> list[TextContent]:
        base_url = args.get("base_url")
        bearer_token = args.get("bearer_token")
        user_id = args.get("user_id")

        # Initialize client if not already done
        if not joomla_client.is_initialized():
            joomla_client.initialize(base_url, bearer_token)

        # Validate user_id
        if not isinstance(user_id, int):
            return [TextContent(type="text", text="Error: User ID must be an integer.")]

        result = await joomla_client.get_user(user_id)
        
        if result["success"]:
            user_data = json.loads(result["data"])
            user_info = {
                "id": user_data.get("id"),
                "name": user_data.get("name"),
                "username": user_data.get("username"),
                "email": user_data.get("email"),
                "block": user_data.get("block"),
                "sendEmail": user_data.get("sendEmail"),
                "registerDate": user_data.get("registerDate"),
                "lastvisitDate": user_data.get("lastvisitDate"),
                "groups": user_data.get("groups", [])
            }
            return [TextContent(type="text", text=f"User Details:\n{json.dumps(user_info, indent=2)}")]
        else:
            return [TextContent(type="text", text=result["error"])]


class GetMenusToolHandler(ToolHandler):
    def __init__(self):
        super().__init__("get_joomla_menus")

    def get_tool_description(self) -> Tool:
        return Tool(
            name=self.name,
            description="Retrieve all menus and menu items from the Joomla website.",
            inputSchema={
                "type": "object",
                "properties": {
                    "base_url": {
                        "type": "string",
                        "description": "Joomla website base URL (e.g., https://example.com)"
                    },
                    "bearer_token": {
                        "type": "string",
                        "description": "Bearer token for Joomla API authentication"
                    },
                    "menu_type": {
                        "type": "string",
                        "description": "Optional: Specific menu type to retrieve (e.g., 'mainmenu')"
                    }
                },
                "required": ["base_url", "bearer_token"]
            }
        )

    async def run_tool(self, args: dict) -> list[TextContent]:
        base_url = args.get("base_url")
        bearer_token = args.get("bearer_token")
        menu_type = args.get("menu_type")

        # Initialize client if not already done
        if not joomla_client.is_initialized():
            joomla_client.initialize(base_url, bearer_token)

        result = await joomla_client.get_menus(menu_type)
        
        if result["success"]:
            return [TextContent(type="text", text=result["data"])]
        else:
            return [TextContent(type="text", text=result["error"])]


class GetSiteInfoToolHandler(ToolHandler):
    def __init__(self):
        super().__init__("get_site_info")

    def get_tool_description(self) -> Tool:
        return Tool(
            name=self.name,
            description="Retrieve general site information and configuration from the Joomla website.",
            inputSchema={
                "type": "object",
                "properties": {
                    "base_url": {
                        "type": "string",
                        "description": "Joomla website base URL (e.g., https://example.com)"
                    },
                    "bearer_token": {
                        "type": "string",
                        "description": "Bearer token for Joomla API authentication"
                    }
                },
                "required": ["base_url", "bearer_token"]
            }
        )

    async def run_tool(self, args: dict) -> list[TextContent]:
        base_url = args.get("base_url")
        bearer_token = args.get("bearer_token")

        # Initialize client if not already done
        if not joomla_client.is_initialized():
            joomla_client.initialize(base_url, bearer_token)

        result = await joomla_client.get_site_info()
        
        if result["success"]:
            return [TextContent(type="text", text=result["data"])]
        else:
            return [TextContent(type="text", text=result["error"])]
