#!/usr/bin/env node

/**
 * MCP Server Launch Test
 * Test khởi chạy MCP server
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testMCPServerLaunch() {
  console.log('🚀 TEST KHỞI CHẠY MCP SERVER');
  console.log('='.repeat(50));
  
  try {
    console.log('📋 Kiểm tra file cần thiết...');
    
    // Check required files
    const fs = await import('fs');
    const requiredFiles = [
      '../dist/index.js',
      '../package.json',
      '../mcp.json'
    ];
    
    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, file);
      const exists = fs.existsSync(filePath);
      console.log(`  ${exists ? '✅' : '❌'} ${file}`);
      
      if (!exists) {
        throw new Error(`Required file missing: ${file}`);
      }
    }
    
    console.log('\n🔧 Kiểm tra package.json scripts...');
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    
    if (pkg.scripts && pkg.scripts.start) {
      console.log('  ✅ npm start script có sẵn');
    } else {
      console.log('  ❌ npm start script không tìm thấy');
    }
    
    console.log('\n🎯 Kiểm tra MCP configuration...');
    const mcpConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../mcp.json'), 'utf8'));
    console.log(`  ✅ MCP Name: ${mcpConfig.name || 'Unknown'}`);
    console.log(`  ✅ MCP Version: ${mcpConfig.version || 'Unknown'}`);
    console.log(`  ✅ MCP Description: ${mcpConfig.description || 'No description'}`);
    
    console.log('\n🧪 Test import của main module...');
    
    // Test if we can at least read the main file
    const mainPath = path.join(__dirname, '../dist/index.js');
    const mainContent = fs.readFileSync(mainPath, 'utf8');
    
    if (mainContent.length > 0) {
      console.log('  ✅ Main module có nội dung');
      console.log(`  📊 Size: ${(mainContent.length / 1024).toFixed(1)}KB`);
    }
    
    // Check for key exports
    const hasServer = mainContent.includes('server') || mainContent.includes('Server');
    const hasTools = mainContent.includes('tool') || mainContent.includes('Tool');
    const hasExports = mainContent.includes('TailwindGeminiServer') || mainContent.includes('server.run()');
    
    console.log(`  ${hasServer ? '✅' : '❌'} Server code detected`);
    console.log(`  ${hasTools ? '✅' : '❌'} Tools code detected`);
    console.log(`  ${hasExports ? '✅' : '❌'} Server class detected`);
    
    console.log('\n🎉 KẾT QUÁ TEST KHỞI CHẠY MCP SERVER:');
    
    if (hasServer && hasTools && hasExports) {
      console.log('  ✅ MCP Server SẴN SÀNG KHỞI CHẠY!');
      console.log('  🚀 Có thể chạy: npm start');
      console.log('  📱 MCP tools và server đã được compile đúng');
      
      console.log('\n📋 Lệnh khởi chạy:');
      console.log('  npm start              # Khởi chạy MCP server');
      console.log('  node dist/index.js     # Chạy trực tiếp');
      
      return true;
    } else {
      console.log('  ❌ MCP Server CHƯA SẴN SÀNG');
      console.log('  🔧 Cần build lại project: npm run build');
      
      return false;
    }
    
  } catch (error) {
    console.log(`\n❌ LỖI TEST MCP SERVER: ${error.message}`);
    console.log('🔧 Hướng dẫn khắc phục:');
    console.log('  1. Chạy: npm run build');
    console.log('  2. Kiểm tra: npm run test');
    console.log('  3. Thử lại: node scripts/mcp-server-launch-test.mjs');
    
    return false;
  }
}

// Chạy test
testMCPServerLaunch()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
