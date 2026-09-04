import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('P0 Security Audit: Frontend Secret Isolation & Production Bundle Inspection (Item 1)', () => {
  it('verifies client configuration strictly exposes public Key ID and ZERO secret keys', async () => {
    const { razorpayService } = await import('../src/services/razorpayClient');
    const config = razorpayService.getConfig();

    expect(config.keyId).toBeDefined();
    expect(config.keyId).toMatch(/^rzp_test_/);
    expect((config as any).keySecret).toBeUndefined();
    expect((config as any).webhookSecret).toBeUndefined();
    expect((config as any).RAZORPAY_KEY_SECRET).toBeUndefined();
  });

  it('verifies production frontend dist bundle JS contains zero environment secret assignments', () => {
    const distPath = path.resolve(__dirname, '../dist/assets');
    
    if (fs.existsSync(distPath)) {
      const jsFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));
      expect(jsFiles.length).toBeGreaterThan(0);

      for (const file of jsFiles) {
        const content = fs.readFileSync(path.join(distPath, file), 'utf8');
        expect(content).not.toContain('RAZORPAY_KEY_SECRET=');
        expect(content).not.toContain('RAZORPAY_WEBHOOK_SECRET=');
        expect(content).not.toContain('sec_test_demo_secret_99812');
        expect(content).not.toContain('whsec_test_demo_webhook_99812');
      }
    }
  });
});
