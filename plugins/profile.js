import { getUser } from '../lib/database.js';
import { getRank, formatNumber } from '../lib/helper.js';
import { createProfileCard } from '../lib/canvas.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);
    const rank = getRank(user.level);

    let text = `╭━━〔 📜 ملف المحارب 〕━━╮\n┃\n`;
    text += `┃ 👤 الاسم: ${user.name || 'مجهول'}\n`;
    text += `┃ ⭐ المستوى: ${user.level}\n`;
    text += `┃ ✨ الخبرة: ${user.xp}\n`;
    text += `┃ 🏷️ الرتبة: ${rank}\n`;
    text += `┃\n`;
    text += `┃ ❤️ الصحة: ${user.health}/${user.maxHealth}\n`;
    text += `┃ 💫 الطاقة: ${user.energy}/${user.maxEnergy}\n`;
    text += `┃\n`;
    text += `┃ ⚔️ الهجوم: ${user.attack}\n`;
    text += `┃ 🛡️ الدفاع: ${user.defense}\n`;
    text += `┃ 💥 الحرج: ${user.critical}%\n`;
    text += `┃ 🍀 الحظ: ${user.luck}%\n`;
    text += `┃\n`;
    text += `┃ 💰 الذهب: ${formatNumber(user.money)}\n`;
    text += `┃ 🏦 البنك: ${formatNumber(user.bank)}\n`;
    text += `┃\n`;
    text += `┃ 💀 القتل: ${user.kills}\n`;
    text += `┃ 🪦 الوفيات: ${user.deaths}\n`;
    text += `┃ ⚔️ الانتصارات: ${user.wins}\n`;
    text += `┃ 📉 الهزائم: ${user.losses}\n`;

    if (user.premium) text += `┃\n┃ 👑 حساب مميز\n`;
    if (user.clan) text += `┃ 🏰 العشيرة: ${user.clan}\n`;
    if (user.marriedTo) text += `┃ 💍 متزوج من: ${user.marriedTo}\n`;

    text += `┃\n╰━━━━━━━━━━━━━━━━━━━╯`;

    try {
        const card = await createProfileCard(user);
        if (card) {
            return conn.sendMessage(m.chat, {
                image: card,
                caption: text
            }, { quoted: m });
        }
    } catch (e) { }

    await conn.sendMessage(m.chat, { text }, { quoted: m });
};

command.help = ['عرض ملف المحارب'];
command.tags = ['rpg'];
command.command = ['profile', 'بروفايل', 'ملفي'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
