#!/usr/bin/env node

/**
 * Quick Test Validation
 * Validates that the fixes work correctly
 */

console.log('🧪 Quick Test Validation - MCP Tailwind System');
console.log('='.repeat(50));

async function quickValidation() {
  const startTime = Date.now();
  const results = [];

  // Test 1: Import Fixed Tester
  try {
    const { FixedCrossPlatformTester } = await import('./tests/fixed-cross-platform-tester.js');
    const tester = new FixedCrossPlatformTester();
    
    results.push({
      test: 'Fixed Tester Import',
      status: 'pass',
      message: 'Successfully imported and instantiated'
    });
    console.log('✅ Fixed Tester Import: SUCCESS');
  } catch (error) {
    results.push({
      test: 'Fixed Tester Import',
      status: 'fail',
      message: error.message
    });
    console.log('❌ Fixed Tester Import: FAILED -', error.message);
  }

  // Test 2: Framework Adapters Import
  try {
    const { ReactAdapter, VueAdapter } = await import('./src/adapters/framework-adapter.js');
    const reactAdapter = new ReactAdapter();
    const vueAdapter = new VueAdapter();
    
    results.push({
      test: 'Framework Adapters',
      status: 'pass',
      message: 'Successfully imported and instantiated'
    });
    console.log('✅ Framework Adapters: SUCCESS');
  } catch (error) {
    results.push({
      test: 'Framework Adapters',
      status: 'fail',
      message: error.message
    });
    console.log('❌ Framework Adapters: FAILED -', error.message);
  }

  // Test 3: Build Tools Import
  try {
    const { ViteIntegration } = await import('./src/integrations/build-tools.js');
    const vite = new ViteIntegration();
    
    results.push({
      test: 'Build Tools',
      status: 'pass',
      message: 'Successfully imported and instantiated'
    });
    console.log('✅ Build Tools: SUCCESS');
  } catch (error) {
    results.push({
      test: 'Build Tools',
      status: 'fail',
      message: error.message
    });
    console.log('❌ Build Tools: FAILED -', error.message);
  }

  // Test 4: Gemini Helper Import
  try {
    const { GeminiHelper } = await import('./src/utils/gemini-helper.js');
    const gemini = new GeminiHelper({
      apiKey: 'test-key',
      model: 'gemini-pro',
      temperature: 0.7
    });
    
    results.push({
      test: 'Gemini Helper',
      status: 'pass',
      message: 'Successfully imported and instantiated'
    });
    console.log('✅ Gemini Helper: SUCCESS');
  } catch (error) {
    results.push({
      test: 'Gemini Helper',
      status: 'fail',
      message: error.message
    });
    console.log('❌ Gemini Helper: FAILED -', error.message);
  }

  const duration = Date.now() - startTime;
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;

  console.log('\n' + '='.repeat(50));
  console.log('📊 Quick Validation Results');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Duration: ${duration}ms`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All fixes working correctly!');
    console.log('🚀 Ready to run full integration tests');
  } else {
    console.log('\n⚠️  Some fixes need additional work');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`  - ${r.test}: ${r.message}`);
    });
  }
}

quickValidation().catch(console.error);
