#!/usr/bin/env node

/**
 * Comprehensive System Launch & Check
 * Khởi chạy và kiểm tra toàn bộ hệ thống MCP Tailwind
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class SystemLauncher {
  constructor() {
    this.results = [];
    this.processes = [];
  }

  async runSystemCheck() {
    console.log('🚀 MCP Tailwind System - Khởi chạy và Kiểm tra');
    console.log('='.repeat(60));
    console.log(`📅 Thời gian: ${new Date().toLocaleString('vi-VN')}`);
    console.log();

    // 1. Kiểm tra cấu trúc project
    await this.checkProjectStructure();
    
    // 2. Build project
    await this.buildProject();
    
    // 3. Chạy tests cơ bản
    await this.runBasicTests();
    
    // 4. Chạy integration tests
    await this.runIntegrationTests();
    
    // 5. Kiểm tra MCP server
    await this.checkMCPServer();
    
    // 6. Kiểm tra Docker readiness
    await this.checkDockerReadiness();
    
    this.printFinalReport();
  }

  async checkProjectStructure() {
    console.log('📁 Kiểm tra cấu trúc Project...');
    
    const requiredFiles = [
      'package.json',
      'tsconfig.json', 
      'mcp.json',
      'src/index.ts',
      'dist/index.js',
      'Dockerfile',
      'docker-compose.yml'
    ];

    const requiredDirs = [
      'src/adapters',
      'src/integrations', 
      'src/platforms',
      'src/utils',
      'tests',
      'scripts'
    ];

    let structureScore = 0;
    const totalItems = requiredFiles.length + requiredDirs.length;

    for (const file of requiredFiles) {
      const exists = fs.existsSync(path.join(__dirname, '..', file));
      console.log(`  ${exists ? '✅' : '❌'} ${file}`);
      if (exists) structureScore++;
    }

    for (const dir of requiredDirs) {
      const exists = fs.existsSync(path.join(__dirname, '..', dir));
      console.log(`  ${exists ? '✅' : '❌'} ${dir}/`);
      if (exists) structureScore++;
    }

    this.results.push({
      name: 'Cấu trúc Project',
      score: `${structureScore}/${totalItems}`,
      status: structureScore >= totalItems * 0.9 ? 'pass' : 'fail'
    });

    console.log(`📊 Điểm cấu trúc: ${structureScore}/${totalItems}\n`);
  }

  async buildProject() {
    console.log('🔨 Building Project...');
    
    try {
      const buildResult = await this.runCommand('npm', ['run', 'build']);
      
      if (buildResult.success) {
        console.log('✅ Build thành công');
        this.results.push({
          name: 'Build Project',
          status: 'pass',
          message: 'TypeScript compilation successful'
        });
      } else {
        console.log('❌ Build thất bại');
        this.results.push({
          name: 'Build Project', 
          status: 'fail',
          message: buildResult.error
        });
      }
    } catch (error) {
      console.log('❌ Lỗi build:', error.message);
      this.results.push({
        name: 'Build Project',
        status: 'fail', 
        message: error.message
      });
    }
    console.log();
  }

  async runBasicTests() {
    console.log('🧪 Chạy Tests Cơ bản...');
    
    const testScripts = [
      { name: 'Functionality Test', script: 'scripts/test-functionality.mjs' },
      { name: 'Quick Validation', script: 'scripts/quick-validation.mjs' },
      { name: 'System Health', script: 'scripts/system-health.mjs' }
    ];

    for (const test of testScripts) {
      try {
        console.log(`  Chạy ${test.name}...`);
        const result = await this.runCommand('node', [test.script]);
        
        if (result.success) {
          console.log(`  ✅ ${test.name} - PASS`);
          this.results.push({
            name: test.name,
            status: 'pass',
            message: 'Test completed successfully'
          });
        } else {
          console.log(`  ❌ ${test.name} - FAIL`);
          this.results.push({
            name: test.name,
            status: 'fail',
            message: result.error
          });
        }
      } catch (error) {
        console.log(`  ❌ ${test.name} - ERROR: ${error.message}`);
        this.results.push({
          name: test.name,
          status: 'fail',
          message: error.message
        });
      }
    }
    console.log();
  }

  async runIntegrationTests() {
    console.log('🔧 Chạy Integration Tests...');
    
    try {
      console.log('  Chạy Fixed Cross-Platform Integration Test...');
      const result = await this.runCommand('node', ['scripts/run-fixed-integration-test.mjs']);
      
      if (result.success) {
        console.log('  ✅ Integration Test - PASS');
        this.results.push({
          name: 'Integration Test',
          status: 'pass',
          message: 'All integration tests passed'
        });
      } else {
        console.log('  ❌ Integration Test - FAIL');
        this.results.push({
          name: 'Integration Test',
          status: 'fail', 
          message: result.error
        });
      }
    } catch (error) {
      console.log('  ❌ Integration Test - ERROR:', error.message);
      this.results.push({
        name: 'Integration Test',
        status: 'fail',
        message: error.message
      });
    }
    console.log();
  }

  async checkMCPServer() {
    console.log('🤖 Kiểm tra MCP Server...');
    
    try {
      // Kiểm tra server config
      const mcpConfigPath = path.join(__dirname, '..', 'mcp.json');
      if (fs.existsSync(mcpConfigPath)) {
        const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
        console.log(`  ✅ MCP Config: ${config.name} v${config.version}`);
        
        this.results.push({
          name: 'MCP Configuration',
          status: 'pass',
          message: `${config.name} v${config.version} configured`
        });
      } else {
        console.log('  ❌ MCP Config không tìm thấy');
        this.results.push({
          name: 'MCP Configuration',
          status: 'fail',
          message: 'mcp.json not found'
        });
      }

      // Kiểm tra main entry point
      const mainFile = path.join(__dirname, '..', 'dist', 'index.js');
      if (fs.existsSync(mainFile)) {
        console.log('  ✅ MCP Server Build Ready');
        this.results.push({
          name: 'MCP Server Build',
          status: 'pass',
          message: 'dist/index.js exists and ready'
        });
      } else {
        console.log('  ❌ MCP Server Build Missing');
        this.results.push({
          name: 'MCP Server Build',
          status: 'fail',
          message: 'dist/index.js not found'
        });
      }

    } catch (error) {
      console.log('  ❌ MCP Server Check Error:', error.message);
      this.results.push({
        name: 'MCP Server Check',
        status: 'fail',
        message: error.message
      });
    }
    console.log();
  }

  async checkDockerReadiness() {
    console.log('🐳 Kiểm tra Docker Readiness...');
    
    const dockerFiles = ['Dockerfile', 'docker-compose.yml', '.dockerignore'];
    let dockerScore = 0;

    for (const file of dockerFiles) {
      const exists = fs.existsSync(path.join(__dirname, '..', file));
      console.log(`  ${exists ? '✅' : '❌'} ${file}`);
      if (exists) dockerScore++;
    }

    // Kiểm tra dist folder
    const distExists = fs.existsSync(path.join(__dirname, '..', 'dist'));
    console.log(`  ${distExists ? '✅' : '❌'} dist/ folder (build output)`);
    if (distExists) dockerScore++;

    this.results.push({
      name: 'Docker Readiness',
      status: dockerScore >= 3 ? 'pass' : 'fail',
      score: `${dockerScore}/${dockerFiles.length + 1}`,
      message: dockerScore >= 3 ? 'Ready for Docker deployment' : 'Missing Docker files'
    });

    console.log(`📊 Docker Score: ${dockerScore}/${dockerFiles.length + 1}\n`);
  }

  async runCommand(command, args, options = {}) {
    return new Promise((resolve) => {
      const child = spawn(command, args, {
        stdio: 'pipe',
        cwd: path.join(__dirname, '..'),
        ...options
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({
          success: code === 0,
          stdout,
          stderr,
          error: stderr || (code !== 0 ? `Process exited with code ${code}` : null)
        });
      });

      child.on('error', (error) => {
        resolve({
          success: false,
          stdout,
          stderr,
          error: error.message
        });
      });
    });
  }

  printFinalReport() {
    console.log('🏁 BÁO CÁO TỔNG KẾT');
    console.log('='.repeat(60));
    
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const total = this.results.length;
    
    console.log(`📊 Tổng số kiểm tra: ${total}`);
    console.log(`✅ Thành công: ${passed}`);
    console.log(`❌ Thất bại: ${failed}`);
    console.log(`📈 Tỷ lệ thành công: ${((passed / total) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Chi tiết kết quả:');
    this.results.forEach(result => {
      const status = result.status === 'pass' ? '✅' : '❌';
      const score = result.score ? ` (${result.score})` : '';
      console.log(`  ${status} ${result.name}${score}: ${result.message || 'OK'}`);
    });

    console.log('\n🎯 Hướng dẫn sử dụng:');
    console.log('  • npm start              - Khởi chạy MCP server');
    console.log('  • npm run build          - Build project');
    console.log('  • npm test               - Chạy tất cả tests');
    console.log('  • docker-compose up      - Deploy với Docker');
    
    if (passed === total) {
      console.log('\n🎉 HỆ THỐNG HOẠT ĐỘNG HOÀN HẢO!');
      console.log('🚀 Sẵn sàng cho production deployment');
    } else {
      console.log('\n⚠️  Cần khắc phục một số vấn đề trước khi deployment');
    }
  }
}

// Chạy system launcher
const launcher = new SystemLauncher();
launcher.runSystemCheck().catch(console.error);
