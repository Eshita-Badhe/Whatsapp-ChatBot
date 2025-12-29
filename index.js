const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// ✅ REPLIT HEALTH CHECK - REQUIRED!
app.get('/', (req, res) => {
  res.status(200).json({ status: 'WhatsApp Bot OK' });
});

const WHATSAPP_TOKEN = 'EAAJLTHrq43MBQRvhvhFnmFQHZCnKtw2SvFdZA4hyXtn8swvN4RTBE0DkFu6B5XYDiIuKFqpYZAJLUQrvZAGsNZCHdWuGxWWUeEJbh2SapSGELIxYmBYgqvY3knh75B1SXZCD3nZB2FipPOHznbISyGJhAmRtWmpCJ9RgwfTkDWM2sk21vGJ9Ppjhe0DfHouIIZBYFOEHrLWhCrCfpPgRtq9EYoBZAMacKV5GyEZAACNOLvoc8COUGyJZBXvfP0VrFknrxWOqZAfw3JTt7ZBxZCV6zI2nWGLKgc7QZDZD';
const PHONE_NUMBER_ID = '980860085100639';
const VERIFY_TOKEN = 'my_secret_token_hello';

app.get('/webhook', (req, res) => {
  console.log('🔍 Webhook verification:', req.query['hub.verify_token']?.substring(0,10));
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log('✅ WEBHOOK VERIFIED!');
    res.status(200).send(req.query['hub.challenge']);
    return;
  }
  res.status(200).send('OK');
});

app.post('/webhook', async (req, res) => {
  console.log('📨 WHATSAPP MESSAGE!');
  console.log(JSON.stringify(req.body, null, 2));
  
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (msg) {
    const from = msg.from;
    const text = msg.text?.body || 'Media/Other';
    console.log(`🎉 FROM ${from}: "${text}"`);
    await sendReply(from, text);
  }
  
  res.status(200).send('EVENT_RECEIVED');
});

async function sendReply(to, text) {
  try {
    const res = await axios.post(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: 'whatsapp',
      to, type: 'text', 
      text: { body: `Hello! 👋 You said: "${text}"\n\nCustomer Services Bot is live!` }
    }, { 
      headers: { 
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`, 
        'Content-Type': 'application/json' 
      } 
    });
    console.log('✅ REPLY SENT:', res.data.messages[0].id);
  } catch(e) {
    console.error('❌ Send failed:', e.response?.data || e.message);
  }
}

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ status: 'Bot ready', phone: PHONE_NUMBER_ID });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 WhatsApp Bot LIVE on port ${PORT}`);
  console.log(`📱 Root: https://your-repl.repl.co/`);
  console.log(`🔗 Webhook: https://your-repl.repl.co/webhook`);
});
