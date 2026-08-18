import { getUser, setUser } from '../lib/database.js';
import { shopItems } from '../lib/rpg.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);

    if (args.length < 2) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 🛒 شراء 〕━━╮\n┃\n┃ الصيغة: .buy [القسم] [الرقم]\n┃\n┃ ${'.buy weapons 1'}\n┃ ${'.buy armor 2'}\n┃ ${'.buy potions 1'}\n┃\n╰━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const category = args[0].toLowerCase();
    const index = parseInt(args[1]) - 1;

    if (!shopItems[category] || isNaN(index) || index < 0 || index >= shopItems[category].length) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ قسم أو رقم غير صحيح.\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const item = shopItems[category][index];

    if (user.money < item.price) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 💰 لا يكفي 〕━━╮\n┃\n┃ لا تملك ذهب كافي!\n┃ تحتاج ${item.price} ذهب\n┃ تملك ${user.money} ذهب\n┃\n╰━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    user.money -= item.price;

    if (category === 'potions') {
        if (!user.potions) user.potions = [];
        const existing = user.potions.find(p => p.id === item.id);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            user.potions.push({ ...item, quantity: 1 });
        }
    } else if (category === 'weapons') {
        if (!user.weapons) user.weapons = [];
        user.weapons.push(item);
        user.attack += item.attack || 0;
        if (item.critical) user.critical += item.critical;
    } else if (category === 'armor') {
        if (!user.armor) user.armor = [];
        user.armor.push(item);
        user.defense += item.defense || 0;
    } else {
        if (!user.inventory) user.inventory = [];
        user.inventory.push({ ...item, quantity: 1 });
    }

    setUser(m.sender, user);

    await conn.sendMessage(m.chat, {
        text: `╭━━〔 ✅ شراء ناجح 〕━━╮\n┃\n┃ اشتريت: ${item.name}\n┃ 💰 السعر: ${item.price} ذهب\n┃ 💰 المتبقي: ${user.money} ذهب\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m });
};

command.help = ['شراء عنصر'];
command.tags = ['economy'];
command.command = ['buy', 'شراء'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
