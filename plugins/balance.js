import { getUser } from '../lib/database.js';
import { formatNumber } from '../lib/helper.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    let text = `╭━━〔 💰 رصيدك 〕━━╮\n┃\n`;
    text += `┃ 💵 المحافظة: ${formatNumber(user.money)} ذهب\n`;
    text += `┃ 🏦 البنك: ${formatNumber(user.bank)} ذهب\n`;
    text += `┃ 💰 الإجمالي: ${formatNumber(user.money + user.bank)} ذهب\n`;
    text += `┃\n╰━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text }, { quoted: m });
};

command.help = ['عرض الرصيد'];
command.tags = ['economy'];
command.command = ['balance', 'balance', 'rsad'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
