import { getUser, setUser } from '../lib/database.js';
import { rollFish } from '../lib/rpg.js';
import { checkLevelUp, getRank } from '../lib/helper.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    const fish = rollFish();
    user.money += fish.price;
    user.xp += fish.xp;

    if (!user.inventory) user.inventory = [];
    const existing = user.inventory.find(i => i.name === fish.name);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        user.inventory.push({ name: fish.name, quantity: 1 });
    }

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

        await conn.sendMessage(m.chat, {
            text: `╭━━〔 🌟 ارتقاء المستوى 🌟 〕━━╮\n┃\n┃ 🎉 وصلت إلى مستوى ${user.level}!\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    let text = `╭━━〔 🎣 صيد 〕━━╮\n┃\n`;
    text += `┃ رميت الصنارة في الماء...\n┃\n`;
    text += `┃ اصطدت: ${fish.name}\n`;
    text += `┃ 🏷️ الندرة: ${fish.rarity}\n`;
    text += `┃ 💰 القيمة: ${fish.price} ذهب\n`;
    text += `┃ ✨ الخبرة: ${fish.xp}\n`;
    text += `╰━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text }, { quoted: m });
    setUser(m.sender, user);
};

command.help = ['صيد الأسماك'];
command.tags = ['rpg'];
command.command = ['fish', 'صيد_اسماك'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = true;
command.cooldown = 8;

export default command;
