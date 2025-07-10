from quart import Quart, request, jsonify, make_response, Response
import json
import asyncio
import sys
import os
import logging
import time
from typing import Optional, Dict, Any
import pandas as pd
from asyncio import Lock
from hypercorn.asyncio import serve
from hypercorn.config import Config
from contextlib import AsyncExitStack
from src.llm.azureopenai import azure_openai_processor
from src.server_connection import initialize_all_mcp, MCPServers
from src.client_and_server_validation import client_and_server_validation
from src.client_and_server_execution import client_and_server_execution
import logging


# Configure clean logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger('api')

app = Quart(__name__)

# Clean request logging middleware
@app.before_request
async def log_request_start():
    request.start_time = time.time()

# Clean response logging middleware
@app.after_request
async def log_request_complete(response):
    request_time = time.time() - request.start_time
    logger.info(f"{request.method} {request.path} - {response.status_code} - {request_time:.3f}s")
    return response

app.mcp_exit_stack = None
# Initialize the clients when the app starts
@app.before_serving
async def startup():
    try:
        app.mcp_exit_stack = AsyncExitStack()
        await app.mcp_exit_stack.__aenter__()
        print("\n✅ MCP servers initialization started.")
        success = await initialize_all_mcp(app.mcp_exit_stack)
        if success: 
            print(f"\nAvailable servers: {list(MCPServers.keys())}")
            print("\n✅ MCP servers initialized successfully.\n")
        else:
            print("\n❌ Failed to initialize MCP clients.")
        
    except Exception as err:
        print(f"Error initializing MCP clients =========>>>> {err}")


@app.route("/api/v1/mcp/process_message", methods=["POST"])
async def process_message():
    try:
        print("🌟 ===== NEW REQUEST RECEIVED =====")
        sys.stdout.flush()

        data = await request.get_json()
        print(f"🔍 DEBUG - Received request data keys: {list(data.keys()) if data else 'None'}")
        print(f"🔍 DEBUG - Selected servers: {data.get('selected_servers', 'None')}")
        print(f"🔍 DEBUG - Selected client: {data.get('selected_client', 'None')}")
        sys.stdout.flush()

        # Set streaming to false
        if "client_details" in data:
            data["client_details"]["is_stream"] = False

        # Validation check
        print(f"🔍 DEBUG - Starting validation...")
        sys.stdout.flush()
        validation_result = await client_and_server_validation(data, {"streamCallbacks": None, "is_stream": False})
        print(f"🔍 DEBUG - Validation status: {validation_result.get('status', 'Unknown')}")
        sys.stdout.flush()
        if not validation_result["status"]:
            print(f"❌ DEBUG - Validation failed: {validation_result['error']}")
            sys.stdout.flush()
            return jsonify({
                "Data": None,
                "Error": validation_result["error"],
                "Status": False
            }), 200
            
        print(f"\n✅ Validation Successful")
        sys.stdout.flush()
        # print(validation_result)
        print(f"\n✅ Execution Started")
        sys.stdout.flush()

        # Execution
        generated_payload = validation_result["payload"]
        execution_response = await client_and_server_execution(generated_payload, {"streamCallbacks": None, "is_stream": False})

        print(f"\n✅ Execution Completed")
        sys.stdout.flush()
        response_dict = {
            "Data": execution_response.Data,
            "Error": execution_response.Error,
            "Status": execution_response.Status
        }
        return jsonify(response_dict), 200
    
    except Exception as error:
        print(f"Error ========>>>>> {error}")
        sys.stdout.flush()
        return jsonify({
            "Data": None,
            "Error": str(error),
            "Status": False
        }), 500

@app.route("/debug/servers", methods=["GET"])
async def debug_servers():
    return {
        "available_servers": list(MCPServers.keys()),
        "server_count": len(MCPServers),
        "servers_detail": {name: {"tools": len(client.tools) if hasattr(client, 'tools') else 0} for name, client in MCPServers.items()}
    }

class CustomStreamHandler:
    def __init__(self, response_queue: asyncio.Queue):
        self.response_queue = response_queue
    
    async def on_data(self, chunk: str):
        """Send data chunk to the stream"""
        await self.response_queue.put(f"data: {chunk}\n\n")
    
    async def on_end(self):
        """Send completion message and end the stream"""
        completion_data = {
            "Data": None,
            "Error": None,
            "Status": True,
            "StreamingStatus": "COMPLETED",
            "Action": "NO-ACTION"
        }
        await self.response_queue.put(f"data: {json.dumps(completion_data)}\n\n")
        await self.response_queue.put(None)  # Signal end of stream
    
    async def on_error(self, error: Exception):
        """Send error message and end the stream"""
        print(f"Streaming Error: {error}")
        error_data = {"error": str(error)}
        await self.response_queue.put(f"data: {json.dumps(error_data)}\n\n")
        await self.response_queue.put(None)  # Signal end of stream

