#!/usr/bin/env node

/**
 * MCP Server Health & API Test Script
 * - Kiểm tra endpoint, health, tool list, và phản hồi cơ bản
 */

import http from 'http';

const MCP_HOST = process.env.MCP_HOST || 'localhost';
const MCP_PORT = process.env.MCP_PORT || 3000;
const BASE_URL = `http://${MCP_HOST}:${MCP_PORT}`;

function log(msg) {
  console.log(`[MCP TEST] ${msg}`);
}

async function fetchJSON(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: MCP_HOST,
      port: MCP_PORT,
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  log(`🔎 Checking MCP server at ${BASE_URL}`);
  let ok = true;

  // 1. Health check
  try {
    const res = await fetchJSON('/health');
    if (res.status === 'ok' || res.healthy) {
      log('✅ Health endpoint: OK');
    } else {
      log('❌ Health endpoint: FAIL');
      ok = false;
    }
  } catch (e) {
    log('❌ Health endpoint: ERROR');
    ok = false;
  }

  // 2. Tool list
  try {
    const res = await fetchJSON('/tools');
    if (Array.isArray(res.tools) && res.tools.length > 0) {
      log(`✅ Tool list: ${res.tools.length} tools found`);
    } else {
      log('❌ Tool list: No tools found');
      ok = false;
    }
  } catch (e) {
    log('❌ Tool list: ERROR');
    ok = false;
  }

  // 3. Basic tool call (if available)
  try {
    const res = await fetchJSON('/tools/generate_component', 'POST', { prompt: 'button' });
    if (res && res.component) {
      log('✅ generate_component: OK');
    } else {
      log('❌ generate_component: FAIL');
      ok = false;
    }
  } catch (e) {
    log('❌ generate_component: ERROR');
    ok = false;
  }

  // 4. Final result
  if (ok) {
    log('🎉 MCP server is healthy and functional!');
    process.exit(0);
  } else {
    log('⚠️ MCP server test failed. Check logs and configuration.');
    process.exit(1);
  }
}

main();
