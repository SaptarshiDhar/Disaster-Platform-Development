/**
 * Root `preinstall` guard.
 *
 * Replaces the previous `sh -c '...'` one-liner, which failed on Windows
 * because pnpm runs lifecycle scripts through cmd.exe, where `sh` does not
 * exist. Node is available on every platform the team uses, so this version
 * behaves identically on Windows, macOS, Linux and Replit.
 *
 * Responsibilities, unchanged from the original:
 *   1. Remove competing lockfiles so only pnpm-lock.yaml is authoritative.
 *   2. Refuse to run under npm or yarn.
 */

import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

for (const lockfile of ['package-lock.json', 'yarn.lock']) {
  rmSync(path.join(repoRoot, lockfile), { force: true });
}

const userAgent = process.env.npm_config_user_agent ?? '';

if (!userAgent.startsWith('pnpm/')) {
  console.error(
    'This repository is a pnpm workspace. Use pnpm instead.\n' +
      'If pnpm is not installed, Corepack ships with Node:\n' +
      '    corepack pnpm install',
  );
  process.exit(1);
}
