// CommonJS require test
// Sử dụng dynamic import để làm việc với module ESM
(async () => {
  try {
    console.log('Testing CommonJS import...');
    // Import module
    const mailtmProxy = await import('../dist/cjs/index.cjs');
    // Truy cập thành phần CustomMailjs từ exports
    const CustomMailjs = mailtmProxy.CustomMailjs;
    
    const mailjs = new CustomMailjs({
      provider: 'mail.tm'
    });
    
    const domains = await mailjs.getDomains();
    console.log('Available domains:', domains);
  } catch (err) {
    console.error('Error in CommonJS test:', err);
  }
})();
