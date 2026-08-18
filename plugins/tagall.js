let command = async (m, { conn }) => {
    if (!m.isGroup) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 👥 للمجموعات فقط 〕━━╮\n┃\n┃ هذا الأمر في المجموعات فقط.\n┃\n╰━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    try {
        const metadata = await conn.groupMetadata(m.chat);
        const participants = metadata.participants;
        const mentions = participants.map(p => p.id);

        let text = `╭━━〔 📢 تنبيه عام 〕━━╮\n┃\n`;
        text += `┃ 📣 تم استدعاء الجميع!\n┃\n`;

        for (const p of participants) {
            text += `┃ @${p.id.split('@')[0]}\n`;
        }

        text += `┃\n╰━━━━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text, mentions }, { quoted: m });
    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ حدث خطأ.\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }
};

command.help = ['استدعاء الجميع'];
command.tags = ['group'];
command.command = ['tagall', 'منشن'];
command.group = true;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 10;

export default command;
