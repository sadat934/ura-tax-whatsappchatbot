import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import Pino from 'pino';
import qrcode from 'qrcode-terminal';

export async function startBaileysAdapter({ chatbot }) {
  const { state, saveCreds } = await useMultiFileAuthState('auth/baileys');
  
  const socket = makeWASocket({
    auth: state,
    logger: Pino({ level: 'silent' }),
    browser: ['URA Tax Bot', 'Safari', '1.0.0'],
  });

  socket.ev.on('creds.update', saveCreds);

  socket.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('\n========================================');
      console.log('   SCAN THIS QR CODE WITH WHATSAPP');
      console.log('========================================\n');
      qrcode.generate(qr, { small: true });
      console.log('\n📱 Steps:');
      console.log('1. Open WhatsApp on your phone');
      console.log('2. Go to Settings > Linked Devices');
      console.log('3. Tap "Link a Device"');
      console.log('4. Scan the QR code above\n');
    }

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      
      if (statusCode === 405) {
        console.log('\n⚠️  Connection blocked by WhatsApp (Error 405)');
        console.log('This can happen due to:');
        console.log('- Network/firewall restrictions');
        console.log('- WhatsApp temporarily blocking automated connections');
        console.log('- Try using a VPN or different network\n');
      }
      
      console.log('WhatsApp connection closed.', { shouldReconnect, statusCode, reason: lastDisconnect?.error?.message });
      
      if (shouldReconnect && statusCode !== 405) {
        setTimeout(() => {
          startBaileysAdapter({ chatbot }).catch(console.error);
        }, 5000);
      }
    }

    if (connection === 'open') {
      console.log('\n✅ WhatsApp connected successfully!');
      console.log('🤖 Bot is now ready to receive messages\n');
    }
  });

  socket.ev.on('messages.upsert', async ({ messages }) => {
    const message = messages[0];
    if (!message || message.key.fromMe) return;

    const from = message.key.remoteJid;
    const text =
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text ||
      '';

    if (!text) return;

    const reply = await chatbot.handleMessage({ from, text });
    await socket.sendMessage(from, { text: reply });
  });
}
