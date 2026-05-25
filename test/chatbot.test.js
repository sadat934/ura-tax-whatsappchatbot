import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatbot } from '../src/bot/chatbot.js';
import { TaxEstimator } from '../src/services/taxEstimator.js';
import { UraApiClient } from '../src/services/uraApiClient.js';

class MemoryUserStore {
  users = {};

  async getOrCreate(phoneNumber) {
    if (!this.users[phoneNumber]) {
      this.users[phoneNumber] = { phoneNumber };
    }
    return this.users[phoneNumber];
  }

  async save(user) {
    this.users[user.phoneNumber] = { ...user };
  }
}

test('registers a user and returns a fallback tax estimate', async () => {
  const chatbot = createChatbot({
    userStore: new MemoryUserStore(),
    taxEstimator: new TaxEstimator(),
    uraApiClient: new UraApiClient({ baseUrl: '', apiKey: '' }),
  });

  const from = 'test-user';

  assert.match(await chatbot.handleMessage({ from, text: 'menu' }), /Welcome/);
  assert.match(await chatbot.handleMessage({ from, text: '1' }), /TIN/);
  assert.match(await chatbot.handleMessage({ from, text: '1000123456' }), /business type/i);
  assert.match(await chatbot.handleMessage({ from, text: '1' }), /turnover/i);
  assert.match(await chatbot.handleMessage({ from, text: '2500000' }), /tax types/i);
  assert.match(await chatbot.handleMessage({ from, text: 'VAT, income tax' }), /Profile saved/);

  const estimate = await chatbot.handleMessage({ from, text: '2' });
  assert.match(estimate, /Estimated tax summary/);
  assert.match(estimate, /UGX/);

  const balance = await chatbot.handleMessage({ from, text: '3' });
  assert.match(balance, /URA API access is not active yet/);
});