async def stream_generator(response_queue: asyncio.Queue):
    """Generator function for streaming responses"""
    while True:
        try:
            # Wait for data with a timeout to prevent hanging
            data = await asyncio.wait_for(response_queue.get(), timeout=30.0)
            if data is None:  # End of stream signal
                break
            yield data
        except asyncio.TimeoutError:
            # Send keepalive or break on timeout
            break
        except Exception as e:
            print(f"Stream generator error: {e}")
            break

@app.route('/api/v1/mcp/process_message_stream', methods=['POST'])
async def process_message_stream():
    # Create a queue for streaming responses
    response_queue = asyncio.Queue()
    custom_stream_handler = CustomStreamHandler(response_queue)
    
    try:
        # Get request data
        data = await request.get_json()
        if not data:
            data = {}
        
        # Modify client details
        if 'client_details' not in data:
            data['client_details'] = {}
        data['client_details']['is_stream'] = False
        
        # Start streaming response
        async def generate_response():
            try:
                # Send initial status
                start_data = {
                    "Data": None,
                    "Error": None,
                    "Status": True,
                    "StreamingStatus": "STARTED",
                    "Action": "NO-ACTION"
                }
                await custom_stream_handler.on_data(json.dumps(start_data))
                
                # =========================================== validation check start =============================================================
                validation_result = await client_and_server_validation(data, {"streamCallbacks": custom_stream_handler, "is_stream": True})
                
                if not validation_result.get('status', False):
                    error_data = {
                        "Data": None,
                        "Error": validation_result.get('error'),
                        "Status": False,
                        "StreamingStatus": "ERROR",
                        "Action": "ERROR"
                    }
                    await custom_stream_handler.on_data(json.dumps(error_data))
                    await custom_stream_handler.on_end()
                    return
                # =========================================== validation check end =============================================================
                
                # =========================================== execution start ====================================================================
                generated_payload = validation_result.get('payload')
                execution_response = await client_and_server_execution(generated_payload, {"streamCallbacks": custom_stream_handler, "is_stream": True})
                # =========================================== execution end ======================================================================
                print(f"\n✅ ------------------------" , execution_response.Data)
                if not execution_response.Status:
                    error_data = {
                        "Data": execution_response.Data,
                        "Error": execution_response.Error,
                        "Status": False,
                        "StreamingStatus": "ERROR",
                        "Action": "ERROR"
                    }
                    await custom_stream_handler.on_data(json.dumps(error_data))
                    await custom_stream_handler.on_end()
                    return
                
                # Send successful response
                success_data = {
                    "Data": execution_response.Data,
                    "Error": execution_response.Error,
                    "Status": execution_response.Status,
                    "StreamingStatus": "IN-PROGRESS",
                    "Action": "AI-RESPONSE"
                }
                await custom_stream_handler.on_data(json.dumps(success_data))
                await custom_stream_handler.on_end()
                
            except Exception as error:
                print(f"Error ========>>>>> {error}")
                error_data = {
                    "Data": None,
                    "Error": str(error),
                    "Status": False,
                    "StreamingStatus": "ERROR",
                    "Action": "ERROR"
                }
                await custom_stream_handler.on_data(json.dumps(error_data))
                await custom_stream_handler.on_end()
        
        # Start the response generation in the background
        asyncio.create_task(generate_response())
        
        # Return streaming response
        return Response(
            stream_generator(response_queue),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        )
        
    except Exception as error:
        print(f"Error ========>>>>> {error}")
        
        # Send error response immediately
        error_data = {
            "Data": None,
            "Error": str(error),
            "Status": False,
            "StreamingStatus": "ERROR",
            "Action": "ERROR"
        }
        
        async def error_generator():
            yield f"data: {json.dumps(error_data)}\n\n"
        
        return Response(
            error_generator(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        )


@app.after_serving
async def shutdown():
    if app.mcp_exit_stack:
        await app.mcp_exit_stack.__aexit__(None, None, None)
        app.mcp_exit_stack = None
        print("\n✅ MCP servers cleaned up on shutdown.\n")
    
if __name__ == "__main__":
    # Force output buffering off
    import sys
    sys.stdout.reconfigure(line_buffering=True)
    sys.stderr.reconfigure(line_buffering=True)

    print("🚀 STARTING MCP SERVER...")
    print("🔧 Forcing output buffering off...")

    # Create a config instance
    config = Config()
    # Configure bind address and port
    config.bind = [f"0.0.0.0:5001"]

    # Print welcome banner
    print("╔═══════════════════════════════════════════════════════════════════════════════════════════╗")
    print("║                                                                                           ║")
    print("║                                📈🚀✨ ADYA  📈🚀✨                                        ║")
    print("║                                                                                           ║")
    print("║  🎉 Welcome to the MCP(Model Context Protocol) Server Integration Hackathon 2k25 !! 🎉    ║")
    print("║                                                                                           ║")
    print("║  ✅ Server running on http://0.0.0.0:5001 ✅                                              ║")
    print("║                                                                                           ║") 
    print("╚═══════════════════════════════════════════════════════════════════════════════════════════╝")

    # Start the Quart app
    asyncio.run(serve(app, config))