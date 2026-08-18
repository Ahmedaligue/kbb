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
            text: `╭━━〔 📈 ترقية 〕━━╮\n┃\n┃ الصيغة: .promote @الشخص\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const userToPromote = mentions[0];

    try {
        await conn.groupParticipantsUpdate(m.chat, [userToPromote], 'promote');
        await conn.sendMessage(m.chat, {
            text: `╭━━〔 📈 ترقية 〕━━╮\n┃\n┃ تم ترقية العضو للمسؤول.\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ فشل 〕━━╮\n┃\n┃ لم يتمكن من ترقية العضو.\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }
};

command.help = ['ترقية لمسؤول'];
command.tags = ['group'];
command.command = ['promote', 'ترقية'];
command.group = true;
command.admin = true;
command.botAdmin = true;
command.owner = false;
command.limit = false;
command.cooldown = 5;

export default command;
