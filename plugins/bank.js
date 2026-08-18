import { getUser } from '../lib/database.js';
import { formatNumber } from '../lib/helper.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    let text = `╭━━〔 🏦 البنك 〕━━╮\n┃\n`;
    text += `┃ 💰 المحافظة: ${formatNumber(user.money)} ذهب\n`;
    text += `┃ 🏦 حساب البنك: ${formatNumber(user.bank)} ذهب\n`;
    text += `┃\n`;
    text += `┃ 📝 الأوامر:\n`;
    text += `┃   ${'.deposit [المبلغ]'} - إيداع\n`;
    text += `┃   ${'.withdraw [المبلغ]'} - سحب\n`;
    text += `┃\n╰━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text }, { quoted: m });
};

command.help = ['عرض البنك'];
command.tags = ['economy'];
command.command = ['bank', 'بنك'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
