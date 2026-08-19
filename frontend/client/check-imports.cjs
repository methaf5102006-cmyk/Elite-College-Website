// check-imports.js
// Usage: node check-imports.js
// Run this from inside your `client` folder (same level as package.json)
// It scans src/ for relative imports and checks if the actual file/folder
// on disk matches the EXACT case used in the import statement.

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(process.cwd(), 'src');
const EXTENSIONS = ['', '.jsx', '.js', '.tsx', '.ts'];
const INDEX_FILES = ['index.jsx', 'index.js', 'index.tsx', 'index.ts'];

let mismatches = [];
let missing = [];

function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walk(fullPath, fileList);
    } else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// Get the real, on-disk case of every path segment
function getRealCasePath(targetPath) {
  const parts = targetPath.split(path.sep);
  let current = path.parse(targetPath).root || parts[0];
  let builtPath = path.isAbsolute(targetPath) ? path.parse(targetPath).root : '';
  let segments = path.isAbsolute(targetPath)
    ? targetPath.slice(path.parse(targetPath).root.length).split(path.sep)
    : targetPath.split(path.sep);

  let real = path.isAbsolute(targetPath) ? path.parse(targetPath).root : '.';

  for (const seg of segments) {
    if (!seg) continue;
    let dirEntries;
    try {
      dirEntries = fs.readdirSync(real);
    } catch (e) {
      return null; // path doesn't exist at all
    }
    const match = dirEntries.find(e => e === seg);
    const caseInsensitiveMatch = dirEntries.find(e => e.toLowerCase() === seg.toLowerCase());
    if (match) {
      real = path.join(real, match);
    } else if (caseInsensitiveMatch) {
      real = path.join(real, caseInsensitiveMatch);
      return { real, actualSegment: caseInsensitiveMatch, wantedSegment: seg, found: true, caseMismatch: true };
    } else {
      return { found: false, wantedSegment: seg, real };
    }
  }
  return { real, found: true, caseMismatch: false };
}

function resolveImport(fromFile, importPath) {
  const baseDir = path.dirname(fromFile);
  const targetBase = path.resolve(baseDir, importPath);

  // Try the path as-is, then with extensions, then as index files in a directory
  const candidates = [];
  for (const ext of EXTENSIONS) {
    candidates.push(targetBase + ext);
  }
  for (const idx of INDEX_FILES) {
    candidates.push(path.join(targetBase, idx));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      // exists on this (possibly case-insensitive) filesystem -- verify exact case
      const check = getRealCasePathFull(candidate);
      if (check.exists && !check.caseMismatch) {
        return { ok: true };
      } else if (check.exists && check.caseMismatch) {
        return { ok: false, reason: 'case', wanted: candidate, actual: check.actualPath };
      }
    }
  }
  return { ok: false, reason: 'missing' };
}

// Walks each segment of an absolute path and confirms exact case on disk
function getRealCasePathFull(absPath) {
  const root = path.parse(absPath).root;
  const segments = absPath.slice(root.length).split(path.sep).filter(Boolean);
  let current = root;
  let caseMismatch = false;
  let actualSegments = [];

  for (const seg of segments) {
    let entries;
    try {
      entries = fs.readdirSync(current);
    } catch (e) {
      return { exists: false };
    }
    const exact = entries.find(e => e === seg);
    if (exact) {
      actualSegments.push(exact);
      current = path.join(current, exact);
      continue;
    }
    const ci = entries.find(e => e.toLowerCase() === seg.toLowerCase());
    if (ci) {
      actualSegments.push(ci);
      current = path.join(current, ci);
      caseMismatch = true;
      continue;
    }
    return { exists: false };
  }
  return { exists: true, caseMismatch, actualPath: root + actualSegments.join(path.sep) };
}

function extractImports(content) {
  const importRegex = /(?:import\s+[^'"]*from\s+|import\s*\(\s*|require\s*\(\s*)['"](\.[^'"]+)['"]/g;
  const results = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    results.push(match[1]);
  }
  return results;
}

if (!fs.existsSync(SRC_DIR)) {
  console.error('Could not find a "src" folder in the current directory. Run this from your client/ folder.');
  process.exit(1);
}

const files = walk(SRC_DIR);
console.log(`Scanning ${files.length} files in src/...\n`);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const imports = extractImports(content);
  for (const imp of imports) {
    const result = resolveImport(file, imp);
    const relFile = path.relative(process.cwd(), file);
    if (!result.ok) {
      if (result.reason === 'case') {
        mismatches.push({
          file: relFile,
          import: imp,
          actualPath: path.relative(process.cwd(), result.actual),
        });
      } else {
        missing.push({ file: relFile, import: imp });
      }
    }
  }
}

console.log('========== CASE MISMATCHES (fix these) ==========');
if (mismatches.length === 0) {
  console.log('None found!');
} else {
  for (const m of mismatches) {
    console.log(`\nIn file: ${m.file}`);
    console.log(`  imports: "${m.import}"`);
    console.log(`  actual file on disk: ${m.actualPath}`);
  }
}

console.log('\n========== NOT FOUND AT ALL (check these manually) ==========');
if (missing.length === 0) {
  console.log('None found!');
} else {
  for (const m of missing) {
    console.log(`\nIn file: ${m.file}`);
    console.log(`  imports: "${m.import}" -- no matching file found`);
  }
}

console.log(`\nDone. ${mismatches.length} case mismatch(es), ${missing.length} missing import(s).`);