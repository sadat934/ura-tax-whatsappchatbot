import axios from 'axios';

export class UraApiClient {
  constructor({ baseUrl, apiKey }) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  get enabled() {
    return Boolean(this.baseUrl && this.apiKey);
  }

  async getTaxpayerBalance(tin) {
    if (!this.enabled) {
      return { mode: 'fallback' };
    }

    const response = await axios.get(`${this.baseUrl}/taxpayers/${tin}/balance`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      timeout: 10_000,
    });

    return {
      mode: 'live',
      balance: response.data.balance,
      nextDeadline: response.data.nextDeadline,
      raw: response.data,
    };
  }
}
