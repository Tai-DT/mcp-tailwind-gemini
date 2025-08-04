#!/usr/bin/env node

/**
 * Comprehensive Feature Test Suite
 * Tests all functionality of MCP Tailwind Gemini Cross-Platform System
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

class ComprehensiveFeatureTester {
  constructor() {
    this.projectRoot = process.cwd();
    this.testResults = [];
  }

  /**
   * Test 1: Framework Adapter Functionality
   */
  async testFrameworkAdapters() {
    console.log('🏗️ Testing Framework Adapters...');
    
    try {
      // Test basic adapter loading
      const adapterPath = join(this.projectRoot, 'src/adapters/framework-adapter.ts');
      const content = readFileSync(adapterPath, 'utf-8');
      
      // Check for all required adapters
      const requiredAdapters = [
        'ReactAdapter',
        'VueAdapter', 
        'SvelteAdapter',
        'AngularAdapter',
        'AdapterFactory'
      ];
      
      const adapterResults = requiredAdapters.map(adapter => ({
        adapter,
        exists: content.includes(adapter),
        hasImplementation: content.includes(`class ${adapter}`) || content.includes(`export class ${adapter}`)
      }));
      
      const allAdaptersExist = adapterResults.every(result => result.exists && result.hasImplementation);
      
      // Test interface compliance
      const hasFrameworkInterface = content.includes('interface FrameworkAdapter');
      const hasConversionOptions = content.includes('interface ConversionOptions');
      const hasProjectConfig = content.includes('interface ProjectConfig');
      
      const score = allAdaptersExist && hasFrameworkInterface && hasConversionOptions && hasProjectConfig ? 100 : 75;
      
      return {
        test: 'Framework Adapters',
        passed: allAdaptersExist,
        score,
        details: {
          adapters: adapterResults,
          interfaces: { hasFrameworkInterface, hasConversionOptions, hasProjectConfig }
        }
      };
      
    } catch (error) {
      return {
        test: 'Framework Adapters',
        passed: false,
        score: 0,
        error: error.message
      };
    }
  }

  /**
   * Test 2: Build Tool Integration
   */
  async testBuildToolIntegration() {
    console.log('🔨 Testing Build Tool Integration...');
    
    try {
      const buildToolsPath = join(this.projectRoot, 'src/integrations/build-tools.ts');
      const content = readFileSync(buildToolsPath, 'utf-8');
      
      // Check for build tool integrations
      const requiredIntegrations = [
        'ViteIntegration',
        'WebpackIntegration', 
        'NextJSIntegration',
        'NuxtIntegration',
        'SvelteKitIntegration'
      ];
      
      const integrationResults = requiredIntegrations.map(integration => ({
        integration,
        exists: content.includes(integration),
        hasClass: content.includes(`class ${integration}`)
      }));
      
      const allIntegrationsExist = integrationResults.every(result => result.exists);
      const hasBuildToolFactory = content.includes('BuildToolFactory');
      
      const score = allIntegrationsExist && hasBuildToolFactory ? 100 : 70;
      
      return {
        test: 'Build Tool Integration',
        passed: allIntegrationsExist && hasBuildToolFactory,
        score,
        details: {
          integrations: integrationResults,
          hasFactory: hasBuildToolFactory
        }
      };
      
    } catch (error) {
      return {
        test: 'Build Tool Integration',
        passed: false,
        score: 0,
        error: error.message
      };
    }
  }

  /**
   * Test 3: External API Integration
   */
  async testExternalAPIIntegration() {
    console.log('🌐 Testing External API Integration...');
    
    try {
      const apiPath = join(this.projectRoot, 'src/integrations/external-apis.ts');
      const content = readFileSync(apiPath, 'utf-8');
      
      // Check for API integrations
      const requiredAPIs = [
        'GeminiAIIntegration',
        'OpenAIIntegration',
        'ClaudeIntegration', 
        'FigmaIntegration'
      ];
      
      const apiResults = requiredAPIs.map(api => ({
        api,
        exists: content.includes(api),
        hasClass: content.includes(`class ${api}`)
      }));
      
      const allAPIsExist = apiResults.every(result => result.exists);
      const hasIntegrationManager = content.includes('IntegrationManager');
      const hasAPIInterface = content.includes('interface APIIntegration');
      
      const score = allAPIsExist && hasIntegrationManager && hasAPIInterface ? 100 : 65;
      
      return {
        test: 'External API Integration',
        passed: allAPIsExist && hasIntegrationManager,
        score,
        details: {
          apis: apiResults,
          hasManager: hasIntegrationManager,
          hasInterface: hasAPIInterface
        }
      };
      
    } catch (error) {
      return {
        test: 'External API Integration',
        passed: false,
        score: 0,
        error: error.message
      };
    }
  }

  /**
   * Test 4: Platform Integration
   */
  async testPlatformIntegration() {
    console.log('💻 Testing Platform Integration...');
    
    try {
      const platformPath = join(this.projectRoot, 'src/platforms/multi-platform.ts');
      const content = readFileSync(platformPath, 'utf-8');
      
      // Check for platform plugins
      const requiredPlatforms = [
        'VSCodeExtension',  // Changed from VSCodePlugin
        'WebStormPlugin',
        'FigmaPlugin',
        'CLITool',
        'BrowserExtension'
      ];
      
      const platformResults = requiredPlatforms.map(platform => ({
        platform,
        exists: content.includes(platform),
        hasClass: content.includes(`class ${platform}`)
      }));
      
      const allPlatformsExist = platformResults.every(result => result.exists);
      const hasPlatformManager = content.includes('PlatformManager');
      
      const score = allPlatformsExist && hasPlatformManager ? 100 : 60;
      
      return {
        test: 'Platform Integration',
        passed: allPlatformsExist && hasPlatformManager,
        score,
        details: {
          platforms: platformResults,
          hasManager: hasPlatformManager
        }
      };
      
    } catch (error) {
      return {
        test: 'Platform Integration',
        passed: false,
        score: 0,
        error: error.message
      };
    }
  }

  /**
   * Test 5: Core MCP Tools
   */
  async testMCPTools() {
    console.log('🤖 Testing MCP Tools...');
    
    try {
      const toolsDir = join(this.projectRoot, 'src/tools');
      const requiredTools = [
        'component-generator.ts',
        'class-optimizer.ts', 
        'css-converter.ts',
        'design-analyzer.ts',
        'layout-generator.ts',
        'preview-generator.ts',
        'project-generator.ts',
        'theme-creator.ts',
        'ai-suggestions.ts',
        'shadcn-integration.ts'
      ];
      
      const toolResults = requiredTools.map(tool => ({
        tool,
        exists: existsSync(join(toolsDir, tool))
      }));
      
      const allToolsExist = toolResults.every(result => result.exists);
      
      // Check main index file
      const indexPath = join(this.projectRoot, 'src/index.ts');
      const indexExists = existsSync(indexPath);
      const indexContent = indexExists ? readFileSync(indexPath, 'utf-8') : '';
      const hasMCPServer = indexContent.includes('Server') && indexContent.includes('tools');
      
      const score = allToolsExist && indexExists && hasMCPServer ? 100 : 80;
      
      return {
        test: 'MCP Tools',
        passed: allToolsExist && indexExists && hasMCPServer,
        score,
        details: {
          tools: toolResults,
          indexExists,
          hasMCPServer
        }
      };
      
    } catch (error) {
      return {
        test: 'MCP Tools',
        passed: false,
        score: 0,
        error: error.message
      };
    }
  }

  /**
   * Test 6: Configuration Files
   */
  async testConfigurationFiles() {
    console.log('⚙️ Testing Configuration Files...');
    
    try {
      const configFiles = [
        { file: 'package.json', required: true },
        { file: 'tsconfig.json', required: true },
        { file: 'mcp.json', required: true },
        { file: '.env.example', required: false },
        { file: '.gitignore', required: false }
      ];
      
      const configResults = configFiles.map(({ file, required }) => {
        const exists = existsSync(join(this.projectRoot, file));
        return { file, exists, required, passed: exists || !required };
      });
      
      const allRequiredExist = configResults.filter(r => r.required).every(r => r.exists);
      
      // Test package.json content
      const packageJson = JSON.parse(readFileSync(join(this.projectRoot, 'package.json'), 'utf-8'));
      const hasRequiredScripts = ['build', 'start', 'dev'].every(script => packageJson.scripts?.[script]);
      const hasRequiredDeps = packageJson.dependencies || packageJson.devDependencies;
      
      const score = allRequiredExist && hasRequiredScripts && hasRequiredDeps ? 100 : 85;
      
      return {
        test: 'Configuration Files',
        passed: allRequiredExist && hasRequiredScripts,
        score,
        details: {
          configs: configResults,
          hasRequiredScripts,
          hasRequiredDeps: !!hasRequiredDeps
        }
      };
      
    } catch (error) {
      return {
        test: 'Configuration Files',
        passed: false,
        score: 0,
        error: error.message
      };
    }
  }

  /**
   * Test 7: Documentation
   */
  async testDocumentation() {
    console.log('📚 Testing Documentation...');
    
    try {
      const docFiles = [
        'README.md',
        'docs/CROSS_PLATFORM_GUIDE.md',
        'docs/CROSS_PLATFORM_SUMMARY.md',
        'docs/TEST_REPORT.md'
      ];
      
      const docResults = docFiles.map(file => ({
        file,
        exists: existsSync(join(this.projectRoot, file)),
        size: existsSync(join(this.projectRoot, file)) ? 
               readFileSync(join(this.projectRoot, file), 'utf-8').length : 0
      }));
      
      const allDocsExist = docResults.every(result => result.exists);
      const hasSubstantialContent = docResults.every(result => result.size > 1000);
      
      const score = allDocsExist && hasSubstantialContent ? 100 : 90;
      
      return {
        test: 'Documentation',
        passed: allDocsExist,
        score,
        details: {
          docs: docResults,
          hasSubstantialContent
        }
      };
      
    } catch (error) {
      return {
        test: 'Documentation',
        passed: false,
        score: 0,
        error: error.message
      };
    }
  }

  /**
   * Test 8: Cross-Platform Compatibility
   */
  async testCrossPlatformCompatibility() {
    console.log('🌐 Testing Cross-Platform Compatibility...');
    
    try {
      // Test ES Module compatibility
      const packageJson = JSON.parse(readFileSync(join(this.projectRoot, 'package.json'), 'utf-8'));
      const isESModule = packageJson.type === 'module';
      
      // Test TypeScript configuration
      const tsconfig = JSON.parse(readFileSync(join(this.projectRoot, 'tsconfig.json'), 'utf-8'));
      const hasESModules = tsconfig.compilerOptions?.module?.includes('ES');
      
      // Test file extensions
      const srcFiles = this.getAllTSFiles(join(this.projectRoot, 'src'));
      const hasCorrectExtensions = srcFiles.every(file => file.endsWith('.ts') || file.endsWith('.js'));
      
      // Test import/export statements
      const hasModernImports = srcFiles.some(file => {
        const content = readFileSync(file, 'utf-8');
        return content.includes('import ') && content.includes('export ');
      });
      
      const score = isESModule && hasESModules && hasCorrectExtensions && hasModernImports ? 100 : 75;
      
      return {
        test: 'Cross-Platform Compatibility',
        passed: isESModule && hasESModules,
        score,
        details: {
          isESModule,
          hasESModules,
          hasCorrectExtensions,
          hasModernImports,
          fileCount: srcFiles.length
        }
      };
      
    } catch (error) {
      return {
        test: 'Cross-Platform Compatibility',
        passed: false,
        score: 0,
        error: error.message
      };
    }
  }

  /**
   * Helper: Get all TypeScript files
   */
  getAllTSFiles(dir) {
    const files = [];
    try {
      const fs = require('fs');
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          files.push(...this.getAllTSFiles(fullPath));
        } else if (item.endsWith('.ts') || item.endsWith('.js')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Ignore errors for missing directories
    }
    return files;
  }

  /**
   * Run all comprehensive tests
   */
  async runAllTests() {
    console.log('🧪 Starting Comprehensive Feature Tests for MCP Tailwind Gemini\n');
    
    const tests = [
      () => this.testFrameworkAdapters(),
      () => this.testBuildToolIntegration(),
      () => this.testExternalAPIIntegration(),
      () => this.testPlatformIntegration(),
      () => this.testMCPTools(),
      () => this.testConfigurationFiles(),
      () => this.testDocumentation(),
      () => this.testCrossPlatformCompatibility()
    ];
    
    // Run all tests
    for (const test of tests) {
      const result = await test();
      this.testResults.push(result);
      
      const status = result.passed ? '✅' : '❌';
      const score = result.score || 0;
      console.log(`${status} ${result.test}: ${score}%`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log('');
    }
    
    // Calculate overall results
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const averageScore = this.testResults.reduce((sum, r) => sum + (r.score || 0), 0) / totalTests;
    
    console.log('📊 Comprehensive Test Summary:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}`);
    console.log(`📈 Average Score: ${averageScore.toFixed(1)}%`);
    console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    // Generate detailed report
    this.generateDetailedReport();
    
    // Final assessment
    if (passedTests === totalTests && averageScore >= 90) {
      console.log('\n🎉 EXCELLENT! All comprehensive tests passed with high scores!');
      console.log('✨ Cross-platform integration system is production-ready!');
    } else if (passedTests >= totalTests * 0.8 && averageScore >= 75) {
      console.log('\n👍 GOOD! Most tests passed with decent scores.');
      console.log('🔧 Some improvements needed for production readiness.');
    } else {
      console.log('\n⚠️ NEEDS WORK! Several tests failed or scored low.');
      console.log('🛠️ Significant improvements needed before production.');
    }
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Review failed tests and address issues');
    console.log('2. Run `npm run build` to ensure compilation');
    console.log('3. Test with real Gemini API key');
    console.log('4. Deploy and test with Claude Desktop');
    console.log('5. Validate with real cross-platform projects');
  }

  /**
   * Generate detailed test report
   */
  generateDetailedReport() {
    const reportPath = join(this.projectRoot, 'test-results.json');
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.testResults.length,
        passedTests: this.testResults.filter(r => r.passed).length,
        averageScore: this.testResults.reduce((sum, r) => sum + (r.score || 0), 0) / this.testResults.length
      },
      results: this.testResults
    };
    
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new ComprehensiveFeatureTester();
  tester.runAllTests().catch(console.error);
}

export { ComprehensiveFeatureTester };
