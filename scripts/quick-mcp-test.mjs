#!/usr/bin/env node

/**
 * 🚀 MCP TAILWIND - QUICK TEST RUNNER
 * Chạy kiểm tra nhanh toàn bộ hệ thống MCP
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 MCP TAILWIND - KIỂM TRA NHANH');
console.log('='.repeat(50));
console.log(`📅 ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`);

const tests = [
  {
    name: '🔧 TypeScript Compilation',
    command: 'npx',
    args: ['tsc', '--noEmit', 'tests/cross-platform-tester.ts'],
    description: 'Kiểm tra TypeScript compilation'
  },
  {
    name: '📦 Build Check',
    command: 'npm',
    args: ['run', 'build'],
    description: 'Kiểm tra build process'
  },
  {
    name: '🧪 MCP Server Test',
    command: 'node',
    args: ['scripts/test-functionality.mjs'],
    description: 'Kiểm tra functionality cơ bản'
  }
];

async function runTest(test) {
  return new Promise((resolve) => {
    console.log(`\n${test.name}`);
    console.log(`📝 ${test.description}...`);
    
    const startTime = Date.now();
    const child = spawn(test.command, test.args, {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      
      if (code === 0) {
        console.log(`✅ ${test.name} - THÀNH CÔNG (${duration}ms)`);
      } else {
        console.log(`❌ ${test.name} - THẤT BẠI (${duration}ms)`);
        if (errorOutput) {
          console.log(`   Error: ${errorOutput.slice(0, 200)}...`);
        }
      }
      
      resolve({ name: test.name, success: code === 0, duration });
    });
  });
}

async function runAllTests() {
  console.log('\n🏃‍♂️ Bắt đầu chạy tests...');
  
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 KẾT QUẢ TỔNG KẾT');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0);
  
  console.log(`📈 Tổng tests: ${total}`);
  console.log(`✅ Thành công: ${passed}`);
  console.log(`❌ Thất bại: ${total - passed}`);
  console.log(`⏱️  Tổng thời gian: ${totalTime}ms`);
  console.log(`📊 Tỷ lệ thành công: ${((passed / total) * 100).toFixed(1)}%`);
  
  results.forEach(r => {
    console.log(`  ${r.success ? '✅' : '❌'} ${r.name} (${r.duration}ms)`);
  });
  
  if (passed === total) {
    console.log('\n🎉 TẤT CẢ TESTS THÀNH CÔNG!');
    console.log('🚀 MCP Tailwind sẵn sàng sử dụng!');
  } else {
    console.log('\n⚠️  Một số tests thất bại');
    console.log('🔍 Kiểm tra logs để xem chi tiết');
  }
  
  console.log('\n📞 Lệnh khác:');
  console.log('  • node scripts/comprehensive-mcp-test.mjs - Test toàn diện');
  console.log('  • node scripts/test-cross-platform.mjs - Test cross-platform');
  console.log('  • npm start - Khởi động MCP server');
}

runAllTests().catch(console.error);
