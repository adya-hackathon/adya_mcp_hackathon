# Asset Management MCP Migration Task List

This checklist will guide the migration of the Asset Management MCP server into the adya_mcp_hackathon repo, following the required structure and credential handling conventions.

---

## 1. Prepare Directory Structure
- [x] Create `adya_mcp_hackathon/mcp_servers/js/servers/ASSET_MANAGEMENT/`.
- [x] Copy all relevant code from `asset-management-js/src/` to `src/` in the new directory.
- [x] Copy and adapt `package.json`, `README.md`, and `LICENSE` from the original repo.

## 2. Adapt Entry Point
- [x] Ensure the main server entry point is `src/index.ts` (or equivalent), matching hackathon conventions.
- [x] Update any internal paths or imports to reflect the new directory structure.

## 3. Credential Handling
- [x] Update the server code to accept credentials in the hackathon JSON format:
  ```json
  {
    "ASSET_MANAGEMENT": {
      "cloudName": "your-cloud-name",
      "apiKey": "your-api-key",
      "apiSecret": "your-api-secret"
    }
  }
  ```
- [x] Ensure the server reads credentials from the expected config or environment variable.
- [x] Document this format in `mcp_servers_documentation/ASSET_MANAGEMENT/credentials.md`.

## 4. Client Integration
- [x] Update the client config (`client_and_server_config.ts`) to include the new server.
- [x] Ensure the client can pass credentials in the correct format to the server.

## 5. Documentation
- [x] Add `credentials.md` in `mcp_servers_documentation/ASSET_MANAGEMENT/` with the credential format and instructions.
- [x] Add `server_features.md` and `demo_videos.md` in the same documentation folder.
- [x] Update `README.md` for the new server to reflect its usage and integration.

## 6. Testing
- [ ] Test the server standalone to ensure it works as expected.
- [ ] Test integration with the hackathon client.
- [ ] Add or update Postman collections if needed for API validation.

## 7. Dependencies & Scripts
- [ ] Ensure all dependencies are listed in `package.json` in the new server directory.
- [ ] Remove or adapt any build scripts as needed for the new location.

---

## 8. Final Review
- [ ] Review the migration for consistency with other servers in the hackathon repo.
- [ ] Confirm that credential handling matches the documented pattern.
- [ ] Ensure all documentation is clear and complete.

---

**Use this checklist to track your progress as you migrate and integrate the Asset Management MCP server!** 