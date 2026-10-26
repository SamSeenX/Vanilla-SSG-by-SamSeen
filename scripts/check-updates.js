import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CACHE_FILE = path.join(ROOT_DIR, 'node_modules', '.vanilla-ssg-update-cache.json');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const REPO = 'SamSeenX/Vanilla-SSG-by-SamSeen';

function getLocalVersion() {
  try {
    const pkgPath = path.join(ROOT_DIR, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

function readCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (Date.now() - data.timestamp < CACHE_TTL_MS) {
      return data.latestVersion;
    }
  } catch {
    return null;
  }
  return null;
}

function writeCache(latestVersion) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify({ timestamp: Date.now(), latestVersion }), 'utf8');
  } catch {
    // Graceful no-op if node_modules is not writable
  }
}

function compareVersions(v1, v2) {
  const clean1 = (v1 || '').replace(/^v/, '').split('.').map(Number);
  const clean2 = (v2 || '').replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const n1 = clean1[i] || 0;
    const n2 = clean2[i] || 0;
    if (n1 > n2) return 1;
    if (n1 < n2) return -1;
  }
  return 0;
}

async function fetchLatestRelease() {
  const cached = readCache();
  if (cached) return cached;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const url = `https://api.github.com/repos/${REPO}/releases/latest`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'vanilla-ssg-update-checker' }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    const tag = data.tag_name || data.name || '';
    const cleanTag = tag.replace(/^v/, '');
    if (cleanTag) writeCache(cleanTag);
    return cleanTag;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

async function checkUpdates() {
  const current = getLocalVersion();
  const latest = await fetchLatestRelease();

  if (latest && compareVersions(latest, current) > 0) {
    const msg = `⚡ VanillaSSG update available: v${current} → v${latest}\nRun 'npm run update' or merge upstream/main to apply.`;
    const border = '─'.repeat(58);
    console.log(`\n┌${border}┐`);
    msg.split('\n').forEach(line => {
      const padded = line.padEnd(56, ' ');
      console.log(`│  ${padded}│`);
    });
    console.log(`└${border}┘\n`);
  }
}

checkUpdates().catch(() => {});
