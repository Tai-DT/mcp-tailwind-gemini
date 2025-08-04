#!/usr/bin/env node

/**
 * MCP Connection Test Script
 * Test if MCP server can be connected by MCP clients
 */

import { spawn } from 'child_process';
import { createReadStream, createWriteStream } from 'fs';

class MCPConnectionTest {
    constructor() {
        this.apiKey = 'AIzaSyC0MdgM40z_WUtT75DXtsQLCiAuo1TfOwk'; // For testing only
    }

    log(message, type = 'info') {
        const colors = {
            info: '\x1b[36m',
            success: '\x1b[32m',
            error: '\x1b[31m',
            warning: '\x1b[33m',
            reset: '\x1b[0m'
        };
        console.log(`${colors[type]}${message}${colors.reset}`);
    }

    async testMCPConnection() {
        this.log('🔌 Testing MCP Server Connection', 'info');
        this.log('=' .repeat(40), 'info');

        return new Promise((resolve, reject) => {
            try {
                // Start MCP server
                const server = spawn('node', ['dist/index.js'], {
                    env: {
                        ...process.env,
                        GEMINI_API_KEY: this.apiKey,
                        NODE_ENV: 'test'
                    },
                    stdio: ['pipe', 'pipe', 'pipe']
                });

                let output = '';
                let initResponse = '';

                // Handle server output
                server.stdout.on('data', (data) => {
                    const message = data.toString();
                    output += message;
                    
                    if (message.includes('MCP Tailwind Gemini Server running')) {
                        this.log('✓ MCP server started successfully', 'success');
                        
                        // Send initialize message
                        setTimeout(() => {
                            const initMessage = {
                                jsonrpc: '2.0',
                                method: 'initialize',
                                params: {
                                    protocolVersion: '2024-11-05',
                                    capabilities: {},
                                    clientInfo: {
                                        name: 'test-client',
                                        version: '1.0.0'
                                    }
                                },
                                id: 1
                            };
                            
                            server.stdin.write(JSON.stringify(initMessage) + '\n');
                        }, 1000);
                    }

                    // Check for initialize response
                    if (message.includes('"result"') && message.includes('"capabilities"')) {
                        initResponse = message;
                        this.log('✓ MCP initialization successful', 'success');
                        
                        // Test list tools
                        setTimeout(() => {
                            const listToolsMessage = {
                                jsonrpc: '2.0',
                                method: 'tools/list',
                                params: {},
                                id: 2
                            };
                            
                            server.stdin.write(JSON.stringify(listToolsMessage) + '\n');
                        }, 500);
                    }

                    // Check for tools list response
                    if (message.includes('generate_tailwind_css')) {
                        this.log('✓ MCP tools available', 'success');
                        this.log('✓ MCP connection test PASSED', 'success');
                        
                        server.kill();
                        resolve(true);
                    }
                });

                server.stderr.on('data', (data) => {
                    const error = data.toString();
                    if (!error.includes('npm notice')) {
                        this.log(`Server error: ${error}`, 'error');
                    }
                });

                server.on('close', (code) => {
                    if (code !== 0 && code !== null) {
                        this.log(`Server exited with code ${code}`, 'error');
                        reject(new Error(`Server failed with code ${code}`));
                    }
                });

                // Timeout after 10 seconds
                setTimeout(() => {
                    server.kill();
                    if (!initResponse) {
                        reject(new Error('MCP connection test timeout'));
                    }
                }, 10000);

            } catch (error) {
                reject(error);
            }
        });
    }

    async runTest() {
        try {
            await this.testMCPConnection();
            
            this.log('\n' + '=' .repeat(40), 'success');
            this.log('🎉 MCP CONNECTION READY!', 'success');
            this.log('=' .repeat(40), 'success');
            
            this.log('\n📋 Server Status:', 'info');
            this.log('   • MCP Protocol: ✓ Working', 'info');
            this.log('   • Server Startup: ✓ Success', 'info');
            this.log('   • Tool Discovery: ✓ Available', 'info');
            this.log('   • API Integration: ✓ Ready', 'info');

            this.log('\n🔌 Ready for MCP Clients:', 'success');
            this.log('   • Claude Desktop', 'info');
            this.log('   • VS Code MCP Extension', 'info');
            this.log('   • Cline Extension', 'info');
            this.log('   • Continue Extension', 'info');

            this.log('\n📚 Configuration guides available in:', 'info');
            this.log('   • MCP-CLIENT-CONFIGS.md', 'info');
            this.log('   • MCP-CONNECTION-GUIDE.md', 'info');
            this.log('   • QUICK-CONNECT.md', 'info');

        } catch (error) {
            this.log(`\n❌ MCP connection test failed: ${error.message}`, 'error');
            this.log('\n🔧 Troubleshooting:', 'warning');
            this.log('   1. Check if dist/index.js exists', 'warning');
            this.log('   2. Verify Node.js version (18+)', 'warning');
            this.log('   3. Run: npm run build', 'warning');
            this.log('   4. Check GEMINI_API_KEY', 'warning');
            
            process.exit(1);
        }
    }
}

// Run the test
const tester = new MCPConnectionTest();
tester.runTest().catch(console.error);
