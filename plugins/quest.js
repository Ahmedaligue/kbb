import { getUser, setUser } from '../lib/database.js';
import { quests } from '../lib/rpg.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);

    if (!user.quests) user.quests = [];

    if (args.length > 0 && args[0] === 'claim') {
        const questIndex = parseInt(args[1]) - 1;
        if (isNaN(questIndex) || questIndex < 0 || questIndex >= user.quests.length) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ رقم المهمة غير صحيح.\n┃\n╰━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        const quest = user.quests[questIndex];
        if (quest.completed) {
            user.money += quest.reward.money;
            user.xp += quest.reward.xp;
            user.quests.splice(questIndex, 1);
            setUser(m.sender, user);

            return conn.sendMessage(m.chat, {
                text: `╭━━〔 ✅ مكافأة 〕━━╮\n┃\n┃ حصلت على مكافأة المهمة:\n┃ 💰 ${quest.reward.money} ذهب\n┃ ✨ ${quest.reward.xp} خبرة\n┃\n╰━━━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        } else {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ⏱️ لم تكمل 〕━━╮\n┃\n┃ هذه المهمة لم تكمل بعد.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }
    }

    if (args.length > 0 && args[0] === 'take') {
        const available = quests.filter(q => !user.quests.some(uq => uq.id === q.id));
        if (available.length === 0) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ✅ لا مزيد 〕━━╮\n┃\n┃ لا توجد مهام متاحة.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        const quest = available[0];
        user.quests.push({ ...quest, progress: 0, completed: false });
        setUser(m.sender, user);

        return conn.sendMessage(m.chat, {
            text: `╭━━〔 📜 مهمة جديدة 〕━━╮\n┃\n┃ 📋 ${quest.name}\n┃ 🎁 المكافأة: ${quest.reward.money} ذهب + ${quest.reward.xp} خبرة\n┃\n╰━━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    let text = `╭━━〔 📜 المهام 〕━━╮\n┃\n`;

    if (user.quests.length === 0) {
        text += `┃ لا تملك مهام حالياً.\n`;
        text += `┃ استخدم .quest take لأخذ مهمة.\n`;
    } else {
        user.quests.forEach((q, i) => {
            const status = q.completed ? '✅' : '⏳';
            text += `┃ ${status} ${i + 1}. ${q.name}\n`;
            text += `┃    التقدم: ${q.progress || 0}/${q.target}\n`;
        });
        text += `┃\n`;
        text += `┃ 📝 .quest claim [الرقم] - استلام مكافأة\n`;
    }

    text += `╰━━━━━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text }, { quoted: m });
};

command.help = ['نظام المهام'];
command.tags = ['rpg'];
command.command = ['quest', 'مهام'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 3;

export default command;
