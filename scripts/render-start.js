import { execSync, spawn } from 'child_process';

console.log('🚀 Starting Razorpay Nexus on Render...');

// Ensure DATABASE_URL is set - use /tmp for free tier (no persistent disk)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:/tmp/dev.db';
  console.log('ℹ️  DATABASE_URL not set, defaulting to file:/tmp/dev.db');
}
console.log('📁 DATABASE_URL:', process.env.DATABASE_URL);

// Run Prisma DB Push (creates/migrates the SQLite DB)
try {
  console.log('📦 Running prisma db push...');
  execSync('npx prisma db push --accept-data-loss', {
    stdio: 'inherit',
    env: process.env
  });
  console.log('✅ Prisma DB push done');
} catch (e) {
  console.warn('⚠️  Prisma db push warning (non-fatal):', e.message);
}

// Seed demo data
try {
  console.log('🌱 Seeding demo merchant data...');
  execSync('npx tsx scripts/seed.ts', {
    stdio: 'inherit',
    env: process.env
  });
  console.log('✅ Seed complete');
} catch (e) {
  console.warn('⚠️  Seed warning (non-fatal):', e.message);
}

// Start Fastify server
const port = process.env.PORT || '3001';
console.log(`✅ Launching Fastify API on 0.0.0.0:${port}...`);

const server = spawn('npx', ['tsx', 'src/server.ts'], {
  stdio: 'inherit',
  env: process.env
});

server.on('exit', (code) => {
  console.error(`❌ Fastify process exited with code ${code}`);
  process.exit(code ?? 1);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit(0);
});
