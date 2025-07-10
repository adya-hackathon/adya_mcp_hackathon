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
        server_name :"MOBILE_MCP",
        server_features_and_capability:`Mobile device automation and testing`,
        path : "lib/index.js"
    },
    {
        server_name :"EVENTBRITE_MCP",
        server_features_and_capability:`Eventbrite API integration for event management`,
        path : "build/index.js"
    }
]

