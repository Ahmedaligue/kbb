import config from '../config.js';
import { getUser } from '../lib/database.js';
import { getAllCommands } from '../lib/loader.js';
import { formatNumber } from '../lib/helper.js';
import { sendMenu } from '../lib/buttons.js';

let command = async (m, { conn, command, pushname }) => {
    const user = getUser(m.sender);
    const allCmds = getAllCommands();

    const categories = {
        '⚔️ عالم RPG': [],
        '💰 الاقتصاد': [],
        '👥 الإدارة': [],
        '🎨 الوسائط': [],
        '👑 المالك': [],
        '❤️ اجتماعي': []
    };

    for (const [name, cmd] of allCmds) {
        if (cmd.owner) {
            categories['👑 المالك'].push({ name, help: cmd.help?.[0] || name });
        } else if (cmd.group) {
            categories['👥 الإدارة'].push({ name, help: cmd.help?.[0] || name });
        } else if (cmd.tags?.includes('rpg')) {
            categories['⚔️ عالم RPG'].push({ name, help: cmd.help?.[0] || name });
        } else if (cmd.tags?.includes('economy')) {
            categories['💰 الاقتصاد'].push({ name, help: cmd.help?.[0] || name });
        } else if (cmd.tags?.includes('media')) {
            categories['🎨 الوسائط'].push({ name, help: cmd.help?.[0] || name });
        } else if (cmd.tags?.includes('social')) {
            categories['❤️ اجتماعي'].push({ name, help: cmd.help?.[0] || name });
        } else {
            categories['⚔️ عالم RPG'].push({ name, help: cmd.help?.[0] || name });
        }
    }

    let menu = `╭━━━〔 🌑 KABANE BOT 🌑 〕━━━╮\n┃\n`;
    menu += `┃ 👤 المستخدم: ${pushname || 'محارب'}\n`;
    menu += `┃ ⚔️ المستوى: ${user.level}\n`;
    menu += `┃ 💰 الذهب: ${formatNumber(user.money)}\n`;
    menu += `┃ ❤️ الصحة: ${user.health}/${user.maxHealth}\n`;
    menu += `┃ ✨ الخبرة: ${user.xp}\n`;
    menu += `┃\n`;

    for (const [cat, cmds] of Object.entries(categories)) {
        if (cmds.length === 0) continue;
        menu += `┣━━━━━━〔 ${cat} 〕━━━━━━┫\n┃\n`;
        for (const c of cmds) {
            menu += `┃ ${config.prefix}${c.name}\n`;
        }
        menu += `┃\n`;
    }

    menu += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

    await sendMenu(conn, m.chat, menu, m);
};

command.help = ['القائمة الرئيسية'];
command.tags = ['rpg'];
command.command = ['menu', 'القائمة'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
