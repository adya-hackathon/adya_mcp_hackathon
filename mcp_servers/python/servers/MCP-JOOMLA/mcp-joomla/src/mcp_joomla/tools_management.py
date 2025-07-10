from mcp.types import Tool, TextContent
from .toolhandler import ToolHandler
from .joomla_client import joomla_client

class ManageArticleStateToolHandler(ToolHandler):
    def __init__(self):
        super().__init__("manage_article_state")

    def get_tool_description(self) -> Tool:
        return Tool(
            name=self.name,
            description="Manage the state of an existing article on the Joomla website (published, unpublished, archived, trashed)",
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
                    "article_id": {
                        "type": "integer",
                        "description": "The ID of the existing article to check and update"
                    },
                    "target_state": {
                        "type": "integer",
                        "description": "The desired state for the article (1=published, 0=unpublished, 2=archived, -2=trashed)"
                    }
                },
                "required": ["base_url", "bearer_token", "article_id", "target_state"]
            }
        )

    async def run_tool(self, args: dict) -> list[TextContent]:
        base_url = args.get("base_url")
        bearer_token = args.get("bearer_token")
        article_id = args.get("article_id")
        target_state = args.get("target_state")

        # Initialize client if not already done
        if not joomla_client.is_initialized():
            joomla_client.initialize(base_url, bearer_token)

        # Validate inputs
        if not isinstance(article_id, int):
            return [TextContent(type="text", text="Error: Article ID must be an integer.")]

        valid_states = {1, 0, 2, -2}
        if target_state not in valid_states:
            return [TextContent(type="text", text=f"Error: Invalid target state {target_state}. Valid states are 1 (published), 0 (unpublished), 2 (archived), -2 (trashed).")]

        # Get current article state
        article_result = await joomla_client.get_article(article_id)
        if not article_result["success"]:
            return [TextContent(type="text", text=article_result["error"])]

        article_data = article_result["data"].get("data", {}).get("attributes", {})
        current_state = article_data.get("state", 0)
        title = article_data.get("title", "Unknown")

        state_map = {1: "published", 0: "unpublished", 2: "archived", -2: "trashed"}
        current_state_name = state_map.get(current_state, "unknown")
        target_state_name = state_map.get(target_state, "unknown")

        if current_state == target_state:
            return [TextContent(type="text", text=f"Article '{title}' (ID: {article_id}) is already in {current_state_name} state.")]

        # Update article state
        payload = {"state": target_state}
        result = await joomla_client.update_article(article_id, payload)
        
        if result["success"]:
            return [TextContent(type="text", text=f"Successfully updated article '{title}' (ID: {article_id}) from {current_state_name} to {target_state_name} state.")]
        else:
            return [TextContent(type="text", text=result["error"])]


class MoveArticleToTrashToolHandler(ToolHandler):
    def __init__(self):
        super().__init__("move_article_to_trash")

    def get_tool_description(self) -> Tool:
        return Tool(
            name=self.name,
            description="Delete an article by moving to the trashed state on the Joomla website, allowing recovery.",
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
                    "article_id": {
                        "type": "integer",
                        "description": "The ID of the article to move to trash"
                    },
                    "expected_title": {
                        "type": "string",
                        "description": "Optional title to verify the correct article (case-insensitive partial match)"
                    }
                },
                "required": ["base_url", "bearer_token", "article_id"]
            }
        )

    async def run_tool(self, args: dict) -> list[TextContent]:
        base_url = args.get("base_url")
        bearer_token = args.get("bearer_token")
        article_id = args.get("article_id")
        expected_title = args.get("expected_title")

        # Initialize client if not already done
        if not joomla_client.is_initialized():
            joomla_client.initialize(base_url, bearer_token)

        # Validate inputs
        if not isinstance(article_id, int):
            return [TextContent(type="text", text="Error: Article ID must be an integer.")]

        # Get article details
        article_result = await joomla_client.get_article(article_id)
        if not article_result["success"]:
            return [TextContent(type="text", text=article_result["error"])]

        article_data = article_result["data"].get("data", {}).get("attributes", {})
        title = article_data.get("title", "Unknown")
        current_state = article_data.get("state", 0)

        # Verify title if provided
        if expected_title:
            if not title.lower().find(expected_title.lower()) >= 0:
                return [TextContent(type="text", text=f"Error: Article ID {article_id} has title '{title}', which does not match expected title '{expected_title}'.")]

        # Check if already trashed
        if current_state == -2:
            return [TextContent(type="text", text=f"Article '{title}' (ID: {article_id}) is already in trashed state.")]

        # Move to trash
        payload = {"state": -2}
        result = await joomla_client.update_article(article_id, payload)
        
        if result["success"]:
            return [TextContent(type="text", text=f"Successfully moved article '{title}' (ID: {article_id}) to trash.")]
        else:
            return [TextContent(type="text", text=result["error"])]


