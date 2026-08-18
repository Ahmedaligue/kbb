import { parseMention } from '../lib/helper.js';

let command = async (m, { conn, args }) => {
    if (!m.isGroup) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 👥 للمجموعات فقط 〕━━╮\n┃\n┃ هذا الأمر في المجموعات فقط.\n┃\n╰━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const mentions = parseMention(args.join(' '));
    if (mentions.length < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 📉 تنزيل 〕━━╮\n┃\n┃ الصيغة: .demote @الشخص\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const userToDemote = mentions[0];

    try {
        await conn.groupParticipantsUpdate(m.chat, [userToDemote], 'demote');
        await conn.sendMessage(m.chat, {
            text: `╭━━〔 📉 تنزيل 〕━━╮\n┃\n┃ تم تنزيل المسؤول.\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ فشل 〕━━╮\n┃\n┃ لم يتمكن من تنزيل المسؤول.\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }
};

command.help = ['تنزيل من المسؤولية'];
command.tags = ['group'];
command.command = ['demote', 'تنزيل'];
command.group = true;
command.admin = true;
command.botAdmin = true;
command.owner = false;
command.limit = false;
command.cooldown = 5;

export default command;
