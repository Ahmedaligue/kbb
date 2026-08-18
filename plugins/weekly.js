import { getUser, setUser } from '../lib/database.js';
import { getWeeklyReward } from '../lib/rpg.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    const now = Date.now();
    if (user.lastWeekly && (now - user.lastWeekly) < 604800000) {
        const remaining = Math.ceil((604800000 - (now - user.lastWeekly)) / 1000);
        const days = Math.floor(remaining / 86400);
        const hours = Math.floor((remaining % 86400) / 3600);
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 ⏱️ انتظر 〕━━╮\n┃\n┃ المكافأة الأسبوعية متاحة بعد:\n┃ ${days} يوم ${hours} ساعة\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const reward = getWeeklyReward(user.level);

    user.money += reward.money;
    user.xp += reward.xp;
    user.lastWeekly = now;
    setUser(m.sender, user);

    let text = `╭━━〔 🎁 المكافأة الأسبوعية 〕━━╮\n┃\n`;
    text += `┃ 🎁 مكافأتك الأسبوعية:\n`;
    text += `┃   💰 ${reward.money} ذهب\n`;
    text += `┃   ✨ ${reward.xp} خبرة\n`;
    text += `┃\n`;
    text += `┃ عد الأسبوع القادم!\n`;
    text += `╰━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text }, { quoted: m });
};

command.help = ['المكافأة الأسبوعية'];
command.tags = ['economy'];
command.command = ['weekly', 'أسبوعي'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
