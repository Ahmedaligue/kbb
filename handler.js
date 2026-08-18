import config from './config.js';
import { serialize } from './lib/serialize.js';
import { getCommand, loadPlugins } from './lib/loader.js';
import { getUser, saveDB } from './lib/database.js';
import { getPermissions } from './lib/permissions.js';
import { checkCooldown, setCooldown, formatCooldown } from './lib/cooldown.js';
import { formatNumber } from './lib/helper.js';

const prefix = config.prefix;

export default async function handler(conn, msg) {
    try {
        if (!msg) return;
        if (msg.key && msg.key.remoteJid === 'status@broadcast') return;
        if (msg.key && msg.key.fromMe) return;

        const m = serialize(conn, msg);

        if (!m.body || m.body.trim() === '') return;
        if (!m.text.startsWith(prefix)) return;

        const commandName = m.command;
        if (!commandName) return;

        const cmd = getCommand(commandName);
        if (!cmd) return;

        const perms = await getPermissions(conn, m);
        const user = getUser(m.sender);

        if (!user.name && commandName !== 'register' && commandName !== 'سجل') {
            return;
        }

        if (user.banned) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 🚫 محظور 〕━━╮\n┃\n┃ أنت محظور من استخدام البوت.\n┃ تواصل المالك للإلغاء.\n┃\n╰━━━━━━━━━━━━━━━━╯'
            });
        }

        if (cmd.owner && !perms.isOwner) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 👑 للملك فقط 〕━━╮\n┃\n┃ هذا الأمر للمالك فقط.\n┃\n╰━━━━━━━━━━━━━━━━╯'
            });
        }

        if (cmd.group && !perms.isGroup) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 👥 للمجموعات فقط 〕━━╮\n┃\n┃ هذا الأمر يعمل في المجموعات فقط.\n┃\n╰━━━━━━━━━━━━━━━━━━╯'
            });
        }

        if (cmd.admin && !perms.isAdmin && !perms.isOwner) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 🛡️ للإدارة فقط 〕━━╮\n┃\n┃ هذا الأمر للمسؤولين فقط.\n┃\n╰━━━━━━━━━━━━━━━━╯'
            });
        }

        if (cmd.botAdmin && !perms.isBotAdmin) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 🤖 البوت غير مسؤول 〕━━╮\n┃\n┃ البوت يحتاج صلاحيات مسؤول.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯'
            });
        }

        if (cmd.cooldown && cmd.cooldown > 0) {
            const cd = checkCooldown(m.sender, commandName, cmd.cooldown);
            if (cd.onCooldown) {
                return conn.sendMessage(m.chat, {
                    text: `╭━━〔 ⏱️ تهدئة 〕━━╮\n┃\n┃ يجب الانتظار ${formatCooldown(cd.remaining)}\n┃ قبل استخدام هذا الأمر مرة أخرى.\n┃\n╰━━━━━━━━━━━━━━━━╯`
                });
            }
        }

        if (cmd.limit && !perms.isOwner && !perms.isPremium) {
            if (user.energy <= 0) {
                return conn.sendMessage(m.chat, {
                    text: '╭━━〔 💫 نفاد الطاقة 〕━━╮\n┃\n┃ لا تملك طاقة كافية.\n┃ استخدم .rest للاسترخاء.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
                });
            }
            user.energy = Math.max(0, user.energy - 1);
        }

        try {
            await conn.sendPresenceUpdate('composing', m.chat);
        } catch (e) { /* ignore */ }

        try {
            await cmd(m, {
                conn,
                text: m.text,
                usedPrefix: prefix,
                command: commandName,
                args: m.args,
                isGroup: perms.isGroup,
                isAdmin: perms.isAdmin,
                isBotAdmin: perms.isBotAdmin,
                isOwner: perms.isOwner,
                isPrivate: perms.isPrivate,
                isRegistered: perms.isRegistered,
                isPremium: perms.isPremium,
                isBanned: perms.isBanned,
                isMuted: perms.isMuted,
                pushname: m.pushName,
                user,
                sender: m.sender,
                chat: m.chat,
                msg: m
            });

            if (cmd.cooldown && cmd.cooldown > 0) {
                setCooldown(m.sender, commandName);
            }

        } catch (error) {
            console.error(`❌ خطأ في الأمر ${commandName}:`, error);
            await conn.sendMessage(m.chat, {
                text: '╭━━〔 💀 خطأ 〕━━╮\n┃\n┃ حدث خطأ أثناء تنفيذ الأمر.\n┃ حاول مرة أخرى لاحقًا.\n┃\n╰━━━━━━━━━━━━━━╯'
            });
        }

        try {
            await conn.sendPresenceUpdate('paused', m.chat);
        } catch (e) { /* ignore */ }

        try {
            await saveDB();
        } catch (e) { /* ignore */ }

    } catch (error) {
        console.error('❌ خطأ عام في Handler:', error);
    }
}
