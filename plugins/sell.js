import { getUser, setUser } from '../lib/database.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);

    if (args.length < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 💰 بيع 〕━━╮\n┃\n┃ الصيغة: .sell [اسم العنصر]\n┃ أو: .sell [القسم] [الرقم]\n┃\n╰━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const itemName = args.join(' ');
    let found = false;
    let sellPrice = 0;

    if (user.inventory && user.inventory.length > 0) {
        const idx = user.inventory.findIndex(i => i.name === itemName);
        if (idx !== -1) {
            const item = user.inventory[idx];
            sellPrice = Math.floor((item.price || 50) * 0.6);
            if ((item.quantity || 1) > 1) {
                item.quantity -= 1;
            } else {
                user.inventory.splice(idx, 1);
            }
            found = true;
        }
    }

    if (!found && user.weapons && user.weapons.length > 0) {
        const idx = user.weapons.findIndex(i => i.name === itemName);
        if (idx !== -1) {
            const item = user.weapons[idx];
            sellPrice = Math.floor((item.price || 100) * 0.5);
            user.weapons.splice(idx, 1);
            user.attack = Math.max(1, user.attack - (item.attack || 0));
            found = true;
        }
    }

    if (!found && user.armor && user.armor.length > 0) {
        const idx = user.armor.findIndex(i => i.name === itemName);
        if (idx !== -1) {
            const item = user.armor[idx];
            sellPrice = Math.floor((item.price || 100) * 0.5);
            user.armor.splice(idx, 1);
            user.defense = Math.max(1, user.defense - (item.defense || 0));
            found = true;
        }
    }

    if (!found && user.potions && user.potions.length > 0) {
        const idx = user.potions.findIndex(i => i.name === itemName);
        if (idx !== -1) {
            const item = user.potions[idx];
            sellPrice = Math.floor((item.price || 50) * 0.6);
            if ((item.quantity || 1) > 1) {
                item.quantity -= 1;
            } else {
                user.potions.splice(idx, 1);
            }
            found = true;
        }
    }

    if (!found) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ غير موجود 〕━━╮\n┃\n┃ لم تجد هذا العنصر في حقيبتك.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    user.money += sellPrice;
    setUser(m.sender, user);

    await conn.sendMessage(m.chat, {
        text: `╭━━〔 💰 بيع ناجح 〕━━╮\n┃\n┃ بعت: ${itemName}\n┃ 💰 السعر: ${sellPrice} ذهب\n┃ 💰 المجموع: ${user.money} ذهب\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m });
};

command.help = ['بيع عنصر'];
command.tags = ['economy'];
command.command = ['sell', 'بيع'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
