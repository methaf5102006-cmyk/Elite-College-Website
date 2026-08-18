require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

sendEmail({
  to: 'methaf5102006@gmail.com',
  subject: 'Test Email 2',
  html: '<p>Ye dusra test email hai</p>'
})
  .then(() => console.log('✅ Email bhej diya gaya'))
  .catch((err) => console.error('❌ Email fail hui:', err));