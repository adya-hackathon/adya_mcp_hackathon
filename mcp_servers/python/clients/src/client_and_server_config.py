ClientsConfig =[
    "MCP_CLIENT_AZURE_AI",
    "MCP_CLIENT_OPENAI",
	"MCP_CLIENT_GEMINI"
]
ServersConfig = [
	{
		"server_name": "MCP-GSUITE",
		"command":"uv",
		"args": [
			"--directory",
			"../servers/MCP-GSUITE/mcp-gsuite",
			"run",
			"mcp-gsuite"
		]
	},
	{
		"server_name": "MCP-JOOMLA",
		"command":"uv",
		"args": [
			"--directory",
			"../servers/MCP-JOOMLA/mcp-joomla",
			"run",
			"mcp-joomla"
		]
	},
	{
		"server_name": "FEDORA-MCP-SERVER",
		"command": "uv",
		"args": [
			"--directory",
			"../servers/FEDORA-MCP-SERVER",
			"run",
			"cli-mcp-server"
		],
		"env": {
			"ALLOWED_DIR": "D:\\Users 2.o\\PY charm\\adya_hackathon\\test_mcp_directory",
			"ALLOWED_COMMANDS": "ls,cat,pwd,echo,find,grep,stat,mkdir,df,free,uname,head,tail,sed",
			"ALLOWED_FLAGS": "-l,-a,--help,--version,-h,-r,-n,-p,-maxdepth,-name,-type,-f",
			"MAX_COMMAND_LENGTH": "2048",
			"COMMAND_TIMEOUT": "60",
			"ALLOW_SHELL_OPERATORS": "true",
			"WSL_DISTRO": "FedoraLinux-42"
		}
	},
	{
		"server_name": "MOBILE-MCP-MAIN",
		"command": "node",
		"args": [
			"../../js/servers/MOBILE-MCP-MAIN/lib/index.js"
		]
	},
	{
		"server_name": "EVENTBRITE-MCP-MAIN",
		"command": "node",
		"args": [
			"../../js/servers/EVENTBRITE-MCP-MAIN/build/index.js"
		],
		"env": {
			"EVENTBRITE_API_KEY": "NUYEGTUZJIAFB4DA32DB"
		}
	}
]