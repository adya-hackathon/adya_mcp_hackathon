#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);

// Start the MCP server without hardcoded credentials
// Credentials will be passed through the MCP client
const serverProcess = spawn('node', [
    path.join(scriptDir, 'bin/mcp-server.js'),
    'start'
], {
    stdio: ['inherit', 'inherit', 'inherit'],
    cwd: scriptDir
});

// Handle process events
serverProcess.on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

serverProcess.on('exit', (code) => {
    process.exit(code);
});

// Handle signals
process.on('SIGINT', () => {
    serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
    serverProcess.kill('SIGTERM');
}); 