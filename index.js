import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    isGroup
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdir, mkdir } from 'fs/promises';
import handler from './handler.js';
import { loadPlugins } from './lib/loader.js';
import { cleanPhoneNumber } from './lib/helper.js';
import { saveDB } from './lib/database.js';
import config from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sessionDir = join(__dirname, config.sessionName);

async function ensureSessionDir() {
    try {
        await mkdir(sessionDir, { recursive: true });
    } catch (e) { }
}

async function startBot() {
    await ensureSessionDir();

    console.log('');
    console.log('✦━━━━━━━━━━━━━━━━━━━━━━━━✦');
    console.log('✦🔥  KABANE BOT  🔥✦');
    console.log('✦━━━━━━━━━━━━━━━━━━━━━━━━✦');
    console.log('');

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`✦ الإصدار: v${version.join('.')} | الأحدث: ${isLatest} ✦`);

    const conn = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        },
        printQRInTerminal: false,
        browser: ['KABANE BOT', 'Safari', '3.0.0'],
        generateHighQualityLinkPreview: false,
        markOnlineOnConnect: true,
        syncFullHistory: false,
        retryRequestDelay: 1000,
        maxRetries: 3,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 30000
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr, pairingCode } = update;

        if (connection === 'close') {
            const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log(`✦ حالة الاتصال: ${connection} | كود: ${statusCode} ✦`);

            if (shouldReconnect) {
                console.log('✦ جاري إعادة الاتصال... ✦');
                setTimeout(() => startBot(), 3000);
            } else {
                console.log('✦ تم قطع الاتصال نهائياً. أعد التشغيل. ✦');
                await saveDB();
                process.exit(1);
            }
        }

        if (connection === 'open') {
            console.log('');
            console.log('✦🔥 KABANE BOT متصل بنجاح 🔥✦');
            console.log('');

            await loadPlugins();
        }

        if (qr && !state.creds.registered) {
            const phoneNumber = cleanPhoneNumber(config.owner[0]);
            try {
                const code = await conn.requestPairingCode(phoneNumber);
                const formatted = code.match(/.{1,4}/g)?.join('-') || code;
                console.log('');
                console.log('✦━━━━━━━━━━━━━━━━━━━━━━━━✦');
                console.log(`✦ كود الربط: ${formatted} ✦`);
                console.log('✦━━━━━━━━━━━━━━━━━━━━━━━━✦');
                console.log('');
            } catch (error) {
                console.log('❌ خطأ في طلب كود الربط:', error.message);
            }
        }
    });

    conn.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        for (const msg of messages) {
            await handler(conn, msg);
        }
    });

    conn.ev.on('groups.update', async (updates) => {
        for (const update of updates) {
            if (update.subject) {
                console.log(`✦ تم تغيير اسم المجموعة إلى: ${update.subject} ✦`);
            }
        }
    });

    conn.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        if (action === 'add') {
            for (const participant of participants) {
                try {
                    await conn.sendMessage(id, {
                        text: `╭━━〔 🏰 مرحباً 〕━━╮\n┃\n┃ مرحباً بك في عالم الظلام!\n┃ استخدم .menu لعرض الأوامر.\n┃\n╰━━━━━━━━━━━━━━━━━╯`
                    });
                } catch (e) { }
            }
        }
        if (action === 'remove') {
            for (const participant of participants) {
                try {
                    await conn.sendMessage(id, {
                        text: `╭━━〔 👋 وداعاً 〕━━╮\n┃\n┃ غادر المحارب المعركة...\n┃\n╰━━━━━━━━━━━━━━━━╯`
                    });
                } catch (e) { }
            }
        }
    });

    conn.ev.on('error', (error) => {
        console.error('❌ خطأ في الاتصال:', error.message);
    });

    process.on('SIGINT', async () => {
        console.log('\n✦ جاري حفظ البيانات وإيقاف البوت... ✦');
        await saveDB();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('\n✦ جاري حفظ البيانات وإيقاف البوت... ✦');
        await saveDB();
        process.exit(0);
    });

    process.on('unhandledRejection', (reason) => {
        console.error('❌ رفض غير معالج:', reason);
    });

    process.on('uncaughtException', (error) => {
        console.error('❌ استثناء غير متوقع:', error);
    });

    return conn;
}

startBot().catch(error => {
    console.error('❌ خطأ في بدء البوت:', error);
    process.exit(1);
});
