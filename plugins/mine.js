import { getUser, setUser } from '../lib/database.js';
import { rollOre } from '../lib/rpg.js';
import { checkLevelUp } from '../lib/rpg.js';
import { getRank } from '../lib/helper.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    const hasPickaxe = user.inventory?.some(i => i.name === '⛏️ معول تعدين') ||
                       user.inventory?.some(i => i.effect === 'mine');

    const ore = rollOre();
    user.money += ore.price;
    user.xp += ore.xp;

    if (!user.inventory) user.inventory = [];
    const existing = user.inventory.find(i => i.name === ore.name);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        user.inventory.push({ name: ore.name, quantity: 1 });
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
            text: `╭━━〔 🌟 ارتقاء المستوى 🌟 〕━━╮\n┃\n┃ 🎉 وصلت إلى مستوى ${user.level}!\n┃ ⚔️ قوتك تزداد...\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    let text = `╭━━〔 ⛏️ تعدين 〕━━╮\n┃\n`;
    text += `┃ حفرت في المنجم ووجدت:\n`;
    text += `┃ ${ore.name}\n┃\n`;
    text += `┃ 💰 القيمة: ${ore.price} ذهب\n`;
    text += `┃ ✨ الخبرة: ${ore.xp}\n`;
    text += `╰━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text }, { quoted: m });
    setUser(m.sender, user);
};

command.help = ['الحفر في المناجم'];
command.tags = ['rpg'];
command.command = ['mine', 'حفر'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = true;
command.cooldown = 8;

export default command;
