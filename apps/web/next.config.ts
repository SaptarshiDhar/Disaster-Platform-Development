import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { NextConfig } from 'next';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * RAKSHA web application — Next.js configuration.
 *
 * Deliberately minimal: Vercel's zero-configuration Next.js support handles
 * build, routing and runtime selection. Add options here only when a concrete
 * requirement appears (e.g. remote image hosts for basemap thumbnails).
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // This app lives inside a pnpm workspace. Tracing from the repo root keeps
  // file tracing correct when Vercel's Root Directory is set to apps/web.
  outputFileTracingRoot: path.join(here, '..', '..'),
};

export default nextConfig;
