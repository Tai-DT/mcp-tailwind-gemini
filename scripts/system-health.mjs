#!/usr/bin/env node

/**
 * MCP Tailwind System Status & Health Check
 * Final validation and status report
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

class SystemHealthChecker {
  constructor() {
    this.status = {
      overall: 'unknown',
      components: {},
      metrics: {},
      timestamp: new Date().toISOString()
    };
  }

  async checkSystemHealth() {
    console.log('🏥 MCP Tailwind System Health Check');
    console.log('=' .repeat(60));
    console.log(`📅 Timestamp: ${this.status.timestamp}`);
    console.log();

    // Check all major components
    await this.checkProjectInfo();
    await this.checkCoreComponents();
    await this.checkDependencies();
    await this.checkDockerReadiness();
    await this.checkTestCoverage();
    
    this.calculateOverallHealth();
    this.generateReport();
  }

  async checkProjectInfo() {
    console.log('📋 Project Information');
    console.log('-'.repeat(30));
    
    try {
      const packagePath = path.join(projectRoot, 'package.json');
      const mcpPath = path.join(projectRoot, 'mcp.json');
      
      if (fs.existsSync(packagePath)) {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        console.log(`📦 Project: ${pkg.name || 'Unknown'}`);
        console.log(`🏷️  Version: ${pkg.version || 'Unknown'}`);
        console.log(`📖 Description: ${pkg.description || 'No description'}`);
        
        this.status.components.packageJson = 'healthy';
      }
      
      if (fs.existsSync(mcpPath)) {
        const mcp = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
        console.log(`🤖 MCP Name: ${mcp.name || 'Unknown'}`);
        console.log(`🔖 MCP Version: ${mcp.version || 'Unknown'}`);
        
        this.status.components.mcpConfig = 'healthy';
      }
    } catch (error) {
      console.log(`❌ Error reading project info: ${error.message}`);
      this.status.components.projectInfo = 'unhealthy';
    }
  }

  async checkCoreComponents() {
    console.log('\n🧩 Core Components Status');
    console.log('-'.repeat(30));
    
    const components = [
      { name: 'Framework Adapters', path: 'src/adapters/framework-adapter.ts' },
      { name: 'Build Tools', path: 'src/integrations/build-tools.ts' },
      { name: 'External APIs', path: 'src/integrations/external-apis.ts' },
      { name: 'Platform Manager', path: 'src/platforms/multi-platform.ts' },
      { name: 'Gemini Helper', path: 'src/utils/gemini-helper.ts' },
      { name: 'Main Index', path: 'src/index.ts' }
    ];

    let healthyComponents = 0;
    
    for (const component of components) {
      const filePath = path.join(projectRoot, component.path);
      
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        
        console.log(`  ✅ ${component.name}: ${sizeKB}KB`);
        this.status.components[component.name.toLowerCase().replace(/\s+/g, '')] = 'healthy';
        healthyComponents++;
      } else {
        console.log(`  ❌ ${component.name}: Missing`);
        this.status.components[component.name.toLowerCase().replace(/\s+/g, '')] = 'missing';
      }
    }
    
    this.status.metrics.componentHealth = `${healthyComponents}/${components.length}`;
  }

  async checkDependencies() {
    console.log('\n📦 Dependencies Status');
    console.log('-'.repeat(30));
    
    try {
      const packagePath = path.join(projectRoot, 'package.json');
      if (fs.existsSync(packagePath)) {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        const deps = Object.keys(pkg.dependencies || {});
        const devDeps = Object.keys(pkg.devDependencies || {});
        
        console.log(`  📚 Runtime Dependencies: ${deps.length}`);
        console.log(`  🛠️  Dev Dependencies: ${devDeps.length}`);
        
        // Check for key dependencies
        const keyDeps = ['@types/node', 'typescript'];
        const missingKeyDeps = keyDeps.filter(dep => 
          !deps.includes(dep) && !devDeps.includes(dep)
        );
        
        if (missingKeyDeps.length === 0) {
          console.log(`  ✅ All key dependencies present`);
          this.status.components.dependencies = 'healthy';
        } else {
          console.log(`  ⚠️  Missing key dependencies: ${missingKeyDeps.join(', ')}`);
          this.status.components.dependencies = 'warning';
        }
        
        this.status.metrics.dependencies = {
          runtime: deps.length,
          development: devDeps.length,
          total: deps.length + devDeps.length
        };
      }
    } catch (error) {
      console.log(`  ❌ Error checking dependencies: ${error.message}`);
      this.status.components.dependencies = 'unhealthy';
    }
  }

  async checkDockerReadiness() {
    console.log('\n🐳 Docker Readiness');
    console.log('-'.repeat(30));
    
    const dockerFiles = [
      { name: 'Dockerfile', path: 'Dockerfile' },
      { name: 'Docker Compose', path: 'docker-compose.yml' },
      { name: 'Docker Ignore', path: '.dockerignore' }
    ];

    let dockerReady = 0;
    
    for (const file of dockerFiles) {
      const filePath = path.join(projectRoot, file.path);
      
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`  ✅ ${file.name}: ${stats.size} bytes`);
        dockerReady++;
      } else {
        console.log(`  ❌ ${file.name}: Missing`);
      }
    }
    
    const distExists = fs.existsSync(path.join(projectRoot, 'dist'));
    if (distExists) {
      console.log(`  ✅ Build Output: Ready`);
      dockerReady++;
    } else {
      console.log(`  ⚠️  Build Output: Run 'npm run build' first`);
    }
    
    this.status.components.docker = dockerReady >= 3 ? 'healthy' : 'warning';
    this.status.metrics.dockerReadiness = `${dockerReady}/${dockerFiles.length + 1}`;
  }

  async checkTestCoverage() {
    console.log('\n🧪 Test Coverage');
    console.log('-'.repeat(30));
    
    const testFiles = [
      'tests/simple-integration-test.ts',
      'scripts/test-functionality.mjs',
      'scripts/test-mcp-server.mjs',
      'scripts/run-integration-test.mjs'
    ];

    let testsPresent = 0;
    
    for (const testFile of testFiles) {
      const filePath = path.join(projectRoot, testFile);
      
      if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${path.basename(testFile)}`);
        testsPresent++;
      } else {
        console.log(`  ❌ ${path.basename(testFile)}: Missing`);
      }
    }
    
    this.status.components.testing = testsPresent >= 3 ? 'healthy' : 'warning';
    this.status.metrics.testCoverage = `${testsPresent}/${testFiles.length}`;
  }

  calculateOverallHealth() {
    const components = Object.values(this.status.components);
    const healthy = components.filter(c => c === 'healthy').length;
    const total = components.length;
    const healthPercentage = (healthy / total) * 100;
    
    if (healthPercentage >= 90) {
      this.status.overall = 'excellent';
    } else if (healthPercentage >= 75) {
      this.status.overall = 'good';
    } else if (healthPercentage >= 50) {
      this.status.overall = 'fair';
    } else {
      this.status.overall = 'poor';
    }
    
    this.status.metrics.overallHealth = `${healthy}/${total} (${healthPercentage.toFixed(1)}%)`;
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🏥 SYSTEM HEALTH REPORT');
    console.log('='.repeat(60));
    
    // Overall Status
    const statusEmoji = {
      'excellent': '🟢',
      'good': '🟡',
      'fair': '🟠',
      'poor': '🔴'
    };
    
    console.log(`\n🎯 Overall Health: ${statusEmoji[this.status.overall]} ${this.status.overall.toUpperCase()}`);
    console.log(`📊 Component Health: ${this.status.metrics.overallHealth}`);
    
    // Key Metrics
    console.log('\n📈 Key Metrics:');
    Object.entries(this.status.metrics).forEach(([key, value]) => {
      if (key !== 'overallHealth') {
        console.log(`  • ${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
      }
    });
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    const unhealthyComponents = Object.entries(this.status.components)
      .filter(([, status]) => status !== 'healthy')
      .map(([name]) => name);
    
    if (unhealthyComponents.length === 0) {
      console.log('  🎉 System is in excellent health - ready for production!');
      console.log('  🚀 You can proceed with Docker deployment');
      console.log('  📝 Consider running integration tests: npm test');
    } else {
      console.log('  ⚠️  Address the following components:');
      unhealthyComponents.forEach(component => {
        console.log(`    - Fix ${component}`);
      });
    }
    
    // Quick Commands
    console.log('\n🔧 Quick Commands:');
    console.log('  • Build project: npm run build');
    console.log('  • Run tests: npm test');
    console.log('  • Start server: npm start');
    console.log('  • Docker build: docker-compose build');
    console.log('  • Docker run: docker-compose up');
    
    console.log('\n✨ MCP Tailwind System Health Check Complete!');
  }
}

// Main execution
async function main() {
  const healthChecker = new SystemHealthChecker();
  await healthChecker.checkSystemHealth();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
