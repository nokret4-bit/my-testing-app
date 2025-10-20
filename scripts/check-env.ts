console.log('🔍 Checking environment variables...\n');

console.log('SMTP_HOST:', process.env.SMTP_HOST || '❌ NOT SET');
console.log('SMTP_PORT:', process.env.SMTP_PORT || '❌ NOT SET');
console.log('SMTP_USER:', process.env.SMTP_USER || '❌ NOT SET');
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '✅ SET (hidden)' : '❌ NOT SET');
console.log('SMTP_FROM:', process.env.SMTP_FROM || '❌ NOT SET');
console.log('\nPAYMONGO_SECRET_KEY:', process.env.PAYMONGO_SECRET_KEY ? '✅ SET' : '❌ NOT SET');
console.log('PAYMONGO_PUBLIC_KEY:', process.env.PAYMONGO_PUBLIC_KEY ? '✅ SET' : '❌ NOT SET');
console.log('\nNEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET');
