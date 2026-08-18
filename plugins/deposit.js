import { getUser, setUser } from '../lib/database.js';
import { formatNumber } from '../lib/helper.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);

    if (args.length < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 🏦 إيداع 〕━━╮\n┃\n┃ الصيغة: .deposit [المبلغ]\n┃ أو: .deposit all\n┃\n╰━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    let amount;
    if (args[0].toLowerCase() === 'all') {
        amount = user.money;
    } else {
        amount = parseInt(args[0]);
    }

    if (isNaN(amount) || amount <= 0) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ أدخل مبلغ صحيح.\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    if (user.money < amount) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 💰 لا يكفي 〕━━╮\n┃\n┃ لا تملك ذهب كافي!\n┃ تملك ${formatNumber(user.money)} ذهب\n┃\n╰━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    user.money -= amount;
    user.bank += amount;
    setUser(m.sender, user);

    await conn.sendMessage(m.chat, {
        text: `╭━━〔 ✅ إيداع ناجح 〕━━╮\n┃\n┃ 💰 أودعت: ${formatNumber(amount)} ذهب\n┃ 🏦 البنك: ${formatNumber(user.bank)} ذهب\n┃ 💵 المحافظة: ${formatNumber(user.money)} ذهب\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m });
};

command.help = ['إيداع في البنك'];
command.tags = ['economy'];
command.command = ['deposit', 'إيداع'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
