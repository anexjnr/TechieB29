#!/usr/bin/env node
const { spawnSync } = require('child_process');

function run(cmd, args, opts = {}) {
  console.log('> ', cmd, args.join(' '));
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts });
  return r;
}

console.log('Starting resilient DB setup...');

// 1) Try to run prisma migrate dev
let res = run('npx', ['prisma', 'migrate', 'dev', '--name', 'init']);
if (res.status !== 0) {
  console.warn('\nprisma migrate failed (this can happen if the DB is unreachable).');
  console.warn('Proceeding to run prisma generate and seed as a best-effort fallback.');
}

// 2) Always run prisma generate
res = run('npx', ['prisma', 'generate']);
if (res.status !== 0) {
  console.error('prisma generate failed. Continuing, but this may cause runtime errors.');
}

// 3) Run seed (try with tsx or node)
res = run('npx', ['tsx', 'server/seed.ts']);
if (res.status !== 0) {
  console.warn('tsx seed failed, trying node on transpiled script (if present)');
  // try node dist option
  const tryNode = run('node', ['dist/server/seed.mjs']);
  if (tryNode.status !== 0) {
    console.warn('Seed could not be executed. If you are running locally, please run `npm run db:setup` or manually run prisma migrations.');
  }
}

console.log('\nDB setup script finished (non-zero steps were tolerated).');
process.exit(0);