class UpdateArticleToolHandler(ToolHandler):
    def __init__(self):
        super().__init__("update_article")

    def get_tool_description(self) -> Tool:
        return Tool(
            name=self.name,
            description="Update an existing article on the Joomla website.",
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
                    "article_id": {
                        "type": "integer",
                        "description": "The ID of the article to update"
                    },
                    "title": {
                        "type": "string",
                        "description": "New title for the article"
                    },
                    "introtext": {
                        "type": "string",
                        "description": "Introductory text (requires fulltext if provided)"
                    },
                    "fulltext": {
                        "type": "string",
                        "description": "Full content for the article (plain text or HTML)"
                    },
                    "metadesc": {
                        "type": "string",
                        "description": "Meta description for the article"
                    },
                    "convert_plain_text": {
                        "type": "boolean",
                        "description": "Whether to auto-convert plain text to HTML",
                        "default": True
                    }
                },
                "required": ["base_url", "bearer_token", "article_id"]
            }
        )

    async def run_tool(self, args: dict) -> list[TextContent]:
        base_url = args.get("base_url")
        bearer_token = args.get("bearer_token")
        article_id = args.get("article_id")
        title = args.get("title")
        introtext = args.get("introtext")
        fulltext = args.get("fulltext")
        metadesc = args.get("metadesc")
        convert_plain_text = args.get("convert_plain_text", True)

        # Initialize client if not already done
        if not joomla_client.is_initialized():
            joomla_client.initialize(base_url, bearer_token)

        # Validate inputs
        if not isinstance(article_id, int):
            return [TextContent(type="text", text="Error: Article ID must be an integer.")]

        if not any([title, introtext, fulltext, metadesc]):
            return [TextContent(type="text", text="Error: At least one of title, introtext, fulltext, or metadesc must be provided.")]

        # Get current article
        article_result = await joomla_client.get_article(article_id)
        if not article_result["success"]:
            return [TextContent(type="text", text=article_result["error"])]

        article_data = article_result["data"].get("data", {}).get("attributes", {})
        current_title = article_data.get("title", "Unknown")

        # Prepare payload
        payload = {}
        if title:
            payload["title"] = title
            payload["alias"] = joomla_client.generate_alias(title)
        if metadesc:
            payload["metadesc"] = metadesc
        if introtext:
            payload["introtext"] = (
                joomla_client.convert_text_to_html(introtext) if convert_plain_text else introtext
            )
            if fulltext:
                payload["fulltext"] = (
                    joomla_client.convert_text_to_html(fulltext) if convert_plain_text else fulltext
                )
        elif fulltext:
            payload["articletext"] = (
                joomla_client.convert_text_to_html(fulltext) if convert_plain_text else fulltext
            )

        # Update article loga
        result = await joomla_client.update_article(article_id, payload)
        
        if result["success"]:
            updated_fields = []
            if title:
                updated_fields.append(f"title to '{title}'")
            if introtext:
                updated_fields.append("introtext")
            if fulltext:
                updated_fields.append("fulltext" if introtext else "body")
            if metadesc:
                updated_fields.append("metadesc")
            
            return [TextContent(type="text", text=f"Successfully updated article '{current_title}' (ID: {article_id}) {', '.join(updated_fields)}.")]
        else:
            return [TextContent(type="text", text=result["error"])] 