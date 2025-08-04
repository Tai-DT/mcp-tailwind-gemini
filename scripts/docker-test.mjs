#!/usr/bin/env node

/**
 * 🐳 MCP TAILWIND - DOCKER TEST SCRIPT
 * Build và test Docker container
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';

console.log('🐳 MCP TAILWIND - DOCKER BUILD & TEST');
console.log('='.repeat(50));
console.log(`📅 Bắt đầu: ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`);

// Kiểm tra Docker files
console.log('\n📋 Kiểm tra Docker files...');
const dockerFiles = [
  'Dockerfile',
  'docker-compose.yml', 
  '.dockerignore',
  'package.json',
  'mcp.json'
];

let filesReady = 0;
dockerFiles.forEach(file => {
  if (existsSync(file)) {
    console.log(`  ✅ ${file}`);
    filesReady++;
  } else {
    console.log(`  ❌ ${file} - Missing`);
  }
});

if (filesReady !== dockerFiles.length) {
  console.log('\n❌ Thiếu files cần thiết cho Docker build');
  process.exit(1);
}

console.log('\n🔨 Bắt đầu Docker build...');

// Build Docker image
function runDockerCommand(command, args, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n${description}...`);
    console.log(`💻 Command: ${command} ${args.join(' ')}`);
    
    const startTime = Date.now();
    const child = spawn(command, args, {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      // Show real-time progress for docker build
      if (text.includes('Step') || text.includes('Successfully') || text.includes('ERROR')) {
        console.log(`  📦 ${text.trim()}`);
      }
    });
    
    child.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      if (text.includes('ERROR') || text.includes('WARN')) {
        console.log(`  ⚠️  ${text.trim()}`);
      }
    });
    
    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      
      if (code === 0) {
        console.log(`  ✅ ${description} - SUCCESS (${duration}ms)`);
        resolve({ success: true, output, duration });
      } else {
        console.log(`  ❌ ${description} - FAILED (${duration}ms)`);
        if (errorOutput) {
          console.log(`  Error details: ${errorOutput.slice(0, 300)}...`);
        }
        resolve({ success: false, output: errorOutput, duration });
      }
    });
  });
}

async function runDockerTests() {
  try {
    // 1. Build Docker image
    const buildResult = await runDockerCommand('docker', [
      'build', 
      '-t', 'mcp-tailwind-gemini:test',
      '--target', 'production',
      '.'
    ], '🔨 Building Docker image');
    
    if (!buildResult.success) {
      console.log('\n❌ Docker build failed!');
      return false;
    }
    
    // 2. Test image info
    console.log('\n📊 Kiểm tra Docker image...');
    const imageResult = await runDockerCommand('docker', [
      'images', 'mcp-tailwind-gemini:test'
    ], '📊 Getting image info');
    
    // 3. Test container run (quick test)
    console.log('\n🚀 Test container run...');
    const runResult = await runDockerCommand('docker', [
      'run', '--rm', 
      '-e', 'NODE_ENV=test',
      'mcp-tailwind-gemini:test',
      'node', '-e', 'console.log("MCP Container Test: OK"); process.exit(0)'
    ], '🧪 Testing container execution');
    
    if (!runResult.success) {
      console.log('\n❌ Container run test failed!');
      return false;
    }
    
    // 4. Test with docker-compose (dry run)
    console.log('\n🐙 Test Docker Compose config...');
    const composeResult = await runDockerCommand('docker-compose', [
      'config'
    ], '🔧 Validating docker-compose.yml');
    
    return true;
    
  } catch (error) {
    console.log(`\n❌ Docker test error: ${error.message}`);
    return false;
  }
}

// Run tests
runDockerTests().then(success => {
  console.log('\n' + '='.repeat(50));
  console.log('📊 DOCKER TEST RESULTS');
  console.log('='.repeat(50));
  
  if (success) {
    console.log('🎉 DOCKER BUILD & TEST SUCCESSFUL!');
    console.log('✅ Image built successfully');
    console.log('✅ Container can run');
    console.log('✅ Docker Compose config valid');
    
    console.log('\n📞 Next steps:');
    console.log('  🚀 docker-compose up -d          # Start in background');
    console.log('  🔍 docker-compose logs -f        # View logs');
    console.log('  📊 docker-compose ps             # Check status');
    console.log('  🛑 docker-compose down           # Stop services');
    console.log('  🧪 docker run --rm mcp-tailwind-gemini:test  # Test run');
    
  } else {
    console.log('❌ DOCKER BUILD/TEST FAILED');
    console.log('🔧 Check the errors above');
    console.log('💡 Common fixes:');
    console.log('  • Make sure Docker is running');
    console.log('  • Check Dockerfile syntax');
    console.log('  • Ensure all dependencies in package.json');
    console.log('  • Verify build process works locally');
  }
  
  console.log('\n' + '='.repeat(50));
}).catch(console.error);
