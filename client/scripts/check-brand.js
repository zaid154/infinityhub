#!/usr/bin/env node
/**
 * CI Brand Check Script
 * Verifies that zero hardcoded legacy brand names ("Nova Infotech", "NOVA INFOTECH", "novainfotech")
 * exist across the active client codebase outside the designated fallback configuration file.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_SRC = path.resolve(__dirname, '../src');

// Allowed files containing legitimate fallback defaults or tokens
const ALLOWED_FILES = [
  path.resolve(CLIENT_SRC, 'config/company.js')
];

// Patterns that indicate hardcoded legacy brand values
const FORBIDDEN_PATTERNS = [
  /\bNova\s+Infotech\b/i,
  /\bNOVA\s+INFOTECH\b/,
  /\bnovainfotech\.in\b/i,
  /\bnovainfotech\b/i
];

let totalViolations = 0;
const scannedFiles = [];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile() && /\.(jsx?|tsx?|html|css)$/.test(entry.name)) {
      if (ALLOWED_FILES.includes(fullPath)) {
        continue;
      }
      scannedFiles.push(fullPath);
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(line)) {
        console.error(`❌ [BRAND LEAK] ${path.relative(CLIENT_SRC, filePath)}:${index + 1}`);
        console.error(`   Found forbidden match: "${line.trim()}"`);
        totalViolations++;
      }
    }
  });
}

console.log('🔍 Executing CI Brand Integrity Audit on client codebase...');
scanDirectory(CLIENT_SRC);

console.log(`\n📊 Scanned ${scannedFiles.length} files in client/src.`);
if (totalViolations > 0) {
  console.error(`\n🚨 AUDIT FAILED: Found ${totalViolations} hardcoded brand violations!`);
  console.error('All brand references must be dynamically loaded from useCompany() / SiteSettings.');
  process.exit(1);
} else {
  console.log('✅ AUDIT PASSED: Zero hardcoded brand violations detected. Brand identity is 100% dynamic.');
  process.exit(0);
}
