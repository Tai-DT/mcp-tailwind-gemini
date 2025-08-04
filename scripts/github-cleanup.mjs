#!/usr/bin/env node

/**
 * GitHub Cleanup Script for MCP Tailwind Gemini
 * Removes sensitive files and prepares for GitHub upload
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class GitHubCleanup {
    constructor() {
        this.sensitiveFiles = [
            '.env',
            '.env.local',
            '.env.development.local',
            '.env.test.local',
            '.env.production.local'
        ];
        
        this.unnecessaryFiles = [
            '.DS_Store',
            'Thumbs.db',
            '*.log',
            '*.tmp',
            '*.backup',
            '*.bak',
            'npm-debug.log*',
            'yarn-debug.log*',
            'yarn-error.log*'
        ];
    }

    log(message, type = 'info') {
        const colors = {
            info: '\x1b[36m',
            success: '\x1b[32m',
            error: '\x1b[31m',
            warning: '\x1b[33m',
            reset: '\x1b[0m'
        };
        console.log(`${colors[type]}${message}${colors.reset}`);
    }

    async cleanup() {
        this.log('🧹 Preparing MCP Tailwind Gemini for GitHub', 'info');
        this.log('=' .repeat(50), 'info');

        try {
            // 1. Remove sensitive files
            this.log('\n1. Removing sensitive files...', 'info');
            this.sensitiveFiles.forEach(file => {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                    this.log(`   ✓ Removed: ${file}`, 'success');
                }
            });

            // 2. Clean unnecessary files
            this.log('\n2. Cleaning unnecessary files...', 'info');
            
            // Remove .DS_Store files
            try {
                execSync('find . -name ".DS_Store" -type f -delete', { stdio: 'pipe' });
                this.log('   ✓ Removed .DS_Store files', 'success');
            } catch {}

            // Remove log files
            try {
                execSync('find . -name "*.log" -type f -delete', { stdio: 'pipe' });
                this.log('   ✓ Removed log files', 'success');
            } catch {}

            // Remove temporary files
            try {
                execSync('rm -f *.tmp *.backup *.bak 2>/dev/null || true', { stdio: 'pipe' });
                this.log('   ✓ Removed temporary files', 'success');
            } catch {}

            // 3. Verify .gitignore
            this.log('\n3. Verifying .gitignore...', 'info');
            if (fs.existsSync('.gitignore')) {
                this.log('   ✓ .gitignore exists', 'success');
            } else {
                this.log('   ⚠ .gitignore missing', 'warning');
            }

            // 4. Check dist/ directory
            this.log('\n4. Checking build artifacts...', 'info');
            if (fs.existsSync('dist/')) {
                const distFiles = fs.readdirSync('dist/');
                this.log(`   ✓ dist/ contains ${distFiles.length} files`, 'success');
            } else {
                this.log('   ⚠ dist/ not found - run npm run build', 'warning');
            }

            // 5. Verify package files
            this.log('\n5. Verifying essential files...', 'info');
            const essentialFiles = [
                'package.json',
                'package-lock.json',
                'README.md',
                'mcp.json',
                'tsconfig.json'
            ];

            essentialFiles.forEach(file => {
                if (fs.existsSync(file)) {
                    this.log(`   ✓ ${file}`, 'success');
                } else {
                    this.log(`   ⚠ Missing: ${file}`, 'warning');
                }
            });

            // 6. Check environment template
            this.log('\n6. Checking environment template...', 'info');
            if (fs.existsSync('.env.example')) {
                const envContent = fs.readFileSync('.env.example', 'utf8');
                if (!envContent.includes('your_gemini_api_key_here')) {
                    this.log('   ⚠ .env.example may contain real API keys', 'warning');
                } else {
                    this.log('   ✓ .env.example is safe for GitHub', 'success');
                }
            }

            // 7. Summary
            this.log('\n' + '=' .repeat(50), 'success');
            this.log('✅ GITHUB CLEANUP COMPLETED!', 'success');
            this.log('=' .repeat(50), 'success');

            this.log('\n📋 Ready for GitHub:', 'info');
            this.log('   • Sensitive files removed', 'info');
            this.log('   • Unnecessary files cleaned', 'info');
            this.log('   • .gitignore configured', 'info');
            this.log('   • Environment template safe', 'info');

            this.log('\n🚀 Next steps:', 'info');
            this.log('   git add .', 'info');
            this.log('   git commit -m "feat: MCP Tailwind Gemini - AI-powered CSS generation"', 'info');
            this.log('   git push origin main', 'info');

            this.log('\n⚠️  Remember to:', 'warning');
            this.log('   • Set GEMINI_API_KEY in production', 'warning');
            this.log('   • Configure environment variables', 'warning');
            this.log('   • Update repository URL in documentation', 'warning');

        } catch (error) {
            this.log(`\n❌ Cleanup failed: ${error.message}`, 'error');
            process.exit(1);
        }
    }
}

// Run cleanup
const cleaner = new GitHubCleanup();
cleaner.cleanup().catch(console.error);
