import { shopItems } from '../lib/rpg.js';
import config from '../config.js';

let command = async (m, { conn, args }) => {
    const category = args[0]?.toLowerCase();

    let text = `╭━━〔 🛒 متجر الكائنات 〕━━╮\n┃\n`;

    if (!category || !shopItems[category]) {
        text += `┃ اختر قسم:\n`;
        text += `┃ 📝 ${config.prefix}shop weapons\n`;
        text += `┃ 📝 ${config.prefix}shop armor\n`;
        text += `┃ 📝 ${config.prefix}shop potions\n`;
        text += `┃ 📝 ${config.prefix}shop misc\n`;
        text += `┃\n`;
        text += `┃ أو اكتب ${config.prefix}buy لشراء.\n`;
        text += `╰━━━━━━━━━━━━━━━━━━━━━━╯`;
    } else {
        const items = shopItems[category];
        const catName = category === 'weapons' ? '⚔️ الأسلحة' :
                        category === 'armor' ? '🛡️ الدروع' :
                        category === 'potions' ? '🧪 الجرعات' : '📦 متنوع';

        text += `┣━━〔 ${catName} 〕━━\n┃\n`;

        items.forEach((item, i) => {
            text += `┃ ${i + 1}. ${item.name}\n`;
            text += `┃    💰 السعر: ${item.price}\n`;
            if (item.attack) text += `┃    ⚔️ هجوم: +${item.attack}\n`;
            if (item.defense) text += `┃    🛡️ دفاع: +${item.defense}\n`;
            text += `┃    🏷️ الندرة: ${item.rarity}\n`;
            text += `┃\n`;
        });

        text += `╰━━━━━━━━━━━━━━━━━━━━━━╯`;
    }

    await conn.sendMessage(m.chat, { text }, { quoted: m });
};

command.help = ['فتح المتجر'];
command.tags = ['economy'];
command.command = ['shop', 'متجر'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
