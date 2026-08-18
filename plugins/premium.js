import { getUser, setUser } from '../lib/database.js';
import { parseMention } from '../lib/helper.js';

let command = async (m, { conn, args }) => {
    const mentions = parseMention(args.join(' '));
    if (mentions.length < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 👑 مميز 〕━━╮\n┃\n┃ الصيغة: .premium @الشخص\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const targetId = mentions[0];
    const target = getUser(targetId);

    if (target.premium) {
        target.premium = false;
        setUser(targetId, target);
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 ❌ إلغاء ميزة 〕━━╮\n┃\n┃ تم إلغاء ميزة اللاعب المميزة.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    target.premium = true;
    setUser(targetId, target);

    await conn.sendMessage(m.chat, {
        text: `╭━━〔 👑 ميزة مميزة 〕━━╮\n┃\n┃ تم تفعيل الميزة المميزة للاعب.\n┃ 📈 الحد الأقصى: 100 أمر يومياً\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m });
};

command.help = ['تفعيل/إلغاء الميزة المميزة'];
command.tags = ['group'];
command.command = ['premium', 'مميز'];
command.group = true;
command.admin = true;
command.botAdmin = false;
command.owner = true;
command.limit = false;
command.cooldown = 3;

export default command;
