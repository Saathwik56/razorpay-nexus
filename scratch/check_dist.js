import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist/assets');
const files = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));
for (const file of files) {
  const content = fs.readFileSync(path.join(distPath, file), 'utf8');
  ['RAZORPAY_KEY_SECRET=', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET='].forEach(str => {
    const idx = content.indexOf(str);
    if (idx !== -1) {
      console.log(`Found "${str}" in ${file} at index ${idx}:`);
      console.log(content.substring(Math.max(0, idx - 50), idx + 100));
    }
  });
}
