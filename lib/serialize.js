import config from '../config.js';
import { getBinaryNodeChildren, getBinaryNodeAttribute, isJidUser, isLidUser, isGroup } from '@whiskeysockets/baileys';

export function serialize(conn, msg) {
    if (!msg) return msg;
    if (msg.key) {
        msg.id = msg.key.id;
        msg.from = msg.key.remoteJid;
        msg.chat = msg.key.remoteJid;
        msg.sender = msg.key.participant || msg.key.remoteJid;
        msg.fromMe = msg.key.fromMe;
        msg.isGroup = isGroup(msg.chat);
        msg.isPrivate = !msg.isGroup;
    }

    const message = msg.message || (msg.messages && msg.messages[0]) || {};
    const msgType = Object.keys(message).find(t => t !== 'messageContextInfo' && t !== 'senderKeyDistribution');

    msg.messageType = msgType;

    if (message.conversation) {
        msg.body = message.conversation;
    } else if (message.extendedTextMessage && message.extendedTextMessage.text) {
        msg.body = message.extendedTextMessage.text;
    } else if (message.imageMessage && message.imageMessage.caption) {
        msg.body = message.imageMessage.caption;
    } else if (message.videoMessage && message.videoMessage.caption) {
        msg.body = message.videoMessage.caption;
    } else if (message.buttonsResponseMessage) {
        msg.body = message.buttonsResponseMessage.selectedButtonId;
    } else if (message.listResponseMessage) {
        msg.body = message.listResponseMessage.singleSelectReply.selectedRowId;
    } else if (message.templateButtonReplyMessage) {
        msg.body = message.templateButtonReplyMessage.selectedId;
    } else if (message.protocolMessage) {
        msg.body = '';
    } else {
        msg.body = '';
    }

    msg.text = msg.body || '';

    const prefix = config.prefix;
    if (msg.text && msg.text.startsWith(prefix)) {
        const [cmd, ...args] = msg.text.slice(prefix.length).trim().split(/\s+/);
        msg.command = cmd.toLowerCase();
        msg.args = args;
        msg.fullArgs = args.join(' ');
    } else {
        msg.command = '';
        msg.args = [];
        msg.fullArgs = '';
    }

    msg.mentionedJid = (message.extendedTextMessage && message.extendedTextMessage.contextInfo && message.extendedTextMessage.contextInfo.mentionedJid) || [];

    if (message.extendedTextMessage && message.extendedTextMessage.contextInfo) {
        const ctx = message.extendedTextMessage.contextInfo;
        if (ctx.quotedMessage) {
            const quotedType = Object.keys(ctx.quotedMessage).find(t => t !== 'messageContextInfo');
            msg.quoted = {
                key: {
                    remoteJid: msg.chat,
                    fromMe: ctx.participant === conn.user?.id?.replace(/:.*@/, '@'),
                    id: ctx.stanzaId,
                    participant: ctx.participant
                },
                message: ctx.quotedMessage,
                sender: ctx.participant,
                chat: msg.chat
            };

            const qMsg = ctx.quotedMessage;
            if (qMsg.conversation) {
                msg.quoted.text = qMsg.conversation;
            } else if (qMsg.extendedTextMessage && qMsg.extendedTextMessage.text) {
                msg.quoted.text = qMsg.extendedTextMessage.text;
            } else if (qMsg.imageMessage && qMsg.imageMessage.caption) {
                msg.quoted.text = qMsg.imageMessage.caption;
            } else if (qMsg.videoMessage && qMsg.videoMessage.caption) {
                msg.quoted.text = qMsg.videoMessage.caption;
            } else {
                msg.quoted.text = '';
            }
        }
    }

    msg.chatName = '';
    msg.pushName = msg.pushName || '';

    msg.reply = async (text, options = {}) => {
        const content = typeof text === 'string' ? { text } : text;
        return conn.sendMessage(msg.chat, content, { quoted: msg, ...options });
    };

    msg.react = async (emoji) => {
        return conn.sendMessage(msg.chat, {
            react: { text: emoji, key: msg.key }
        });
    };

    return msg;
}

export function serializeConnection(conn) {
    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode === 401) {
                console.log('✦ تم قطع الاتصال. جاري إعادة الاتصال... ✦');
            }
        }
    });
}

export default serialize;
