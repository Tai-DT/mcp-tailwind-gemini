#!/usr/bin/env node

/**
 * Docker Container Test Script for MCP Tailwind Gemini
 * Tests container functionality and MCP server integration
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class DockerTestRunner {
    constructor() {
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            tests: []
        };
        this.imageName = 'mcp-tailwind-runtime:latest';
        this.containerName = 'mcp-test-container';
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const colors = {
            info: '\x1b[36m',
            success: '\x1b[32m',
            error: '\x1b[31m',
            warning: '\x1b[33m',
            reset: '\x1b[0m'
        };
        console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
    }

    async runCommand(command, description) {
        try {
            this.log(`Running: ${command}`, 'info');
            const output = execSync(command, { 
                encoding: 'utf8', 
                timeout: 30000,
                stdio: 'pipe'
            });
            this.log(`✓ ${description}`, 'success');
            return { success: true, output: output.trim() };
        } catch (error) {
            this.log(`✗ ${description}: ${error.message}`, 'error');
            return { success: false, error: error.message, output: error.stdout || '' };
        }
    }

    async test(name, testFunction) {
        this.results.total++;
        this.log(`\n=== Test: ${name} ===`, 'info');
        
        try {
            const result = await testFunction();
            if (result.success) {
                this.results.passed++;
                this.log(`✓ PASSED: ${name}`, 'success');
                this.results.tests.push({ name, status: 'PASSED', details: result.details || '' });
            } else {
                this.results.failed++;
                this.log(`✗ FAILED: ${name} - ${result.error}`, 'error');
                this.results.tests.push({ name, status: 'FAILED', error: result.error });
            }
        } catch (error) {
            this.results.failed++;
            this.log(`✗ ERROR: ${name} - ${error.message}`, 'error');
            this.results.tests.push({ name, status: 'ERROR', error: error.message });
        }
    }

    async cleanup() {
        this.log('Cleaning up containers...', 'info');
        try {
            execSync(`docker stop ${this.containerName} 2>/dev/null || true`, { stdio: 'pipe' });
            execSync(`docker rm ${this.containerName} 2>/dev/null || true`, { stdio: 'pipe' });
        } catch (error) {
            // Ignore cleanup errors
        }
    }

    async testDockerImageExists() {
        return this.test('Docker Image Exists', async () => {
            const result = await this.runCommand(`docker images ${this.imageName} --format "table {{.Repository}}:{{.Tag}}"`, 'Check Docker image exists');
            if (result.success && result.output.includes(this.imageName)) {
                return { success: true, details: `Image ${this.imageName} found` };
            }
            return { success: false, error: 'Docker image not found' };
        });
    }

    async testContainerStart() {
        return this.test('Container Start', async () => {
            await this.cleanup(); // Clean up first
            
            const result = await this.runCommand(
                `docker run -d --name ${this.containerName} ${this.imageName}`,
                'Start container in detached mode'
            );
            
            if (result.success) {
                // Wait a moment for container to start
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                const statusResult = await this.runCommand(
                    `docker ps --filter "name=${this.containerName}" --format "{{.Status}}"`,
                    'Check container status'
                );
                
                if (statusResult.success && statusResult.output.includes('Up')) {
                    return { success: true, details: 'Container started successfully' };
                }
                return { success: false, error: 'Container failed to start properly' };
            }
            return { success: false, error: result.error };
        });
    }

    async testContainerHealth() {
        return this.test('Container Health Check', async () => {
            const result = await this.runCommand(
                `docker exec ${this.containerName} ps aux`,
                'Check processes in container'
            );
            
            if (result.success && result.output.includes('node')) {
                return { success: true, details: 'Node.js process running in container' };
            }
            return { success: false, error: 'Node.js process not found in container' };
        });
    }

    async testMCPServerLogs() {
        return this.test('MCP Server Logs', async () => {
            const result = await this.runCommand(
                `docker logs ${this.containerName}`,
                'Check container logs for MCP server startup'
            );
            
            if (result.success && result.output.includes('MCP Tailwind Gemini Server')) {
                return { success: true, details: 'MCP server started successfully' };
            }
            return { success: false, error: 'MCP server startup message not found in logs' };
        });
    }

    async testFileSystem() {
        return this.test('Container File System', async () => {
            const result = await this.runCommand(
                `docker exec ${this.containerName} ls -la /app/dist/`,
                'Check dist directory in container'
            );
            
            if (result.success && result.output.includes('index.js')) {
                return { success: true, details: 'Built files present in container' };
            }
            return { success: false, error: 'Built files not found in container' };
        });
    }

    async testPackageJson() {
        return this.test('Package.json Configuration', async () => {
            const result = await this.runCommand(
                `docker exec ${this.containerName} cat /app/package.json`,
                'Check package.json in container'
            );
            
            if (result.success) {
                try {
                    const packageData = JSON.parse(result.output);
                    if (packageData.name === 'mcp-tailwind-gemini') {
                        return { success: true, details: 'Package.json correctly configured' };
                    }
                } catch (error) {
                    return { success: false, error: 'Invalid package.json format' };
                }
            }
            return { success: false, error: 'Could not read package.json' };
        });
    }

    async testUserPermissions() {
        return this.test('User Permissions', async () => {
            const result = await this.runCommand(
                `docker exec ${this.containerName} whoami`,
                'Check container user'
            );
            
            if (result.success && result.output.trim() === 'mcp') {
                return { success: true, details: 'Container running as non-root user (mcp)' };
            }
            return { success: false, error: 'Container not running as expected user' };
        });
    }

    async testContainerStop() {
        return this.test('Container Stop', async () => {
            const result = await this.runCommand(
                `docker stop ${this.containerName}`,
                'Stop container gracefully'
            );
            
            if (result.success) {
                return { success: true, details: 'Container stopped successfully' };
            }
            return { success: false, error: result.error };
        });
    }

    async runAllTests() {
        this.log('🐳 Starting Docker Container Tests for MCP Tailwind Gemini', 'info');
        this.log('=' .repeat(60), 'info');

        // Run all tests
        await this.testDockerImageExists();
        await this.testContainerStart();
        await this.testContainerHealth();
        await this.testMCPServerLogs();
        await this.testFileSystem();
        await this.testPackageJson();
        await this.testUserPermissions();
        await this.testContainerStop();

        // Final cleanup
        await this.cleanup();

        // Print results
        this.printResults();
    }

    printResults() {
        this.log('\n' + '=' .repeat(60), 'info');
        this.log('🏁 DOCKER TEST RESULTS', 'info');
        this.log('=' .repeat(60), 'info');

        this.log(`Total Tests: ${this.results.total}`, 'info');
        this.log(`Passed: ${this.results.passed}`, 'success');
        this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'info');
        this.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`, 
                 this.results.failed === 0 ? 'success' : 'warning');

        this.log('\n📋 Detailed Results:', 'info');
        this.results.tests.forEach((test, index) => {
            const status = test.status === 'PASSED' ? '✓' : '✗';
            const color = test.status === 'PASSED' ? 'success' : 'error';
            this.log(`${index + 1}. ${status} ${test.name}`, color);
            if (test.details) {
                this.log(`   Details: ${test.details}`, 'info');
            }
            if (test.error) {
                this.log(`   Error: ${test.error}`, 'error');
            }
        });

        if (this.results.failed === 0) {
            this.log('\n🎉 All Docker tests passed! Container is ready for deployment.', 'success');
        } else {
            this.log('\n⚠️  Some tests failed. Please review the issues above.', 'warning');
        }

        this.log('\n💡 Container Usage:', 'info');
        this.log('  Production: docker run -d --name mcp-server mcp-tailwind-runtime:latest', 'info');
        this.log('  With port: docker run -d -p 3000:3000 --name mcp-server mcp-tailwind-runtime:latest', 'info');
        this.log('  With env: docker run -d -e GEMINI_API_KEY=your_key --name mcp-server mcp-tailwind-runtime:latest', 'info');
    }
}

// Main execution
async function main() {
    const tester = new DockerTestRunner();
    try {
        await tester.runAllTests();
        process.exit(tester.results.failed === 0 ? 0 : 1);
    } catch (error) {
        console.error('Test runner failed:', error.message);
        process.exit(1);
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export default DockerTestRunner;
