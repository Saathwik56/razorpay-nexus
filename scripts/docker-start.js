import { execSync, spawn } from 'child_process';

console.log('🐳 Starting Razorpay Nexus Containerized Production Server...');

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

// Push Prisma database schema and seed merchant data inside container
try {
  console.log('📦 Initializing database schema & seeding demo merchant data...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });
  execSync('npx tsx scripts/seed.ts', { stdio: 'inherit', env: process.env });
} catch (e) {
  console.warn('Database initialization warning:', e);
}

// Start Fastify API Server on port 3001
console.log('🚀 Launching Fastify API Backend on http://0.0.0.0:3001...');
const serverProcess = spawn('npx', ['tsx', 'src/server.ts'], { stdio: 'inherit', env: process.env });

// Start Vite Preview Server serving production bundle on port 5173
console.log('🎨 Serving Vite Production Frontend on http://0.0.0.0:5173...');
const viteProcess = spawn('npx', ['vite', 'preview', '--host', '0.0.0.0', '--port', '5173'], { stdio: 'inherit', env: process.env });

process.on('SIGTERM', () => {
  serverProcess.kill();
  viteProcess.kill();
  process.exit(0);
});
