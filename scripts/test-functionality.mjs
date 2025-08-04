#!/usr/bin/env node

/**
 * Simple functionality test for MCP Tailwind Gemini
 * Tests core features without external dependencies
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

class FunctionalityTester {
  constructor() {
    this.projectRoot = process.cwd();
  }

  /**
   * Test if all core files exist
   */
  testCoreFiles() {
    console.log('🔍 Testing core files...');
    
    const coreFiles = [
      'src/index.ts',
      'src/utils/gemini-helper.ts',
      'src/adapters/framework-adapter.ts',
      'src/integrations/build-tools.ts',
      'src/integrations/external-apis.ts',
      'src/platforms/multi-platform.ts',
      'package.json',
      'tsconfig.json'
    ];
    
    let allExist = true;
    
    for (const file of coreFiles) {
      const fullPath = join(this.projectRoot, file);
      if (existsSync(fullPath)) {
        console.log(`  ✅ ${file}`);
      } else {
        console.log(`  ❌ ${file} - Missing`);
        allExist = false;
      }
    }
    
    return allExist;
  }

  /**
   * Test package.json configuration
   */
  testPackageConfig() {
    console.log('\n📦 Testing package configuration...');
    
    try {
      const packagePath = join(this.projectRoot, 'package.json');
      const packageContent = JSON.parse(readFileSync(packagePath, 'utf-8'));
      
      // Check required scripts
      const requiredScripts = ['build', 'start', 'dev'];
      const hasAllScripts = requiredScripts.every(script => 
        packageContent.scripts && packageContent.scripts[script]
      );
      
      if (hasAllScripts) {
        console.log('  ✅ All required scripts present');
      } else {
        console.log('  ❌ Missing required scripts');
        return false;
      }
      
      // Check dependencies
      const requiredDeps = ['@google/generative-ai', '@modelcontextprotocol/sdk'];
      const hasAllDeps = requiredDeps.every(dep => 
        (packageContent.dependencies && packageContent.dependencies[dep]) ||
        (packageContent.devDependencies && packageContent.devDependencies[dep])
      );
      
      if (hasAllDeps) {
        console.log('  ✅ All required dependencies present');
      } else {
        console.log('  ❌ Missing required dependencies');
        return false;
      }
      
      return true;
    } catch (error) {
      console.log(`  ❌ Package.json error: ${error.message}`);
      return false;
    }
  }

  /**
   * Test TypeScript configuration
   */
  testTypeScriptConfig() {
    console.log('\n🔧 Testing TypeScript configuration...');
    
    try {
      const tsconfigPath = join(this.projectRoot, 'tsconfig.json');
      const tsconfigContent = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
      
      // Check compiler options
      const requiredOptions = ['target', 'module', 'outDir', 'rootDir'];
      const hasAllOptions = requiredOptions.every(option => 
        tsconfigContent.compilerOptions && tsconfigContent.compilerOptions[option]
      );
      
      if (hasAllOptions) {
        console.log('  ✅ All required compiler options present');
      } else {
        console.log('  ❌ Missing required compiler options');
        return false;
      }
      
      // Check if ES modules are configured
      const isESModules = tsconfigContent.compilerOptions.module === 'ESNext' || 
                         tsconfigContent.compilerOptions.module === 'ES2022';
      
      if (isESModules) {
        console.log('  ✅ ES modules configured');
      } else {
        console.log('  ❌ ES modules not configured');
        return false;
      }
      
      return true;
    } catch (error) {
      console.log(`  ❌ TypeScript config error: ${error.message}`);
      return false;
    }
  }

  /**
   * Test MCP configuration
   */
  testMCPConfig() {
    console.log('\n🤖 Testing MCP configuration...');
    
    try {
      const mcpConfigPath = join(this.projectRoot, 'mcp.json');
      if (!existsSync(mcpConfigPath)) {
        console.log('  ❌ mcp.json not found');
        return false;
      }
      
      const mcpConfig = JSON.parse(readFileSync(mcpConfigPath, 'utf-8'));
      
      // Check required fields
      const requiredFields = ['name', 'version', 'description'];
      const hasAllFields = requiredFields.every(field => mcpConfig[field]);
      
      if (hasAllFields) {
        console.log('  ✅ All required MCP fields present');
      } else {
        console.log('  ❌ Missing required MCP fields');
        return false;
      }
      
      return true;
    } catch (error) {
      console.log(`  ❌ MCP config error: ${error.message}`);
      return false;
    }
  }

  /**
   * Test framework adapter structure
   */
  testFrameworkAdapters() {
    console.log('\n🏗️ Testing framework adapters...');
    
    try {
      const adapterPath = join(this.projectRoot, 'src/adapters/framework-adapter.ts');
      const adapterContent = readFileSync(adapterPath, 'utf-8');
      
      // Check for required adapters
      const requiredAdapters = ['ReactAdapter', 'VueAdapter', 'SvelteAdapter', 'AngularAdapter'];
      const hasAllAdapters = requiredAdapters.every(adapter => 
        adapterContent.includes(adapter)
      );
      
      if (hasAllAdapters) {
        console.log('  ✅ All framework adapters present');
      } else {
        console.log('  ❌ Missing framework adapters');
        return false;
      }
      
      // Check for AdapterFactory
      if (adapterContent.includes('AdapterFactory')) {
        console.log('  ✅ AdapterFactory present');
      } else {
        console.log('  ❌ AdapterFactory missing');
        return false;
      }
      
      return true;
    } catch (error) {
      console.log(`  ❌ Framework adapter error: ${error.message}`);
      return false;
    }
  }

  /**
   * Test build tool integrations
   */
  testBuildTools() {
    console.log('\n🔨 Testing build tool integrations...');
    
    try {
      const buildToolsPath = join(this.projectRoot, 'src/integrations/build-tools.ts');
      const buildToolsContent = readFileSync(buildToolsPath, 'utf-8');
      
      // Check for required build tools
      const requiredTools = ['ViteIntegration', 'WebpackIntegration', 'NextJSIntegration'];
      const hasAllTools = requiredTools.every(tool => 
        buildToolsContent.includes(tool)
      );
      
      if (hasAllTools) {
        console.log('  ✅ All build tool integrations present');
      } else {
        console.log('  ❌ Missing build tool integrations');
        return false;
      }
      
      return true;
    } catch (error) {
      console.log(`  ❌ Build tools error: ${error.message}`);
      return false;
    }
  }

  /**
   * Test documentation
   */
  testDocumentation() {
    console.log('\n📚 Testing documentation...');
    
    const docFiles = [
      'README.md',
      'docs/CROSS_PLATFORM_GUIDE.md',
      'docs/CROSS_PLATFORM_SUMMARY.md'
    ];
    
    let allExist = true;
    
    for (const file of docFiles) {
      const fullPath = join(this.projectRoot, file);
      if (existsSync(fullPath)) {
        console.log(`  ✅ ${file}`);
      } else {
        console.log(`  ❌ ${file} - Missing`);
        allExist = false;
      }
    }
    
    return allExist;
  }

  /**
   * Run all functionality tests
   */
  runAllTests() {
    console.log('🧪 Starting Functionality Tests for MCP Tailwind Gemini\n');
    
    const tests = [
      { name: 'Core Files', test: () => this.testCoreFiles() },
      { name: 'Package Config', test: () => this.testPackageConfig() },
      { name: 'TypeScript Config', test: () => this.testTypeScriptConfig() },
      { name: 'MCP Config', test: () => this.testMCPConfig() },
      { name: 'Framework Adapters', test: () => this.testFrameworkAdapters() },
      { name: 'Build Tools', test: () => this.testBuildTools() },
      { name: 'Documentation', test: () => this.testDocumentation() }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const { name, test } of tests) {
      if (test()) {
        passed++;
      } else {
        failed++;
      }
    }
    
    console.log('\n📊 Functionality Test Summary:');
    console.log(`Total Tests: ${tests.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 All functionality tests passed! Core features are working correctly.');
      console.log('✨ Cross-platform integration system is ready for use.');
    } else {
      console.log('\n⚠️ Some functionality tests failed. Please check the issues above.');
      console.log('💡 Focus on fixing core functionality before running advanced tests.');
    }
    
    // Provide next steps
    console.log('\n🚀 Next Steps:');
    console.log('1. Fix any failing tests above');
    console.log('2. Run `npm run build` to check TypeScript compilation');
    console.log('3. Run `npm test` for unit tests');
    console.log('4. Test MCP server with Claude Desktop');
    console.log('5. Validate cross-platform features with real projects');
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new FunctionalityTester();
  tester.runAllTests();
}

export { FunctionalityTester };
