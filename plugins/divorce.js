import { getUser, setUser, getMarriage, deleteMarriage } from '../lib/database.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    if (!user.marriedTo) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ غير متزوج 〕━━╮\n┃\n┃ أنت غير متزوج.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const partnerId = user.marriedTo;
    const partner = getUser(partnerId);

    const marriage = getMarriage(m.sender);
    if (marriage) {
        deleteMarriage(marriage.partner1 + '_' + marriage.partner2);
    }

    partner.marriedTo = null;
    user.marriedTo = null;
    setUser(m.sender, user);
    setUser(partnerId, partner);

    await conn.sendMessage(m.chat, {
        text: `╭━━〔 💔 طلاق 〕━━╮\n┃\n┃ تم الطلاق بين:\n┃ ${user.name || 'محارب'} 💔 ${partner.name || 'محارب'}\n┃\n╰━━━━━━━━━━━━━━╯`
    }, { quoted: m, mentions: [m.sender, partnerId] });
};

command.help = ['الطلاق'];
command.tags = ['social'];
command.command = ['divorce', 'طلاق'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 5;

export default command;
