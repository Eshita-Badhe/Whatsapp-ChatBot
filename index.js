const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const WHATSAPP_TOKEN = 'EAAJLTHrq43MBQRvhvhFnmFQHZCnKtw2SvFdZA4hyXtn8swvN4RTBE0DkFu6B5XYDiIuKFqpYZAJLUQrvZAGsNZCHdWuGxWWUeEJbh2SapSGELIxYmBYgqvY3knh75B1SXZCD3nZB2FipPOHznbISyGJhAmRtWmpCJ9RgwfTkDWM2sk21vGJ9Ppjhe0DfHouIIZBYFOEHrLWhCrCfpPgRtq9EYoBZAMacKV5GyEZAACNOLvoc8COUGyJZBXvfP0VrFknrxWOqZAfw3JTt7ZBxZCV6zI2nWGLKgc7QZDZD';
const PHONE_NUMBER_ID = '980860085100639';
const VERIFY_TOKEN = 'my_secret_token_hello';

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log('✅ Webhook verified');
    res.status(200).send(req.query['hub.challenge']);
    return;
  }
  res.status(200).send('OK');
});

app.post('/webhook', async (req, res) => {
  console.log('📨 Message received:', JSON.stringify(req.body, null, 2));
  
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (message) {
      const from = message.from;
      const text = message.text?.body || 'Media message';
      console.log(`🎉 FROM ${from}: ${text}`);
      
      await sendReply(from, text);
    }
  } catch (e) {
    console.error('Error:', e);
  }
  
  res.status(200).send('EVENT_RECEIVED');
});

async function sendReply(to, msg) {
  try {
    const res = await axios.post(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: `Hello! 👋 You said: "${msg}"` }
    }, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Reply sent:', res.data.messages[0].id);
  } catch (e) {
    console.error('Send error:', e.response?.data);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Bot running on port ${PORT}`);
});
