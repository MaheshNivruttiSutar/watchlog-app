import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeHostAndRemote, formatReport } from './mf-singletons.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const hostPath = join(root, 'docs/mf-host-stats.json');
const remotePath = join(root, 'docs/mf-remote-stats.json');
const outPath = join(root, 'docs/mf-singleton-report.json');

function loadStats(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot read webpack stats at ${filePath}: ${message}`);
  }
}

const result = analyzeHostAndRemote({
  host: loadStats(hostPath),
  remote: loadStats(remotePath),
});

writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(formatReport(result));
console.log(`Wrote ${outPath}`);

if (!result.ok) {
  process.exit(1);
}
