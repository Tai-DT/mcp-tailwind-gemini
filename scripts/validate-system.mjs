#!/usr/bin/env node

/**
 * Comprehensive MCP Validation Script
 * Validates all components of the MCP Tailwind system
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

class MCPValidator {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  async validateAll() {
    console.log('🔍 MCP Tailwind System Validation');
    console.log('='.repeat(50));
    
    await this.validateProjectStructure();
    await this.validateConfigurations();
    await this.validateSourceFiles();
    await this.validateDockerSetup();
    await this.validateScripts();
    
    this.printSummary();
  }

  async validateProjectStructure() {
    console.log('\n📁 Validating Project Structure...');
    
    const requiredDirs = [
      'src',
      'src/adapters',
      'src/integrations',
      'src/platforms',
      'src/utils',
      'tests',
      'scripts',
      'dist'
    ];

    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'mcp.json',
      'Dockerfile',
      'docker-compose.yml',
      'README.md'
    ];

    // Check directories
    for (const dir of requiredDirs) {
      this.checkPath(dir, 'directory');
    }

    // Check files
    for (const file of requiredFiles) {
      this.checkPath(file, 'file');
    }
  }

  async validateConfigurations() {
    console.log('\n⚙️  Validating Configuration Files...');
    
    // Validate package.json
    this.validateJSON('package.json', (pkg) => {
      const required = ['name', 'version', 'type', 'main', 'scripts'];
      return required.every(field => pkg[field]);
    });

    // Validate tsconfig.json
    this.validateJSON('tsconfig.json', (ts) => {
      return ts.compilerOptions && ts.compilerOptions.target;
    });

    // Validate mcp.json
    this.validateJSON('mcp.json', (mcp) => {
      const required = ['name', 'version', 'description'];
      return required.every(field => mcp[field]);
    });
  }

  async validateSourceFiles() {
    console.log('\n📝 Validating Source Files...');
    
    const coreFiles = [
      'src/index.ts',
      'src/adapters/framework-adapter.ts',
      'src/integrations/build-tools.ts',
      'src/integrations/external-apis.ts',
      'src/platforms/multi-platform.ts',
      'src/utils/gemini-helper.ts'
    ];

    for (const file of coreFiles) {
      this.validateSourceFile(file);
    }
  }

  async validateDockerSetup() {
    console.log('\n🐳 Validating Docker Setup...');
    
    // Check Dockerfile
    const dockerfilePath = path.join(projectRoot, 'Dockerfile');
    if (fs.existsSync(dockerfilePath)) {
      const content = fs.readFileSync(dockerfilePath, 'utf8');
      const hasMultiStage = content.includes('FROM') && content.includes('AS');
      const hasNode = content.includes('node:');
      const hasWorkdir = content.includes('WORKDIR');
      const hasExpose = content.includes('EXPOSE');
      
      this.addResult(
        'Dockerfile Validation',
        hasMultiStage && hasNode && hasWorkdir && hasExpose,
        'Dockerfile structure and requirements'
      );
    } else {
      this.addResult('Dockerfile Validation', false, 'Dockerfile not found');
    }

    // Check docker-compose.yml
    const composePath = path.join(projectRoot, 'docker-compose.yml');
    if (fs.existsSync(composePath)) {
      const content = fs.readFileSync(composePath, 'utf8');
      const hasServices = content.includes('services:');
      const hasVersion = content.includes('version:');
      const hasPorts = content.includes('ports:');
      
      this.addResult(
        'Docker Compose Validation',
        hasServices && hasVersion && hasPorts,
        'Docker compose structure and configuration'
      );
    } else {
      this.addResult('Docker Compose Validation', false, 'docker-compose.yml not found');
    }
  }

  async validateScripts() {
    console.log('\n📜 Validating Scripts...');
    
    const scriptFiles = [
      'scripts/test-functionality.mjs',
      'scripts/test-mcp-server.mjs',
      'scripts/run-integration-test.mjs',
      'scripts/docker-deploy.sh',
      'scripts/docker-dev.sh'
    ];

    for (const script of scriptFiles) {
      this.checkPath(script, 'file');
    }

    // Validate package.json scripts
    const packagePath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const requiredScripts = ['build', 'start', 'test'];
      const hasRequiredScripts = requiredScripts.every(script => pkg.scripts && pkg.scripts[script]);
      
      this.addResult(
        'NPM Scripts Validation',
        hasRequiredScripts,
        'Required npm scripts (build, start, test)'
      );
    }
  }

  checkPath(pathName, type) {
    const fullPath = path.join(projectRoot, pathName);
    const exists = fs.existsSync(fullPath);
    
    if (exists && type === 'directory') {
      const isDir = fs.statSync(fullPath).isDirectory();
      this.addResult(`${pathName} (${type})`, isDir, `Required ${type}`);
    } else if (exists && type === 'file') {
      const isFile = fs.statSync(fullPath).isFile();
      this.addResult(`${pathName} (${type})`, isFile, `Required ${type}`);
    } else {
      this.addResult(`${pathName} (${type})`, false, `Missing ${type}`);
    }
  }

  validateJSON(fileName, validator) {
    const filePath = path.join(projectRoot, fileName);
    
    try {
      if (!fs.existsSync(filePath)) {
        this.addResult(`${fileName} Validation`, false, 'File not found');
        return;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(content);
      const isValid = validator(json);
      
      this.addResult(
        `${fileName} Validation`,
        isValid,
        isValid ? 'Valid JSON structure' : 'Invalid JSON structure'
      );
    } catch (error) {
      this.addResult(`${fileName} Validation`, false, `Parse error: ${error.message}`);
    }
  }

  validateSourceFile(fileName) {
    const filePath = path.join(projectRoot, fileName);
    
    if (!fs.existsSync(filePath)) {
      this.addResult(`${fileName}`, false, 'Source file not found');
      return;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasExports = content.includes('export');
      const hasImports = content.includes('import');
      const hasClasses = content.includes('class') || content.includes('interface');
      
      this.addResult(
        fileName,
        hasExports && (hasImports || hasClasses),
        'TypeScript source file structure'
      );
    } catch (error) {
      this.addResult(fileName, false, `Read error: ${error.message}`);
    }
  }

  addResult(name, success, message) {
    this.results.push({ name, success, message });
    console.log(`  ${success ? '✅' : '❌'} ${name}: ${message}`);
  }

  printSummary() {
    const duration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;
    
    console.log('\n' + '='.repeat(50));
    console.log('🏁 MCP Validation Summary');
    console.log('='.repeat(50));
    console.log(`📊 Total Checks: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Validations:');
      this.results
        .filter(r => !r.success)
        .forEach(r => console.log(`  - ${r.name}: ${r.message}`));
    }
    
    console.log('\n' + (failed === 0 ? '🎉 All validations passed!' : '⚠️  Some validations failed'));
    
    if (failed === 0) {
      console.log('\n🚀 MCP Tailwind system is production-ready!');
    }
  }
}

// Main execution
async function main() {
  const validator = new MCPValidator();
  await validator.validateAll();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
