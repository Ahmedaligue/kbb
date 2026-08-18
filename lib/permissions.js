import { isGroup } from '@whiskeysockets/baileys';
import { isOwner as checkOwner } from './helper.js';
import { getUser } from './database.js';

export function getPermissions(conn, msg) {
    const chat = msg.chat || msg.key?.remoteJid;
    const sender = msg.sender || msg.key?.participant || msg.key?.remoteJid;
    const fromMe = msg.fromMe || msg.key?.fromMe;

    const group = isGroup(chat);
    let isAdmin = false;
    let isBotAdmin = false;

    if (group) {
        try {
            const groupMetadata = conn.groupMetadata ? await conn.groupMetadata(chat) : null;
            if (groupMetadata) {
                const botId = conn.user?.id?.replace(/:.*@/, '@').split('@')[0] + '@s.whatsapp.net';
                const participant = groupMetadata.participants.find(p => p.id === sender);
                const botParticipant = groupMetadata.participants.find(p => p.id === botId);
                isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
                isBotAdmin = botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
            }
        } catch (e) {
            // silently fail
        }
    }

    const owner = checkOwner(sender);
    const user = getUser(sender);

    return {
        isGroup: group,
        isPrivate: !group,
        isAdmin,
        isBotAdmin,
        isOwner: owner,
        isRegistered: user.registered,
        isPremium: user.premium,
        isBanned: user.banned,
        isMuted: user.muted,
        fromMe
    };
}

export default getPermissions;
