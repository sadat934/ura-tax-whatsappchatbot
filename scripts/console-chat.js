import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { config } from '../src/config.js';
import { createChatbot } from '../src/bot/chatbot.js';
import { JsonUserStore } from '../src/storage/jsonUserStore.js';
import { TaxEstimator } from '../src/services/taxEstimator.js';
import { UraApiClient } from '../src/services/uraApiClient.js';

const chatbot = createChatbot({
  userStore: new JsonUserStore(config.dataFile),
  taxEstimator: new TaxEstimator(),
  uraApiClient: new UraApiClient(config.uraApi),
});

const rl = readline.createInterface({ input, output });
const from = 'console-user';

console.log('URA Tax Chatbot console test. Type "menu" to begin or "exit" to quit.');

while (true) {
  const text = await rl.question('You: ');
  if (text.trim().toLowerCase() === 'exit') break;
  const reply = await chatbot.handleMessage({ from, text });
  console.log(`Bot: ${reply}\n`);
}

rl.close();
