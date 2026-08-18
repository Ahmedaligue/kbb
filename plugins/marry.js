import { getUser, setUser, getMarriage, createMarriage } from '../lib/database.js';
import { parseMention } from '../lib/helper.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);

    if (user.marriedTo) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 💍 متزوج بالفعل 〕━━╮\n┃\n┃ أنت متزوج بالفعل.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const mentions = parseMention(args.join(' '));
    if (mentions.length < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 💍 زواج 〕━━╮\n┃\n┃ الصيغة: ${'.marry @'}الشخص\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const targetId = mentions[0];
    if (targetId === m.sender) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ لا يمكنك الزواج من نفسك!\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const target = getUser(targetId);
    if (!target.registered) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ غير مسجل 〕━━╮\n┃\n┃ هذا اللاعب غير مسجل.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    if (target.marriedTo) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 💍 متزوج بالفعل 〕━━╮\n┃\n┃ هذا الشخص متزوج بالفعل.\n┃\n╰━━━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    if (user.money < 500) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 💰 لا يكفي 〕━━╮\n┃\n┃ تحتاج 500 ذهب للزواج.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    user.money -= 500;
    user.marriedTo = targetId;
    target.marriedTo = m.sender;
    createMarriage(m.sender, targetId);
    setUser(m.sender, user);
    setUser(targetId, target);

    await conn.sendMessage(m.chat, {
        text: `╭━━〔 💍 زواج سعيد 〕━━╮\n┃\n┃ 🎉 تمت الخطوبة!\n┃ ${user.name || 'محارب'} 💕 ${target.name || 'محارب'}\n┃\n┃ 💰 التكلفة: 500 ذهب\n┃\n┃ عيشا في السعادة!\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m, mentions: [m.sender, targetId] });
};

command.help = ['الزواج من لاعب'];
command.tags = ['social'];
command.command = ['marry', 'زواج'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 5;

export default command;
