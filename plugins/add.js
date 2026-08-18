import { parseMention, cleanPhoneNumber } from '../lib/helper.js';

let command = async (m, { conn, args }) => {
    if (!m.isGroup) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 👥 للمجموعات فقط 〕━━╮\n┃\n┃ هذا الأمر في المجموعات فقط.\n┃\n╰━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const mentions = parseMention(args.join(' '));
    let number = args[0]?.replace(/[^0-9]/g, '');

    if (mentions.length < 1 && !number) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 ➕ إضافة 〕━━╮\n┃\n┃ الصيغة: .add @الشخص\n┃ أو: .add [رقم]\n┃\n╰━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const userToAdd = mentions[0] || number + '@s.whatsapp.net';

    try {
        await conn.groupParticipantsUpdate(m.chat, [userToAdd], 'add');
        await conn.sendMessage(m.chat, {
            text: `╭━━〔 ✅ إضافة 〕━━╮\n┃\n┃ تم إضافة العضو بنجاح.\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ فشل 〕━━╮\n┃\n┃ لم يتمكن من إضافة العضو.\n┃ قد يكون رقمه غير صحيح.\n┃\n╰━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }
};

command.help = ['إضافة عضو'];
command.tags = ['group'];
command.command = ['add', 'اضافة'];
command.group = true;
command.admin = true;
command.botAdmin = true;
command.owner = false;
command.limit = false;
command.cooldown = 5;

export default command;
