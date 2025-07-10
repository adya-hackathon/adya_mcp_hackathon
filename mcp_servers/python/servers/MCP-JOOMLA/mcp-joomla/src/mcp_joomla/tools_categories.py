from mcp.types import Tool, TextContent
from .toolhandler import ToolHandler
from .joomla_client import joomla_client

class GetCategoriesToolHandler(ToolHandler):
    def __init__(self):
        super().__init__("get_joomla_categories")

    def get_tool_description(self) -> Tool:
        return Tool(
            name=self.name,
            description="Retrieve content categories and category structure from the Joomla website. Use this tool specifically for getting category data, category lists, or content organization information.",
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

        result = await joomla_client.get_categories()
        
        if result["success"]:
            categories = result["data"]
            if not categories:
                return [TextContent(type="text", text="No categories found.")]
            
            result_text = "Available categories:\n"
            for category in categories:
                attributes = category.get("attributes", {})
                category_id = attributes.get("id", "N/A")
                category_title = attributes.get("title", "N/A")
                result_text += f"- ID: {category_id}, Title: {category_title}\n"
            
            return [TextContent(type="text", text=result_text)]
        else:
            return [TextContent(type="text", text=result["error"])] 