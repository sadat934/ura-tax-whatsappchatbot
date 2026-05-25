import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 3000),
  botMode: process.env.BOT_MODE || 'console',
  whatsappProvider: process.env.WHATSAPP_PROVIDER || 'baileys',
  dataFile: process.env.DATA_FILE || './data/users.json',
  uraApi: {
    baseUrl: process.env.URA_API_BASE_URL || '',
    apiKey: process.env.URA_API_KEY || '',
  },
};
