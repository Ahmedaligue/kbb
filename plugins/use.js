import { getUser, setUser } from '../lib/database.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);

    if (args.length < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 🧪 استخدام 〕━━╮\n┃\n┃ الصيغة: .use [اسم العنصر]\n┃\n╰━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const itemName = args.join(' ');

    if (user.potions && user.potions.length > 0) {
        const idx = user.potions.findIndex(p => p.name === itemName);
        if (idx !== -1) {
            const potion = user.potions[idx];
            let msg = '';

            switch (potion.effect) {
                case 'heal':
                    const healAmt = Math.min(potion.value, user.maxHealth - user.health);
                    user.health = Math.min(user.maxHealth, user.health + potion.value);
                    msg = `❤️ شربت ${potion.name} وشفعت ${healAmt} صحة!`;
                    break;
                case 'full_heal':
                    user.health = user.maxHealth;
                    msg = `💖 صحتك ملئت بالكامل!`;
                    break;
                case 'attack_buff':
                    user.attack += potion.value;
                    msg = `⚔️ زاد هجومك بـ ${potion.value} مؤقتاً!`;
                    break;
                case 'defense_buff':
                    user.defense += potion.value;
                    msg = `🛡️ زاد دفاعك بـ ${potion.value} مؤقتاً!`;
                    break;
                case 'xp_boost':
                    user.xp += potion.value;
                    msg = `✨ حصلت على ${potion.value} خبرة إضافية!`;
                    break;
                default:
                    msg = `🧪 استخدمت ${potion.name}`;
            }

            if ((potion.quantity || 1) > 1) {
                potion.quantity -= 1;
            } else {
                user.potions.splice(idx, 1);
            }

            setUser(m.sender, user);
            return conn.sendMessage(m.chat, {
                text: `╭━━〔 ✅ استخدام 〕━━╮\n┃\n┃ ${msg}\n┃\n╰━━━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        }
    }

    return conn.sendMessage(m.chat, {
        text: '╭━━〔 ❌ غير موجود 〕━━╮\n┃\n┃ لم تجد هذا العنصر.\n┃\n╰━━━━━━━━━━━━━━━━━━╯'
    }, { quoted: m });
};

command.help = ['استخدام عنصر'];
command.tags = ['rpg'];
command.command = ['use', 'استخدم'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
