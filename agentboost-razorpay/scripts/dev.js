import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

console.log('🚀 Starting AgentBoost Full-Stack Development Servers...');

// 1. Start Vite Frontend Server (Port 5173)
const viteProcess = spawn(npxCmd, ['vite'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

// 2. Start Fastify API Backend Server (Port 3001)
const apiProcess = spawn(npxCmd, ['tsx', 'src/server.ts'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: true
});

const handleExit = () => {
  viteProcess.kill();
  apiProcess.kill();
  process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('exit', handleExit);
