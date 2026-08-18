import { createSticker } from '../lib/sticker.js';

let command = async (m, { conn }) => {
    let buffer = null;

    try {
        buffer = await createSticker(conn, m);
    } catch (e) { }

    if (!buffer) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ أرسل صورة أو رد على صورة\n┃ مع الأمر لإنشاء ملصق.\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
};

command.help = ['إنشاء ملصق'];
command.tags = ['media'];
command.command = ['sticker', 's', 'ملصق'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 5;

export default command;
