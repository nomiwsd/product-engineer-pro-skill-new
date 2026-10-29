import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('🔍 Running relative Markdown link checker...');

const markdownFiles = [];

function getAllMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        getAllMarkdownFiles(fullPath);
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      markdownFiles.push(fullPath);
    }
  }
}

// Prefer the files git would commit (tracked plus new, not ignored), so local-only
// folders such as private notes or local skill installs do not change the result.
const listed = spawnSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', '*.md'], { cwd: ROOT, encoding: 'utf8' });
if (listed.status === 0) {
  markdownFiles.push(...listed.stdout.split('\0').filter(Boolean).map((rel) => path.join(ROOT, rel)).filter((file) => fs.existsSync(file)));
} else {
  getAllMarkdownFiles(ROOT);
}

function slugify(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const errors = [];

const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;

for (const filePath of markdownFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relFilePath = path.relative(ROOT, filePath);
  let match;

  while ((match = LINK_REGEX.exec(content)) !== null) {
    const linkText = match[1];
    const linkTarget = match[2].trim();

    // Skip web URLs or mailto or pure anchor links
    if (
      linkTarget.startsWith('http://') ||
      linkTarget.startsWith('https://') ||
      linkTarget.startsWith('mailto:') ||
      linkTarget.startsWith('#')
    ) {
      continue;
    }

    const [targetPath, anchor] = linkTarget.split('#');
    const resolvedPath = path.resolve(path.dirname(filePath), targetPath);

    if (!fs.existsSync(resolvedPath)) {
      errors.push(`Broken link in "${relFilePath}": "${linkText}" -> target "${targetPath}" does not exist`);
      continue;
    }

    if (anchor) {
      const targetContent = fs.readFileSync(resolvedPath, 'utf8');
      const headings = targetContent
        .split('\n')
        .filter((line) => /^#+\s+/.test(line))
        .map((line) => line.replace(/^#+\s+/, '').trim());

      const slugs = headings.map(slugify);
      if (!slugs.includes(anchor.toLowerCase())) {
        // Warning or error for anchor mismatch
        errors.push(`Broken anchor in "${relFilePath}": "${linkText}" -> #${anchor} not found in ${targetPath}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Link verification failed (${errors.length} broken links found):`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(`✅ Link verification passed! Checked ${markdownFiles.length} Markdown files with 0 broken links.`);
