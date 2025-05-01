// controllers/messageController.js
const { logMessage } = require('../utils/logService');
const axios = require('axios');
require('dotenv').config();

exports.sendTextMessage = async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ status: 'error', message: 'to dan message harus diisi' });
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.WA_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUD_API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 🟢 Tambahkan logging di sini:
  logMessage({
    direction: 'outgoing',
    to,
    message
  });

    res.status(200).json({
      status: 'success',
      wa_id: response.data.messages?.[0]?.id,
      to
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.response?.data || error.message
    });
  }
};
