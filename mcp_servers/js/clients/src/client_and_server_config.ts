export const ClientsConfig:any = [
    "MCP_CLIENT_OPENAI",
    "MCP_CLIENT_AZURE_AI",
    "MCP_CLIENT_GEMINI",
    // "CLAUDE",
]

export const ServersConfig:any = [
    {
        server_name :"WORDPRESS",
        server_features_and_capability:`WORDPRESS`,
        path : "build/index.js"
    },
    {
        server_name :"ASSET_MANAGEMENT",
        server_features_and_capability:`ASSET_MANAGEMENT`,
        path : "start-server.js"
    },
    {
        server_name :"ANALYSIS",
        server_features_and_capability:`ANALYSIS`,
        path : "start-server.js"
    },
    {
        server_name :"ENVIRONMENT_CONFIG",
        server_features_and_capability:`ENVIRONMENT_CONFIG`,
        path : "start-server.js"
    },
    {
        server_name :"STRUCTURED_METADATA",
        server_features_and_capability:`STRUCTURED_METADATA`,
        path : "start-server.js"
    },
    // {
    //     server_name :"WORDPRESS",
    //     server_features_and_capability:`WORDPRESS`,
    //     path : "build/index.js"
    // }
]

