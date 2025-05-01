const express = require('express');
const axios = require('axios');
require('dotenv').config();
const { logMessage } = require('./utils/logService');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // penting untuk parsing JSON dari POST

const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);

// Verifikasi webhook (GET)
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
  
    if (mode && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  });
  
  // Terima pesan masuk (POST)
  app.post('/webhook', async (req, res) => {
    // ... logic webhook message masuk
  });
  

// Root - untuk cek server
app.get('/', (req, res) => {
  res.send('✅ WhatsApp API Server is running!');
});

// POST /send-message endpoint
app.post('/send-message', async (req, res) => {
  const { to, message } = req.body;

  // Validasi input
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

    res.status(200).json({
      status: 'success',
      wa_id: response.data.messages?.[0]?.id,
      to
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.response?.data || err.message
    });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

  app.post('/webhook', async (req, res) => {
    const body = req.body;
  
    if (body.object) {
      console.log('📩 Webhook received:');
      console.dir(body, { depth: null });
  
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const message = change?.value?.messages?.[0];
      const from = message?.from;
      const text = message?.text?.body;
  
      if (from && text) {
        console.log(`📨 Pesan masuk dari ${from}: "${text}"`);
        logMessage({
            direction: 'incoming',
            from,
            message: text
          });          
  
        // ✅ Kirim balasan otomatis
        try {
          await axios.post(
            `https://graph.facebook.com/v18.0/${process.env.WA_PHONE_NUMBER_ID}/messages`,
            {
              messaging_product: 'whatsapp',
              to: from,
              type: 'text',
              text: { body: `Hai ${text}, ini balasan otomatis dari server kamu 👋` }
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.CLOUD_API_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log(`✅ Auto-reply terkirim ke ${from}`);
        } catch (err) {
            console.error('❌ Gagal kirim auto-reply:');
            console.dir(err.response?.data || err, { depth: null });
          }          
      }
    }
  
    res.sendStatus(200);
  });

