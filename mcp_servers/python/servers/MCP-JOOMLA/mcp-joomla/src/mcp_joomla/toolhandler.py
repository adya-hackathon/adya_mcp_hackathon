from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource

class ToolHandler:
    def __init__(self, tool_name: str):
        self.name = tool_name

    def get_tool_description(self) -> Tool:
        raise NotImplementedError()

    def run_tool(self, args: dict) -> list[TextContent | ImageContent | EmbeddedResource]:
        raise NotImplementedError() 