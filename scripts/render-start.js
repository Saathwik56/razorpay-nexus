import { execSync, spawn } from 'child_process';

console.log('🚀 Starting Razorpay Nexus on Render...');

// Ensure /data directory exists for persistent SQLite
try {
  execSync('mkdir -p /data', { stdio: 'inherit' });
} catch (e) {
  // May already exist
}

// Run Prisma migrations and seed demo data
try {
  console.log('📦 Running Prisma db push...');
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  console.log('🌱 Seeding demo merchant data...');
  execSync('npx tsx scripts/seed.ts', { stdio: 'inherit' });
} catch (e) {
  console.warn('⚠️  DB init warning (may already be seeded):', e.message);
}

// Start Fastify API on port 3001
console.log('✅ Launching Fastify API on 0.0.0.0:3001...');
const server = spawn('npx', ['tsx', 'src/server.ts'], {
  stdio: 'inherit',
  env: { ...process.env }
});

server.on('exit', (code) => {
  console.error(`Fastify process exited with code ${code}`);
  process.exit(code ?? 1);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit(0);
});
