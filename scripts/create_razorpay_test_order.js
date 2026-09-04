import fetch from 'node-[#node-fetch]';

const keyId = 'rzp_test_TUojyyzKJGFLWv';
const keySecret = '9p5WhChmL5DPoIssSxQ5h3Vc';
const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

async function createTestOrders() {
  console.log('🚀 Creating live Razorpay Test Mode Orders using Key ID:', keyId);

  const testScenarios = [
    { amount: 269900, receipt: 'rcpt_agentboost_whey_101', note: 'AI Buyer: Whey Protein + Shaker Bundle' },
    { amount: 149900, receipt: 'rcpt_agentboost_smartwatch_202', note: 'AI Buyer: Smart Fitness Tracker' },
    { amount: 39900, receipt: 'rcpt_agentboost_shaker_303', note: 'AI Buyer: Stainless Steel Pro Shaker' }
  ];

  for (const scenario of testScenarios) {
    try {
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
          amount: scenario.amount,
          currency: 'INR',
          receipt: scenario.receipt,
          notes: {
            agent: 'AgentBoost-Razorpay-OS',
            description: scenario.note,
            policy_verified: 'true',
            autonomous_limit_cap: '5000'
          }
        })
      });

      if (response.ok) {
        const order = await response.json();
        console.log(`✅ SUCCESS! Created Razorpay Order on Dashboard:`);
        console.log(`   Order ID: ${order.id}`);
        console.log(`   Amount: ₹${order.amount / 100} INR`);
        console.log(`   Receipt: ${order.receipt}`);
        console.log(`   Status: ${order.status}`);
        console.log(`-----------------------------------------------`);
      } else {
        const errText = await response.text();
        console.error(`❌ Razorpay API Error (HTTP ${response.status}):`, errText);
      }
    } catch (e) {
      console.error('❌ Network Exception:', e);
    }
  }
}

createTestOrders();
