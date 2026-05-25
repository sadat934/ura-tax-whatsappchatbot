# URA Tax Chatbot Prototype

This is the free first version of the WhatsApp tax notification and compliance assistant.

The prototype uses:

- Node.js and Express for the backend
- Baileys for free WhatsApp testing with a linked WhatsApp number
- Local JSON storage for early testing
- A URA API adapter that stays in fallback mode until official API credentials are available

## Setup

```bash
npm install
copy .env.example .env
```

## Test Without WhatsApp

Use the console chatbot first:

```bash
npm run console
```

Try this flow:

```text
menu
1
1000123456
1
2500000
VAT, income tax
2
3
```

## Run API Server

```bash
npm run dev
```

Then test a message:

```bash
curl -X POST http://localhost:3000/simulate-message \
  -H "Content-Type: application/json" \
  -d "{\"from\":\"test-user\",\"text\":\"menu\"}"
```

## Connect WhatsApp With Baileys

Edit `.env`:

```env
BOT_MODE=whatsapp
WHATSAPP_PROVIDER=baileys
```

Start the app:

```bash
npm run dev
```

Scan the QR code with WhatsApp. This is the free prototype path.

## Paid Later

When money and users increase, add:

- Official WhatsApp Business API adapter
- Live URA API credentials
- PostgreSQL instead of JSON storage
- A React admin dashboard
- Production hosting and monitoring

The code is already separated into adapters so these paid integrations can be added without rewriting the chatbot flow.
