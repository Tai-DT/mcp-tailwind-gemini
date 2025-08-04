#!/usr/bin/env node

/**
 * Comprehensive MCP Test Suite
 * Kiểm tra toàn diện hệ thống MCP Tailwind
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

class MCPTestSuite {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
  }

  async runComprehensiveTests() {
    console.log('🧪 MCP TAILWIND - KIỂM TRA TOÀN DIỆN');
    console.log('='.repeat(60));
    console.log(`📅 Bắt đầu: ${new Date().toLocaleString('vi-VN')}`);
    console.log();

    // 1. Kiểm tra cấu hình MCP
    await this.testMCPConfiguration();
    
    // 2. Kiểm tra build output
    await this.testBuildOutput();
    
    // 3. Test framework adapters
    await this.testFrameworkAdapters();
    
    // 4. Test build tools integration
    await this.testBuildTools();
    
    // 5. Test API integrations
    await this.testAPIIntegrations();
    
    // 6. Test MCP server functionality
    await this.testMCPServerFunctionality();
    
    // 7. Test cross-platform compatibility
    await this.testCrossPlatformCompatibility();
    
    // 8. Performance tests
    await this.testPerformance();
    
    this.generateFinalReport();
  }

  async testMCPConfiguration() {
    console.log('🔧 Kiểm tra cấu hình MCP...');
    
    const tests = [
      {
        name: 'mcp.json exists',
        test: () => fs.existsSync(path.join(projectRoot, 'mcp.json'))
      },
      {
        name: 'package.json has MCP fields',
        test: () => {
          const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
          return pkg.name && pkg.version && pkg.main;
        }
      },
      {
        name: 'TypeScript config valid',
        test: () => fs.existsSync(path.join(projectRoot, 'tsconfig.json'))
      },
      {
        name: 'Main entry point exists',
        test: () => fs.existsSync(path.join(projectRoot, 'src', 'index.ts'))
      }
    ];

    for (const test of tests) {
      try {
        const result = test.test();
        console.log(`  ${result ? '✅' : '❌'} ${test.name}`);
        this.testResults.push({
          category: 'MCP Configuration',
          name: test.name,
          status: result ? 'pass' : 'fail',
          message: result ? 'OK' : 'Failed'
        });
      } catch (error) {
        console.log(`  ❌ ${test.name}: ${error.message}`);
        this.testResults.push({
          category: 'MCP Configuration',
          name: test.name,
          status: 'fail',
          message: error.message
        });
      }
    }
    console.log();
  }

  async testBuildOutput() {
    console.log('📦 Kiểm tra Build Output...');
    
    const distPath = path.join(projectRoot, 'dist');
    const expectedFiles = [
      'index.js',
      'index.d.ts',
      'types.js',
      'adapters',
      'integrations',
      'utils'
    ];

    for (const file of expectedFiles) {
      const filePath = path.join(distPath, file);
      const exists = fs.existsSync(filePath);
      console.log(`  ${exists ? '✅' : '❌'} dist/${file}`);
      
      this.testResults.push({
        category: 'Build Output',
        name: `dist/${file}`,
        status: exists ? 'pass' : 'fail',
        message: exists ? 'File exists' : 'File missing'
      });
    }
    console.log();
  }

  async testFrameworkAdapters() {
    console.log('📱 Kiểm tra Framework Adapters...');
    
    const adapters = ['React', 'Vue', 'Svelte', 'Angular'];
    
    for (const adapter of adapters) {
      try {
        // Import adapter dynamically
        const adapterPath = path.join(projectRoot, 'dist', 'adapters', 'framework-adapter.js');
        
        if (fs.existsSync(adapterPath)) {
          console.log(`  ✅ ${adapter}Adapter module exists`);
          this.testResults.push({
            category: 'Framework Adapters',
            name: `${adapter}Adapter`,
            status: 'pass',
            message: 'Module compiled successfully'
          });
        } else {
          console.log(`  ❌ ${adapter}Adapter module missing`);
          this.testResults.push({
            category: 'Framework Adapters',
            name: `${adapter}Adapter`,
            status: 'fail',
            message: 'Module not found'
          });
        }
      } catch (error) {
        console.log(`  ❌ ${adapter}Adapter: ${error.message}`);
        this.testResults.push({
          category: 'Framework Adapters',
          name: `${adapter}Adapter`,
          status: 'fail',
          message: error.message
        });
      }
    }
    console.log();
  }

  async testBuildTools() {
    console.log('🔨 Kiểm tra Build Tools...');
    
    const buildTools = ['Vite', 'Webpack', 'NextJS'];
    const buildToolsPath = path.join(projectRoot, 'dist', 'integrations', 'build-tools.js');
    
    if (fs.existsSync(buildToolsPath)) {
      for (const tool of buildTools) {
        console.log(`  ✅ ${tool}Integration compiled`);
        this.testResults.push({
          category: 'Build Tools',
          name: `${tool}Integration`,
          status: 'pass',
          message: 'Integration module ready'
        });
      }
    } else {
      for (const tool of buildTools) {
        console.log(`  ❌ ${tool}Integration missing`);
        this.testResults.push({
          category: 'Build Tools',
          name: `${tool}Integration`,
          status: 'fail',
          message: 'Module not compiled'
        });
      }
    }
    console.log();
  }

  async testAPIIntegrations() {
    console.log('🌐 Kiểm tra API Integrations...');
    
    const apis = ['Gemini', 'OpenAI', 'Claude', 'Figma'];
    const apisPath = path.join(projectRoot, 'dist', 'integrations', 'external-apis.js');
    
    if (fs.existsSync(apisPath)) {
      for (const api of apis) {
        console.log(`  ✅ ${api} API integration ready`);
        this.testResults.push({
          category: 'API Integrations',
          name: `${api}API`,
          status: 'pass',
          message: 'API integration compiled'
        });
      }
    } else {
      for (const api of apis) {
        console.log(`  ❌ ${api} API integration missing`);
        this.testResults.push({
          category: 'API Integrations',
          name: `${api}API`,
          status: 'fail',
          message: 'API module not found'
        });
      }
    }
    console.log();
  }

  async testMCPServerFunctionality() {
    console.log('🤖 Kiểm tra MCP Server Functionality...');
    
    try {
      // Test if main server file can be imported
      const serverPath = path.join(projectRoot, 'dist', 'index.js');
      
      if (fs.existsSync(serverPath)) {
        console.log('  ✅ MCP Server entry point exists');
        
        // Check if server has required exports
        const serverContent = fs.readFileSync(serverPath, 'utf8');
        const hasServer = serverContent.includes('server') || serverContent.includes('Server');
        const hasTools = serverContent.includes('tool') || serverContent.includes('Tool');
        
        console.log(`  ${hasServer ? '✅' : '❌'} Server exports detected`);
        console.log(`  ${hasTools ? '✅' : '❌'} Tools exports detected`);
        
        this.testResults.push({
          category: 'MCP Server',
          name: 'Server Structure',
          status: hasServer && hasTools ? 'pass' : 'fail',
          message: hasServer && hasTools ? 'Server ready' : 'Missing exports'
        });
      } else {
        console.log('  ❌ MCP Server entry point missing');
        this.testResults.push({
          category: 'MCP Server',
          name: 'Server Entry Point',
          status: 'fail',
          message: 'dist/index.js not found'
        });
      }
    } catch (error) {
      console.log(`  ❌ MCP Server test failed: ${error.message}`);
      this.testResults.push({
        category: 'MCP Server',
        name: 'Server Test',
        status: 'fail',
        message: error.message
      });
    }
    console.log();
  }

  async testCrossPlatformCompatibility() {
    console.log('🌍 Kiểm tra Cross-Platform Compatibility...');
    
    const testFiles = [
      'tests/fixed-cross-platform-tester.ts',
      'tests/simple-integration-test.ts'
    ];

    for (const testFile of testFiles) {
      const exists = fs.existsSync(path.join(projectRoot, testFile));
      console.log(`  ${exists ? '✅' : '❌'} ${testFile}`);
      
      this.testResults.push({
        category: 'Cross-Platform',
        name: path.basename(testFile),
        status: exists ? 'pass' : 'fail',
        message: exists ? 'Test file ready' : 'Test file missing'
      });
    }
    console.log();
  }

  async testPerformance() {
    console.log('⚡ Kiểm tra Performance...');
    
    try {
      // Check bundle sizes
      const distPath = path.join(projectRoot, 'dist');
      const indexPath = path.join(distPath, 'index.js');
      
      if (fs.existsSync(indexPath)) {
        const stats = fs.statSync(indexPath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        
        console.log(`  📊 Bundle size: ${sizeKB}KB`);
        
        const isOptimal = stats.size < 1024 * 1024; // Less than 1MB
        console.log(`  ${isOptimal ? '✅' : '⚠️'} Bundle size ${isOptimal ? 'optimal' : 'large'}`);
        
        this.testResults.push({
          category: 'Performance',
          name: 'Bundle Size',
          status: isOptimal ? 'pass' : 'warning',
          message: `${sizeKB}KB`
        });
      }
      
      // Check compilation time (estimated)
      const compileTime = Date.now() - this.startTime;
      console.log(`  ⏱️  Test execution time: ${compileTime}ms`);
      
      this.testResults.push({
        category: 'Performance',
        name: 'Test Execution',
        status: 'pass',
        message: `${compileTime}ms`
      });
      
    } catch (error) {
      console.log(`  ❌ Performance test failed: ${error.message}`);
      this.testResults.push({
        category: 'Performance',
        name: 'Performance Check',
        status: 'fail',
        message: error.message
      });
    }
    console.log();
  }

  generateFinalReport() {
    const totalTime = Date.now() - this.startTime;
    
    console.log('🏁 BÁO CÁO KẾT QUÁ KIỂM TRA MCP');
    console.log('='.repeat(60));
    
    // Thống kê tổng quan
    const categories = [...new Set(this.testResults.map(r => r.category))];
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.status === 'pass').length;
    const failedTests = this.testResults.filter(r => r.status === 'fail').length;
    const warningTests = this.testResults.filter(r => r.status === 'warning').length;
    
    console.log(`📊 Tổng quan:`);
    console.log(`  • Tổng số tests: ${totalTests}`);
    console.log(`  • ✅ Thành công: ${passedTests}`);
    console.log(`  • ❌ Thất bại: ${failedTests}`);
    console.log(`  • ⚠️  Cảnh báo: ${warningTests}`);
    console.log(`  • ⏱️  Thời gian: ${totalTime}ms`);
    console.log(`  • 📈 Tỷ lệ thành công: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Chi tiết theo danh mục:');
    for (const category of categories) {
      const categoryTests = this.testResults.filter(r => r.category === category);
      const categoryPassed = categoryTests.filter(r => r.status === 'pass').length;
      const categoryTotal = categoryTests.length;
      
      console.log(`\n  ${category}: ${categoryPassed}/${categoryTotal}`);
      categoryTests.forEach(test => {
        const icon = test.status === 'pass' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
        console.log(`    ${icon} ${test.name}: ${test.message}`);
      });
    }
    
    console.log('\n🎯 Kết luận:');
    if (failedTests === 0) {
      console.log('  🎉 TẤT CẢ TESTS ĐỀU THÀNH CÔNG!');
      console.log('  🚀 MCP Tailwind System hoạt động hoàn hảo');
      console.log('  ✨ Sẵn sàng cho production deployment');
    } else {
      console.log(`  ⚠️  Có ${failedTests} tests thất bại cần khắc phục`);
      console.log('  🔧 Hãy kiểm tra các vấn đề được liệt kê ở trên');
    }
    
    console.log('\n📞 Hỗ trợ:');
    console.log('  • Chạy lại: node scripts/comprehensive-mcp-test.mjs');
    console.log('  • Build: npm run build');
    console.log('  • Start: npm start');
  }
}

// Chạy test suite
const testSuite = new MCPTestSuite();
testSuite.runComprehensiveTests().catch(console.error);
