import { getUser, setUser } from '../lib/database.js';

let command = async (m, { conn, args, pushname }) => {
    const user = getUser(m.sender);

    if (user.registered) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 ✅ مسجل 〕━━╮\n┃\n┃ أنت مسجل بالفعل!\n┃ استخدم .profile لعرض ملفك.\n┃\n╰━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const name = args.join(' ') || pushname || 'محارب مجهول';

    setUser(m.sender, {
        name,
        registered: true,
        level: 1,
        xp: 0,
        money: 500,
        bank: 0,
        health: 100,
        maxHealth: 100,
        energy: 100,
        maxEnergy: 100,
        attack: 10,
        defense: 5,
        critical: 5,
        luck: 5,
        rank: 'مبتدئ',
        inventory: [],
        weapons: [],
        armor: [],
        potions: [],
        kills: 0,
        deaths: 0,
        wins: 0,
        losses: 0
    });

    await conn.sendMessage(m.chat, {
        text: `╭━━〔 🎉 تسجيل ناجح 〕━━╮\n┃\n┃ مرحباً يا ${name}!\n┃\n┃ 🎁 مكافأة التسجيل:\n┃ 💰 500 ذهب\n┃ ❤️ 100 صحة\n┃ ⚔️ 10 هجوم\n┃ 🛡️ 5 دفاع\n┃\n┃ استخدم .menu لعرض الأوامر.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m });
};

command.help = ['التسجيل في اللعبة'];
command.tags = ['rpg'];
command.command = ['register', 'سجل'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 5;

export default command;
