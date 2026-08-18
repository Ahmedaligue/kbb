import { getUser } from '../lib/database.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    let text = `╭━━〔 🎒 حقيبة المحارب 〕━━╮\n┃\n`;

    if (user.weapons && user.weapons.length > 0) {
        text += `┃ ⚔️ الأسلحة:\n`;
        user.weapons.forEach((w, i) => {
            text += `┃   ${i + 1}. ${w.name} (+${w.attack} ⚔️)\n`;
        });
    } else {
        text += `┃ ⚔️ لا تملك أسلحة\n`;
    }

    text += `┃\n`;

    if (user.armor && user.armor.length > 0) {
        text += `┃ 🛡️ الدروع:\n`;
        user.armor.forEach((a, i) => {
            text += `┃   ${i + 1}. ${a.name} (+${a.defense} 🛡️)\n`;
        });
    } else {
        text += `┃ 🛡️ لا تملك دروع\n`;
    }

    text += `┃\n`;

    if (user.potions && user.potions.length > 0) {
        text += `┃ 🧪 الجرعات:\n`;
        user.potions.forEach((p, i) => {
            text += `┃   ${p.name} ×${p.quantity || 1}\n`;
        });
    } else {
        text += `┃ 🧪 لا تملك جرعات\n`;
    }

    text += `┃\n`;

    if (user.inventory && user.inventory.length > 0) {
        text += `┃ 📦 الأغراض:\n`;
        user.inventory.forEach((item, i) => {
            text += `┃   ${item.name} ×${item.quantity || 1}\n`;
        });
    } else {
        text += `┃ 📦 الحقيبة فارغة\n`;
    }

    text += `┃\n╰━━━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text }, { quoted: m });
};

command.help = ['عرض الحقيبة'];
command.tags = ['rpg'];
command.command = ['inventory', 'inv', 'حقيبة'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
