import os
import asyncio
import warnings
from typing import Dict, Any

from contextlib import AsyncExitStack
from src.client_and_server_config import ServersConfig
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp import ClientSession, StdioServerParameters

# Suppress warnings about unclosed transports
warnings.filterwarnings("ignore", category=ResourceWarning, message="unclosed transport .*")


# Suppress specific ResourceWarning related to unclosed transport
warnings.filterwarnings("ignore", category=ResourceWarning, message="unclosed transport .*")

# Global session store
MCPServers: Dict[str, ClientSession] = {}


async def initialize_all_mcp(exit_stack):
    """Initialize all MCP clients based on server configuration"""
    if exit_stack is None:
        exit_stack = AsyncExitStack()
        await exit_stack.__aenter__()

    for server in ServersConfig:
        try:
            print(f"\n================= Initializing {server['server_name']} mcp server start ===============")
            print(f"Server name        : {server['server_name']}")
            print(f"Server command     : {server['command']}")
            print(f"Server args        : {server['args']}")
            print(f"cwd                : {os.getcwd()}")

            # Optional directory existence check
            if "--directory" in server["args"]:
                dir_index = server["args"].index("--directory")
                if dir_index + 1 < len(server["args"]):
                    relative_path = server["args"][dir_index + 1]
                    absolute_path = os.path.abspath(relative_path)
                    print(f"Relative path      : {relative_path}")
                    print(f"Absolute path      : {absolute_path}")
                    print(f"Path exists        : {os.path.exists(absolute_path)}")

            # Start stdio client
            # Prepare environment variables if specified
            env_vars = server.get("env", {})
            if env_vars:
                # Merge with current environment
                merged_env = {**os.environ, **env_vars}
                server_params = StdioServerParameters(command=server["command"], args=server["args"], env=merged_env)
                print(f"Environment vars   : {env_vars}")
            else:
                server_params = StdioServerParameters(command=server["command"], args=server["args"])

            stdio_transport = await exit_stack.enter_async_context(stdio_client(server_params))
            stdio, write = stdio_transport

            session = await exit_stack.enter_async_context(ClientSession(stdio, write))
            await session.initialize()


            # Save session globally
            MCPServers[server["server_name"]] = session

            # Confirm connection
            tools_response = await session.list_tools()
            tool_names = [tool.name for tool in tools_response.tools]
            print(f"Connected to {server['server_name']} with tools: {tool_names}")
            print(f"\n================= Initializing {server['server_name']} mcp server end ===============")

        except Exception as err:
            print(f"Error initializing {server['server_name']} mcp server =========>>>> {err}")
            continue

    return True