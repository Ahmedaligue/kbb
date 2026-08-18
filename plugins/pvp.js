import { getUser, setUser } from '../lib/database.js';
import { calculateBattleDamage, checkLevelUp } from '../lib/rpg.js';
import { getRank, parseMention } from '../lib/helper.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);

    if (!m.isGroup) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 👥 للمجموعات فقط 〕━━╮\n┃\n┃ هذا الأمر في المجموعات فقط.\n┃\n╰━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const mentions = parseMention(args.join(' '));
    if (mentions.length < 1) {
        return conn.sendMessage(m.chat, {
            text: `╭━━〔 ⚔️ معركة 〕━━╮\n┃\n┃ الصيغة: ${'.pvp @'}اللاعب\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    const targetId = mentions[0];
    const targetIdClean = targetId.replace(/:.*@/, '@');

    if (targetIdClean === m.sender.replace(/:.*@/, '@')) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ لا يمكنك القتال مع نفسك!\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const target = getUser(targetId);

    if (!target.registered) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 ❌ غير مسجل 〕━━╮\n┃\n┃ هذا اللاعب غير مسجل.\n┃\n╰━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    if (target.health <= 0) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 💀 ميت 〕━━╮\n┃\n┃ هذا اللاعب ميت حالياً.\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    let userHp = user.health;
    let targetHp = target.health;
    let battleLog = '';

    let rounds = 0;
    while (userHp > 0 && targetHp > 0 && rounds < 20) {
        rounds++;

        const userDmg = calculateBattleDamage(user, target);
        targetHp -= userDmg.damage;
        battleLog += `⚔️ هجمت بـ ${userDmg.damage}${userDmg.isCrit ? ' 💥!' : ''}\n`;

        if (targetHp <= 0) break;

        const targetDmg = calculateBattleDamage(target, user);
        userHp -= targetDmg.damage;
        battleLog += `🛡️ ${target.name} هجمك بـ ${targetDmg.damage}${targetDmg.isCrit ? ' 💥!' : ''}\n`;
    }

    user.health = Math.max(0, userHp);
    target.health = Math.max(0, targetHp);

    if (userHp > 0 && targetHp <= 0) {
        user.wins += 1;
        user.kills += 1;
        target.losses += 1;
        target.deaths += 1;

        const reward = 200 + target.level * 50;
        user.money += reward;
        user.xp += 50;

        let result = `╭━━〔 ⚔️ انتصار 〕━━╮\n┃\n`;
        result += battleLog;
        result += `┃\n┃ 🏆 لقد فزت!\n`;
        result += `┃ 💰 المكافأة: ${reward} ذهب\n`;
        result += `┃ ❤️ صحتك: ${user.health}/${user.maxHealth}\n`;
        result += `╰━━━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text: result, mentions: [m.sender, targetId] }, { quoted: m });
    } else if (targetHp > 0 && userHp <= 0) {
        user.losses += 1;
        user.deaths += 1;
        target.wins += 1;
        target.kills += 1;

        const lost = Math.floor(user.money * 0.1);
        user.money = Math.max(0, user.money - lost);
        target.money += lost;

        let result = `╭━━〔 💀 هزيمة 〕━━╮\n┃\n`;
        result += battleLog;
        result += `┃\n┃ ❌ لقد هزمك ${target.name}!\n`;
        result += `┃ 💰 فقدت ${lost} ذهب\n`;
        result += `┃ استخدم .rest للنقاط.\n`;
        result += `╰━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text: result, mentions: [m.sender, targetId] }, { quoted: m });
    } else {
        let result = `╭━━〔 🤝 تعادل 〕━━╮\n┃\n`;
        result += battleLog;
        result += `┃\n┃ ⚔️ تعادلتما في المعركة!\n`;
        result += `╰━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text: result, mentions: [m.sender, targetId] }, { quoted: m });
    }

    setUser(m.sender, user);
    setUser(targetId, target);
};

command.help = ['معركة لاعب ضد لاعب'];
command.tags = ['rpg'];
command.command = ['pvp', 'معركة'];
command.group = true;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = true;
command.cooldown = 15;

export default command;
