#!/usr/bin/env node

/**
 * Simple Cross-Platform Test Runner
 * Runs basic integration tests for the MCP Tailwind system
 */

import { SimpleIntegrationTester } from './simple-integration-test.js';

async function main() {
  try {
    console.log('🔧 MCP Tailwind Cross-Platform Integration Test');
    console.log('Version: 1.0.0');
    console.log('Timestamp:', new Date().toISOString());
    console.log();

    const tester = new SimpleIntegrationTester();
    await tester.runAllTests();
    
    console.log('\n✨ Integration test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Integration test failed:', error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
