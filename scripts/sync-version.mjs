import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('🔍 Checking version synchronicity...');

const pkgPath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

const errors = [];
const shouldFix = process.argv.includes('--fix');

// Check CHANGELOG.md
const changelogPath = path.join(ROOT, 'CHANGELOG.md');
if (fs.existsSync(changelogPath)) {
  const changelogContent = fs.readFileSync(changelogPath, 'utf8');
  if (!changelogContent.includes(`[${version}]`)) {
    errors.push(`CHANGELOG.md missing release section for version [${version}]`);
  }
}

// Check bin/cli.js default fallback
const cliPath = path.join(ROOT, 'bin', 'cli.js');
if (fs.existsSync(cliPath)) {
  const cliContent = fs.readFileSync(cliPath, 'utf8');
  if (!cliContent.includes(`"${version}"`) && !cliContent.includes(`'${version}'`)) {
    if (shouldFix) {
      const updated = cliContent.replace(/(?:version|DEFAULT_VERSION)\s*[:=]\s*['"][^'"]+['"]/, `DEFAULT_VERSION = "${version}"`);
      fs.writeFileSync(cliPath, updated, 'utf8');
      console.log(`  🔧 Fixed fallback version in bin/cli.js to ${version}`);
    } else {
      errors.push(`bin/cli.js fallback version does not match package.json version ${version}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Version sync check failed:`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error(`\nRun "node scripts/sync-version.mjs --fix" to automatically sync version fields.`);
  process.exit(1);
}

console.log(`✅ Version sync check passed! All package components in sync with version ${version}.`);
