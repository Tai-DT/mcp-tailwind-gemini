#!/usr/bin/env node

/**
 * Fixed Cross-Platform Test Runner
 * Runs the corrected integration tests
 */

import { FixedCrossPlatformTester } from './fixed-cross-platform-tester.js';

async function main() {
  try {
    console.log('🔧 MCP Tailwind Fixed Cross-Platform Integration Test');
    console.log('Version: 2.0.0 (Fixed)');
    console.log('Timestamp:', new Date().toISOString());
    console.log();

    const tester = new FixedCrossPlatformTester();
    const report = await tester.runAllTests();
    
    // Save report to file
    const fs = await import('fs');
    const reportPath = './test-results.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Test report saved to: ${reportPath}`);
    
    // Exit with appropriate code
    const exitCode = report.summary.failed > 0 ? 1 : 0;
    console.log(`\n✨ Fixed integration test completed with exit code: ${exitCode}`);
    process.exit(exitCode);
  } catch (error) {
    console.error('\n💥 Fixed integration test failed:', error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
