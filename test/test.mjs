// ESM import test
import CustomMailjs from '../dist/esm/index.js';

async function testESM() {
  console.log('Testing ESM import...');
  const mailjs = new CustomMailjs({
    provider: 'mail.tm'
  });
  
  const domains = await mailjs.getDomains();
  console.log('Available domains:', domains);
}

testESM().catch(err => console.error('Error in ESM test:', err));
