import { getUser, setUser } from '../lib/database.js';
import { getDailyReward } from '../lib/rpg.js';
import { checkLevelUp, getRank } from '../lib/helper.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    const now = Date.now();
    if (user.lastDaily && (now - user.lastDaily) < 86400000) {
        const remaining = Math.ceil((86400000 - (now - user.lastDaily)) / 1000);
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 ⏱️ انتظر 〕━━╮\n┃\n┃ المكافأة اليومية متاحة بعد:\n┃ ${hours} ساعة ${minutes} دقيقة\n┃\n╰━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const yesterday = user.lastDaily && (now - user.lastDaily) < 172800000;
    const streak = yesterday ? (user.dailyStreak || 0) + 1 : 1;

    const reward = getDailyReward(streak);

    user.money += reward.money;
    user.xp += reward.xp;
    user.lastDaily = now;
    user.dailyStreak = streak;

    const levelResult = checkLevelUp(user);
    if (levelResult.results.length > 0) {
        for (const lr of levelResult.results) {
            user.level = lr.level;
            user.maxHealth += lr.healthGain;
            user.health = user.maxHealth;
            user.attack += lr.attackGain;
            user.defense += lr.defenseGain;
            user.money += lr.moneyGain;
        }
        user.xp = levelResult.finalXp;
        user.rank = getRank(user.level);
    }

    let text = `╭━━〔 🎁 المكافأة اليومية 〕━━╮\n┃\n`;
    text += `┃ 🔥 سلسلة يومية: ${streak}\n┃\n`;
    text += `┃ 🎁 مكافأتك:\n`;
    text += `┃   💰 ${reward.money} ذهب\n`;
    text += `┃   ✨ ${reward.xp} خبرة\n`;
    text += `┃\n`;
    text += `┃ عد غداً لجمع المزيد!\n`;
    text += `╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text }, { quoted: m });
    setUser(m.sender, user);
};

command.help = ['المكافأة اليومية'];
command.tags = ['economy'];
command.command = ['daily', 'يومي'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
