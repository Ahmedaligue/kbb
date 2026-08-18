import { getUser, setUser } from '../lib/database.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);

    if (args.length < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 ⚔️ تجهيز 〕━━╮\n┃\n┃ الصيغة: .equip [اسم السلاح/الدرع]\n┃\n╰━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const itemName = args.join(' ');

    if (user.inventory && user.inventory.length > 0) {
        const idx = user.inventory.findIndex(i => i.name === itemName);
        if (idx !== -1) {
            const item = user.inventory[idx];

            if (item.type === 'weapon' || item.attack) {
                if (!user.weapons) user.weapons = [];
                user.weapons.push(item);
                user.attack += item.attack || 0;
                if (item.critical) user.critical += item.critical;
                user.inventory.splice(idx, 1);
                setUser(m.sender, user);
                return conn.sendMessage(m.chat, {
                    text: `╭━━〔 ✅ تجهيز 〕━━╮\n┃\n┃ ⚔️ جهزت: ${item.name}\n┃ ⚔️ هجومك: ${user.attack}\n┃\n╰━━━━━━━━━━━━━━━━━╯`
                }, { quoted: m });
            }

            if (item.type === 'armor' || item.defense) {
                if (!user.armor) user.armor = [];
                user.armor.push(item);
                user.defense += item.defense || 0;
                user.inventory.splice(idx, 1);
                setUser(m.sender, user);
                return conn.sendMessage(m.chat, {
                    text: `╭━━〔 ✅ تجهيز 〕━━╮\n┃\n┃ 🛡️ جهزت: ${item.name}\n┃ 🛡️ دفاعك: ${user.defense}\n┃\n╰━━━━━━━━━━━━━━━━━╯`
                }, { quoted: m });
            }

            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ لا يمكن تجهيزه 〕━━╮\n┃\n┃ هذا العنصر لا يمكن تجهيزه.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }
    }

    return conn.sendMessage(m.chat, {
        text: '╭━━〔 ❌ غير موجود 〕━━╮\n┃\n┃ لم تجد هذا العنصر في حقيبتك.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯'
    }, { quoted: m });
};

command.help = ['تجهيز سلاح أو درع'];
command.tags = ['rpg'];
command.command = ['equip', 'جهز'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
