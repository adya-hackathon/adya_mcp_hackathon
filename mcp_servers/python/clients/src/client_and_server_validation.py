from typing import Dict, Any, Callable, Optional

from src.server_connection import MCPServers
from src.client_and_server_config import ServersConfig, ClientsConfig


async def client_and_server_validation(payload: Dict[str, Any], streaming_callback: Optional[Callable] = None):
    try:
        selected_server_credentials = payload.get("selected_server_credentials")
        client_details = payload.get("client_details", {})
        selected_client = payload.get("selected_client", "")
        selected_servers = payload.get("selected_servers", [])

        # Debug logging
        print(f"DEBUG - selected_client: {selected_client}")
        print(f"DEBUG - selected_servers: {selected_servers}")
        print(f"DEBUG - selected_server_credentials: {selected_server_credentials}")
        print(f"DEBUG - client_details keys: {list(client_details.keys()) if client_details else None}")

        # Allow empty credentials for servers that don't require them (like CLI-MCP-SERVER)
        if not selected_client or not selected_servers or selected_server_credentials is None or not client_details:
            print("Invalid Request Payload")
            return {
                "payload": None,
                "error": "Invalid Request Payload",
                "status": False
            }

        for server in selected_servers:
            if server not in MCPServers:
                print("Invalid Server")
                return {
                    "payload": None,
                    "error": "Invalid Server",
                    "status": False
                }

        if selected_client not in ClientsConfig:
            print("Invalid Client")
            return {
                "payload": None,
                "error": "Invalid Client",
                "status": False
            }

        tools_arr = []
        for server in selected_servers:
   
            resource = await MCPServers[server].list_tools()
            if resource:
                for tool in resource.tools:
                    tool_dict = {
                        "type": "function",
                        "function": {
                            "name": tool.name,
                            "description": getattr(tool, "description", f"Tool for {tool.name}"),
                            "parameters": getattr(tool, "inputSchema", {
                                "type": "object",
                                "properties": {},
                                "required": []
                            })
                        }
                    }
                    tools_arr.append(tool_dict)

        client_details["tools"] = tools_arr


        return {
            "payload": {
                "selected_client": selected_client,
                "selected_servers": selected_servers,
                "selected_server_credentials": selected_server_credentials,
                "client_details": client_details
            },
            "error": None,
            "status": True
        }

    except Exception as err:
        print("Error initializing MCP ==========>>>>", err)
        return {
            "payload": None,
            "error": str(err),
            "status": False
        }
