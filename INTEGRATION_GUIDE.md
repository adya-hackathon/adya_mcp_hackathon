# adya_mcp_hackathon Repo Structure & Integration Guide

## 1. Top-Level Structure

The main folder is `adya_mcp_hackathon`, which contains all code, documentation, and resources for the hackathon project. The key subfolders are:

- `mcp_servers/`  
  Contains all MCP server and client code, organized by language and further by server/client roles.

- `mcp_servers_documentation/`  
  Contains documentation for each MCP server, including credentials, demo videos, and feature lists.

- `postman_api_collections/`  
  Postman collections for API testing.

- `README.md`  
  Main project documentation.

---

## 2. mcp_servers/ Directory

This is the core code directory, split by language:

### a. `js/` (JavaScript/TypeScript)

- `clients/`  
  - Contains the client code for interacting with MCP servers.
  - Structure:
    - `package.json`, `tsconfig.json`
    - `src/`  
      - `client_and_server_config.ts`
      - `client_and_server_execution.ts`
      - `client_and_server_validation.ts`
      - `llm/` (LLM integrations: `azure_openai.ts`, `gemini.ts`, etc.)

- `servers/`  
  - Contains JavaScript/TypeScript MCP server implementations.
  - Each server is in its own folder (e.g., `WORDPRESS/`).
    - Each server folder contains:
      - `LICENSE`
      - `package.json`
      - `README.md`
      - `src/` (server code, e.g., `index.ts`)

### b. `python/`

- `clients/`  
  - Python client code for interacting with MCP servers.
  - Structure:
    - `requirements.txt`
    - `run.py`
    - `src/`  
      - `client_and_server_config.py`
      - `client_and_server_execution.py`
      - `client_and_server_validation.py`
      - `llm/` (LLM integrations: `azureopenai.py`, `gemini.py`, `openai.py`)

- `servers/`  
  - Python MCP server implementations.
  - Each server is in its own folder (e.g., `MCP-GSUITE/`).
    - Each server folder contains:
      - OpenAPI specs (e.g., `gmail-api-openapi-spec.yaml`)
      - `src/` (server code, e.g., `mcp_gsuite/` with modules like `calendar.py`, `gauth.py`)

---

## 3. mcp_servers_documentation/

Documentation for each MCP server, organized by server name:

- `MCP-GSUITE/`, `WORDPRESS/`, `OTHER_MCP_SERVERS/`
  - `credentials.md`
  - `demo_videos.md`
  - `server_features.md`

---

## 4. postman_api_collections/

- `MCP.postman_collection.json`
- `MCP.postman_environment.json`

Used for API testing and validation.

---

## 5. Integration Flow: Adding a New MCP Server

### Step 1: Try Out the New MCP Server Individually

- Clone or set up the new MCP server in isolation.
- Ensure it works as intended and is self-contained.

### Step 2: Convert to adya_mcp_hackathon Structure

- Place the server code in the appropriate language directory:
  - For JS/TS: `adya_mcp_hackathon/mcp_servers/js/servers/NEW_SERVER_NAME/`
  - For Python: `adya_mcp_hackathon/mcp_servers/python/servers/NEW_SERVER_NAME/`
- Ensure the server folder contains:
  - `LICENSE`
  - `package.json` or `requirements.txt`
  - `README.md`
  - `src/` (all source code)
- Update or create OpenAPI specs if required.

### Step 3: Integrate with the Client

- The client code (in `clients/`) is designed to interact with any MCP server following the expected API contract.
- Update the client configuration to point to the new server's endpoint.
- Validate the integration using the client's execution and validation scripts.

### Step 4: Document the Server

- Add documentation in `mcp_servers_documentation/NEW_SERVER_NAME/`:
  - `credentials.md`: How to obtain and configure credentials.
  - `demo_videos.md`: Demo or walkthrough videos.
  - `server_features.md`: List of supported features.

### Step 5: Test with Postman

- Add or update Postman collections if the API surface changes.
- Use the collections in `postman_api_collections/` to validate endpoints.

---

## 6. Key Points for Integration

- **Consistency:** All servers must follow the same folder and file structure for easy integration and testing.
- **API Contract:** The client expects a certain API contract (usually RESTful, described by OpenAPI specs).
- **Documentation:** Each server must be well-documented for credentials, features, and usage.
- **Testing:** Use both the client code and Postman collections to ensure the server works as expected.

---

## 7. Example: WORDPRESS Server (JS)

- Located at: `adya_mcp_hackathon/mcp_servers/js/servers/WORDPRESS/`
- Contains:
  - `LICENSE`
  - `package.json`
  - `README.md`
  - `src/index.ts`
- Documented at: `adya_mcp_hackathon/mcp_servers_documentation/WORDPRESS/`

---

## 8. Example: MCP-GSUITE Server (Python)

- Located at: `adya_mcp_hackathon/mcp_servers/python/servers/MCP-GSUITE/mcp-gsuite/`
- Contains:
  - OpenAPI specs
  - `src/mcp_gsuite/` (Python modules)
- Documented at: `adya_mcp_hackathon/mcp_servers_documentation/MCP-GSUITE/`

---

## 9. Summary Table

| Component                  | Path Example                                                      | Purpose                                  |
|----------------------------|-------------------------------------------------------------------|------------------------------------------|
| JS Client                  | mcp_servers/js/clients/                                           | JS/TS client code                        |
| JS Server                  | mcp_servers/js/servers/WORDPRESS/                                 | JS/TS server code                        |
| Python Client              | mcp_servers/python/clients/                                       | Python client code                       |
| Python Server              | mcp_servers/python/servers/MCP-GSUITE/mcp-gsuite/                 | Python server code                       |
| Server Documentation       | mcp_servers_documentation/WORDPRESS/                              | Server-specific docs                     |
| Postman Collections        | postman_api_collections/                                          | API testing                              |

---

## 10. Integration Checklist

- [ ] Place server code in correct language/server directory.
- [ ] Ensure folder structure matches existing servers.
- [ ] Provide all required files (`LICENSE`, `README.md`, config, `src/`).
- [ ] Update/add OpenAPI specs if needed.
- [ ] Update client config to point to new server.
- [ ] Add documentation in `mcp_servers_documentation/`.
- [ ] Test with client and Postman.
- [ ] Ensure all dependencies are listed in `package.json` or `requirements.txt`.

---

## 11. Next Steps

With this understanding, the next step is to convert the asset management MCP to fit this structure, ensuring it can be integrated and tested with the existing client and documentation flow. 