import crypto from 'crypto';
const secret = crypto.randomBytes(32).toString('base64');
console.log('\n=== NEXTAUTH_SECRET ===');
console.log(secret);
console.log('\nCopy this value to your Render environment variables');
