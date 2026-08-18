import { getUser, setUser } from '../lib/database.js';
import { formatNumber } from '../lib/helper.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);

    if (args.length < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 🏦 سحب 〕━━╮\n┃\n┃ الصيغة: .withdraw [المبلغ]\n┃ أو: .withdraw all\n┃\n╰━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    let amount;
    if (args[0].toLowerCase() === 'all') {
        amount = user.bank;
    } else {
        amount = parseInt(args[0]);
    }

    if (isNaN(amount) || amount <= 0) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ أدخل مبلغ صحيح.\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    if (user.bank < amount) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 💰 لا يكفي 〕━━╮\n┃\n┃ لا تملك في البنك كافي!\n┃ البنك: ${formatNumber(user.bank)} ذهب\n┃\n╰━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    user.bank -= amount;
    user.money += amount;
    setUser(m.sender, user);

    await conn.sendMessage(m.chat, {
        text: `╭━━〔 ✅ سحب ناجح 〕━━╮\n┃\n┃ 💰 سحبت: ${formatNumber(amount)} ذهب\n┃ 🏦 البنك: ${formatNumber(user.bank)} ذهب\n┃ 💵 المحافظة: ${formatNumber(user.money)} ذهب\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m });
};

command.help = ['سحب من البنك'];
command.tags = ['economy'];
command.command = ['withdraw', 'سحب'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
