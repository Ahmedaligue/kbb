import { getUser, setUser } from '../lib/database.js';
import { parseMention } from '../lib/helper.js';

let command = async (m, { conn, args }) => {
    const mentions = parseMention(args.join(' '));
    if (mentions.length < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 ✅ إلغاء الحظر 〕━━╮\n┃\n┃ الصيغة: .unban @الشخص\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const targetId = mentions[0];
    const target = getUser(targetId);

    target.banned = false;
    setUser(targetId, target);

    await conn.sendMessage(m.chat, {
        text: `╭━━〔 ✅ إلغاء الحظر 〕━━╮\n┃\n┃ تم إلغاء حظر اللاعب.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m });
};

command.help = ['إلغاء حظر لاعب'];
command.tags = ['group'];
command.command = ['unban', 'إلغاء_حظر'];
command.group = true;
command.admin = true;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
