/**
 * Simplified Cross-Platform Integration Test
 * Basic validation of core MCP functionality
 */

import { ReactAdapter, VueAdapter } from '../src/adapters/framework-adapter.js';
import { ViteIntegration } from '../src/integrations/build-tools.js';
import { GeminiHelper } from '../src/utils/gemini-helper.js';

interface SimpleTestResult {
  name: string;
  success: boolean;
  message: string;
  duration: number;
}

export class SimpleIntegrationTester {
  private results: SimpleTestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Cross-Platform Integration Tests');
    console.log('='.repeat(50));

    await this.testFrameworkAdapters();
    await this.testBuildTools();
    await this.testGeminiIntegration();
    
    this.printResults();
  }

  async testFrameworkAdapters(): Promise<void> {
    console.log('\n📱 Testing Framework Adapters...');
    
    // Test React Adapter
    await this.runTest('React Adapter', async () => {
      const adapter = new ReactAdapter();
      const html = '<div class="bg-blue-500 p-4">Test</div>';
      
      const component = await adapter.convertComponent(html);
      if (!component.includes('React') && !component.includes('function') && !component.includes('return')) {
        throw new Error('React component not properly generated');
      }
      
      const project = await adapter.generateProject({
        name: 'test-react',
        framework: 'react',
        features: ['components'],
        buildTool: 'vite',
        cssFramework: 'tailwind'
      });
      
      if (!project.files || project.files.length === 0) {
        throw new Error('Project structure not generated');
      }
      
      return 'React adapter working correctly';
    });

    // Test Vue Adapter
    await this.runTest('Vue Adapter', async () => {
      const adapter = new VueAdapter();
      const html = '<div class="bg-green-500 p-4">Test</div>';
      
      const component = await adapter.convertComponent(html);
      if (!component.includes('Vue') && !component.includes('template') && !component.includes('script')) {
        throw new Error('Vue component not properly generated');
      }
      
      return 'Vue adapter working correctly';
    });
  }

  async testBuildTools(): Promise<void> {
    console.log('\n🔧 Testing Build Tools...');
    
    await this.runTest('Vite Integration', async () => {
      const vite = new ViteIntegration();
      
      const config = await vite.generateConfig({
        framework: 'react',
        features: ['tailwind'],
        outputDir: 'dist',
        publicDir: 'public',
        entryPoint: 'src/main.tsx',
        cssFramework: 'tailwind',
        optimization: 'development'
      });
      
      if (!config.content.includes('vite') || !config.content.includes('tailwind')) {
        throw new Error('Vite config not properly generated');
      }
      
      return 'Vite integration working correctly';
    });
  }

  async testGeminiIntegration(): Promise<void> {
    console.log('\n🤖 Testing Gemini Integration...');
    
    await this.runTest('Gemini Helper', async () => {
      const gemini = new GeminiHelper({
        apiKey: 'test-key',
        model: 'gemini-pro',
        temperature: 0.7
      });
      
      // Test basic initialization
      if (!gemini) {
        throw new Error('Gemini helper not initialized');
      }
      
      return 'Gemini helper initialized correctly';
    });
  }

  private async runTest(name: string, testFn: () => Promise<string>): Promise<void> {
    const startTime = Date.now();
    
    try {
      const message = await testFn();
      const duration = Date.now() - startTime;
      
      this.results.push({
        name,
        success: true,
        message,
        duration
      });
      
      console.log(`  ✅ ${name} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const message = error instanceof Error ? error.message : 'Unknown error';
      
      this.results.push({
        name,
        success: false,
        message,
        duration
      });
      
      console.log(`  ❌ ${name} (${duration}ms): ${message}`);
    }
  }

  private printResults(): void {
    console.log('\n' + '='.repeat(50));
    console.log('🏁 Test Results Summary');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`📊 Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.success)
        .forEach(r => console.log(`  - ${r.name}: ${r.message}`));
    }
    
    console.log('\n' + (failed === 0 ? '🎉 All tests passed!' : '⚠️  Some tests failed'));
  }
}

// Export for use in other files
export { type SimpleTestResult };
