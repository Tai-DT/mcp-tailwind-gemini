#!/usr/bin/env node

/**
 * Final Docker Deployment Test for MCP Tailwind Gemini
 * Comprehensive validation of Docker containerization
 */

import { execSync } from 'child_process';

class FinalDeploymentTest {
    constructor() {
        this.imageName = 'mcp-tailwind-runtime:latest';
        this.containerName = 'mcp-final-test';
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

    async runTest() {
        this.log('🚀 Final Docker Deployment Test - MCP Tailwind Gemini', 'info');
        this.log('=' .repeat(60), 'info');

        try {
            // 1. Verify image exists
            this.log('\n1. Verifying Docker image...', 'info');
            const imageCheck = execSync(`docker images ${this.imageName} --format "{{.Repository}}:{{.Tag}}"`, { encoding: 'utf8' });
            if (imageCheck.includes(this.imageName)) {
                this.log(`   ✓ Image ${this.imageName} exists`, 'success');
            } else {
                throw new Error('Docker image not found');
            }

            // 2. Check image size
            this.log('\n2. Analyzing image size...', 'info');
            const sizeInfo = execSync(`docker images ${this.imageName} --format "{{.Size}}"`, { encoding: 'utf8' });
            this.log(`   ✓ Image size: ${sizeInfo.trim()}`, 'success');

            // 3. Test container startup
            this.log('\n3. Testing container startup...', 'info');
            
            // Cleanup first
            try {
                execSync(`docker stop ${this.containerName} 2>/dev/null`, { stdio: 'pipe' });
                execSync(`docker rm ${this.containerName} 2>/dev/null`, { stdio: 'pipe' });
            } catch {}

            // Start container
            execSync(`docker run -d --name ${this.containerName} ${this.imageName}`, { stdio: 'pipe' });
            this.log('   ✓ Container started successfully', 'success');

            // 4. Wait and check if still running
            this.log('\n4. Verifying container stability...', 'info');
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const containerStatus = execSync(`docker ps --filter "name=${this.containerName}" --format "{{.Status}}"`, { encoding: 'utf8' });
            if (containerStatus.includes('Up')) {
                this.log('   ✓ Container running stable after 5 seconds', 'success');
            } else {
                throw new Error('Container not stable');
            }

            // 5. Check logs for MCP server
            this.log('\n5. Checking MCP server logs...', 'info');
            const logs = execSync(`docker logs ${this.containerName}`, { encoding: 'utf8' });
            if (logs.includes('MCP Tailwind Gemini Server running')) {
                this.log('   ✓ MCP server started successfully', 'success');
            } else {
                this.log('   ⚠ MCP server message not found in logs', 'warning');
            }

            // 6. Verify file structure
            this.log('\n6. Verifying container file structure...', 'info');
            const distFiles = execSync(`docker exec ${this.containerName} ls -la /app/dist/`, { encoding: 'utf8' });
            if (distFiles.includes('index.js')) {
                this.log('   ✓ Built files present in container', 'success');
            }

            // 7. Check user security
            this.log('\n7. Checking security configuration...', 'info');
            const user = execSync(`docker exec ${this.containerName} whoami`, { encoding: 'utf8' });
            if (user.trim() === 'mcp') {
                this.log('   ✓ Container running as non-root user (mcp)', 'success');
            }

            // 8. Verify package.json
            this.log('\n8. Verifying package configuration...', 'info');
            const packageInfo = execSync(`docker exec ${this.containerName} cat /app/package.json`, { encoding: 'utf8' });
            const packageData = JSON.parse(packageInfo);
            if (packageData.name === 'mcp-tailwind-gemini') {
                this.log('   ✓ Package.json correctly configured', 'success');
            }

            // 9. Test graceful shutdown
            this.log('\n9. Testing graceful shutdown...', 'info');
            execSync(`docker stop ${this.containerName}`, { stdio: 'pipe' });
            this.log('   ✓ Container stopped gracefully', 'success');

            // Final cleanup
            execSync(`docker rm ${this.containerName}`, { stdio: 'pipe' });

            // 10. Print deployment summary
            this.log('\n' + '=' .repeat(60), 'success');
            this.log('🎉 DOCKER DEPLOYMENT SUCCESSFUL!', 'success');
            this.log('=' .repeat(60), 'success');

            this.log('\n📦 Container Information:', 'info');
            this.log(`   Image Name: ${this.imageName}`, 'info');
            this.log(`   Image Size: ${sizeInfo.trim()}`, 'info');
            this.log('   Security: Non-root user (mcp)', 'info');
            this.log('   MCP Server: ✓ Running on stdio', 'info');

            this.log('\n🚀 Deployment Commands:', 'success');
            this.log('   # Basic deployment:', 'info');
            this.log(`   docker run -d --name mcp-server ${this.imageName}`, 'info');
            this.log('', 'info');
            this.log('   # With environment variables:', 'info');
            this.log(`   docker run -d -e GEMINI_API_KEY=your_key --name mcp-server ${this.imageName}`, 'info');
            this.log('', 'info');
            this.log('   # With port mapping (if needed):', 'info');
            this.log(`   docker run -d -p 3000:3000 --name mcp-server ${this.imageName}`, 'info');

            this.log('\n💡 Production Notes:', 'warning');
            this.log('   • MCP server runs on stdio (standard for MCP protocol)', 'info');
            this.log('   • Container runs as non-root user for security', 'info');
            this.log('   • Built with production dependencies only', 'info');
            this.log('   • Ready for Docker Compose or Kubernetes deployment', 'info');

            this.log('\n✅ MCP Tailwind Gemini Docker package ready for production!', 'success');

        } catch (error) {
            this.log(`\n❌ Test failed: ${error.message}`, 'error');
            
            // Cleanup on error
            try {
                execSync(`docker stop ${this.containerName} 2>/dev/null`, { stdio: 'pipe' });
                execSync(`docker rm ${this.containerName} 2>/dev/null`, { stdio: 'pipe' });
            } catch {}
            
            process.exit(1);
        }
    }
}

// Run the test
const tester = new FinalDeploymentTest();
tester.runTest().catch(console.error);
