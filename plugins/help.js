import { getAllCommands } from '../lib/loader.js';
import config from '../config.js';

let command = async (m, { conn }) => {
    const allCmds = getAllCommands();

    const categories = {};
    for (const [name, cmd] of allCmds) {
        const tag = cmd.owner ? '👑 المالك' : cmd.group ? '👥 الإدارة' : cmd.tags?.[0] === 'economy' ? '💰 الاقتصاد' : cmd.tags?.[0] === 'media' ? '🎨 الوسائط' : cmd.tags?.[0] === 'social' ? '❤️ اجتماعي' : '⚔️ RPG';
        if (!categories[tag]) categories[tag] = [];
        categories[tag].push({ name, help: cmd.help?.[0] || '' });
    }

    let text = `╭━━〔 🆘 المساعدة 〕━━╮\n┃\n`;
    for (const [cat, cmds] of Object.entries(categories)) {
        text += `┣━━〔 ${cat} 〕━━\n┃\n`;
        for (const c of cmds) {
            text += `┃ ${config.prefix}${c.name}`;
            if (c.help) text += ` - ${c.help}`;
            text += '\n';
        }
        text += `┃\n`;
    }
    text += `╰━━━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text }, { quoted: m });
};

command.help = ['عرض المساعدة'];
command.tags = ['rpg'];
command.command = ['help', 'مساعدة'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
