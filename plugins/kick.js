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
            text: `╭━━〔 🚪 طرد 〕━━╮\n┃\n┃ الصيغة: .kick @الشخص\n┃\n╰━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const userToKick = mentions[0];

    try {
        await conn.groupParticipantsUpdate(m.chat, [userToKick], 'remove');
        await conn.sendMessage(m.chat, {
            text: `╭━━〔 🚪 طرد 〕━━╮\n┃\n┃ تم طرد العضو بنجاح.\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ فشل 〕━━╮\n┃\n┃ لم يتمكن من طرد العضو.\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }
};

command.help = ['طرد عضو'];
command.tags = ['group'];
command.command = ['kick', 'طرد'];
command.group = true;
command.admin = true;
command.botAdmin = true;
command.owner = false;
command.limit = false;
command.cooldown = 5;

export default command;
