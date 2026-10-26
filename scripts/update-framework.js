import { execSync } from 'child_process';

const UPSTREAM_URL = 'https://github.com/SamSeenX/Vanilla-SSG-by-SamSeen.git';

function run(cmd, silent = false) {
  return execSync(cmd, { stdio: silent ? 'pipe' : 'inherit', encoding: 'utf8' });
}

function runSilent(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function updateFramework() {
  console.log('🔄 Checking Git status before update...');

  const isGit = runSilent('git rev-parse --is-inside-work-tree');
  if (!isGit) {
    console.error('❌ Error: This project is not a Git repository. Initialize Git first with `git init`.');
    process.exit(1);
  }

  const status = runSilent('git status --porcelain');
  if (status) {
    console.error('⚠️  Uncommitted changes detected. Please commit or stash your work before running update.');
    process.exit(1);
  }

  const remotes = runSilent('git remote');
  const remoteList = remotes ? remotes.split('\n').map(r => r.trim()) : [];

  if (!remoteList.includes('upstream')) {
    console.log(`📡 Adding upstream remote pointing to ${UPSTREAM_URL}...`);
    run(`git remote add upstream ${UPSTREAM_URL}`);
  }

  console.log('📥 Fetching latest framework changes from upstream/main...');
  run('git fetch upstream');

  console.log('🔀 Merging upstream/main into current branch...');
  try {
    run('git merge upstream/main --allow-unrelated-histories -m "chore: sync framework updates from upstream"');
    console.log('\n✨ Framework update complete! Your site is running the latest VanillaSSG core.\n');
  } catch {
    console.error('\n⚠️  Merge conflicts encountered. Please inspect and resolve modified files with `git status`.');
  }
}

updateFramework();
