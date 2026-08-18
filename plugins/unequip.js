import { getUser, setUser } from '../lib/database.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);

    if (args.length < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 ⚔️ إزالة 〕━━╮\n┃\n┃ الصيغة: .unequip [اسم السلاح/الدرع]\n┃\n╰━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const itemName = args.join(' ');

    if (user.weapons && user.weapons.length > 0) {
        const idx = user.weapons.findIndex(i => i.name === itemName);
        if (idx !== -1) {
            const item = user.weapons[idx];
            if (!user.inventory) user.inventory = [];
            user.inventory.push(item);
            user.attack = Math.max(1, user.attack - (item.attack || 0));
            if (item.critical) user.critical = Math.max(0, user.critical - item.critical);
            user.weapons.splice(idx, 1);
            setUser(m.sender, user);
            return conn.sendMessage(m.chat, {
                text: `╭━━〔 ✅ إزالة 〕━━╮\n┃\n┃ ⚔️ أزلت: ${item.name}\n┃ ⚔️ هجومك: ${user.attack}\n┃\n╰━━━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        }
    }

    if (user.armor && user.armor.length > 0) {
        const idx = user.armor.findIndex(i => i.name === itemName);
        if (idx !== -1) {
            const item = user.armor[idx];
            if (!user.inventory) user.inventory = [];
            user.inventory.push(item);
            user.defense = Math.max(1, user.defense - (item.defense || 0));
            user.armor.splice(idx, 1);
            setUser(m.sender, user);
            return conn.sendMessage(m.chat, {
                text: `╭━━〔 ✅ إزالة 〕━━╮\n┃\n┃ 🛡️ أزلت: ${item.name}\n┃ 🛡️ دفاعك: ${user.defense}\n┃\n╰━━━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        }
    }

    return conn.sendMessage(m.chat, {
        text: '╭━━〔 ❌ غير موجود 〕━━╮\n┃\n┃ لم تجد هذا العنصر مجهزاً.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯'
    }, { quoted: m });
};

command.help = ['إزالة تجهيز'];
command.tags = ['rpg'];
command.command = ['unequip', 'أزل'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
