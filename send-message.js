const axios = require('axios');
require('dotenv').config();

const token = process.env.CLOUD_API_ACCESS_TOKEN;
const phoneId = process.env.WA_PHONE_NUMBER_ID;

const recipientPhoneNumber = '6281944131818';
const message = 'Halo dari wa-standalone-app (tanpa SDK)! 💬';

(async () => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: recipientPhoneNumber,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Pesan berhasil dikirim:');
    console.dir(response.data, { depth: null });
  } catch (err) {
    console.error('❌ Gagal mengirim pesan:');
    console.dir(err.response?.data || err, { depth: null });
  }
})();
