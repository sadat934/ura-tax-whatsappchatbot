import express from 'express';
import { config } from './config.js';
import { createChatbot } from './bot/chatbot.js';
import { JsonUserStore } from './storage/jsonUserStore.js';
import { TaxEstimator } from './services/taxEstimator.js';
import { UraApiClient } from './services/uraApiClient.js';
import { startBaileysAdapter } from './adapters/baileysAdapter.js';

const userStore = new JsonUserStore(config.dataFile);
const taxEstimator = new TaxEstimator();
const uraApiClient = new UraApiClient(config.uraApi);
const chatbot = createChatbot({ userStore, taxEstimator, uraApiClient });

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, mode: config.botMode, provider: config.whatsappProvider });
});

app.post('/simulate-message', async (req, res) => {
  const from = req.body.from || 'console-user';
  const text = req.body.text || '';
  const reply = await chatbot.handleMessage({ from, text });
  res.json({ reply });
});

app.listen(config.port, () => {
  console.log(`URA Tax Chatbot API running on http://localhost:${config.port}`);
});

if (config.botMode === 'whatsapp' && config.whatsappProvider === 'baileys') {
  await startBaileysAdapter({ chatbot });
}
