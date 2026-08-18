import { getUser, setUser } from '../lib/database.js';
import { spawnMonster, rollDrop, checkLevelUp } from '../lib/rpg.js';
import { calculateLevel, getRank } from '../lib/helper.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    if (user.health <= 0) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 💀 ميت 〕━━╮\n┃\n┃ أنت مصابة! استخدم .rest للنقاط.\n┃\n╰━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const monster = spawnMonster(Math.random() < 0.05);

    let monsterHp = monster.health;
    let playerHp = user.health;
    let battleLog = '';

    while (monsterHp > 0 && playerHp > 0) {
        const playerDmg = Math.max(1, user.attack - Math.floor(monster.defense * 0.3) + Math.floor(Math.random() * 5));
        monsterHp -= playerDmg;

        if (monsterHp <= 0) break;

        const monsterDmg = Math.max(1, monster.attack - Math.floor(user.defense * 0.3) + Math.floor(Math.random() * 3));
        playerHp -= monsterDmg;
    }

    user.health = Math.max(0, playerHp);

    if (monsterHp <= 0) {
        user.money += monster.reward;
        user.xp += monster.xp;
        user.kills += 1;

        const drop = rollDrop(monster);
        if (drop) {
            if (!user.inventory) user.inventory = [];
            const existing = user.inventory.find(i => i.name === drop);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                user.inventory.push({ name: drop, quantity: 1 });
            }
        }

        const levelResult = checkLevelUp(user);
        if (levelResult.results.length > 0) {
            for (const lr of levelResult.results) {
                user.level = lr.level;
                user.maxHealth += lr.healthGain;
                user.health = user.maxHealth;
                user.attack += lr.attackGain;
                user.defense += lr.defenseGain;
                user.money += lr.moneyGain;
            }

            user.xp = levelResult.finalXp;
            user.rank = getRank(user.level);

            let lvlMsg = `╭━━〔 🌟 ارتقاء المستوى 🌟 〕━━╮\n┃\n`;
            lvlMsg += `┃ 🎉 لقد وصلت إلى مستوى ${user.level}!\n┃\n`;
            lvlMsg += `┃ ⚔️ قوتك تزداد...\n┃ 🛡️ دفاعك يزداد...\n┃\n`;
            lvlMsg += `╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

            await conn.sendMessage(m.chat, { text: lvlMsg }, { quoted: m });
        }

        let result = `╭━━〔 ⚔️ صيد ناجح 〕━━╮\n┃\n`;
        result += `┃ 👹 ${monster.name}\n`;
        result += `┃ 💀 تم قتله!\n┃\n`;
        result += `┃ 🎁 المكافآت:\n`;
        result += `┃   💰 ${monster.reward} ذهب\n`;
        result += `┃   ✨ ${monster.xp} خبرة\n`;
        if (drop) result += `┃   📦 ${drop}\n`;
        result += `┃\n`;
        result += `┃ ❤️ صحتك: ${user.health}/${user.maxHealth}\n`;
        result += `╰━━━━━━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text: result }, { quoted: m });
    } else {
        user.kills += 0;
        user.deaths += 1;

        let result = `╭━━〔 💀 هزيمة 〕━━╮\n┃\n`;
        result += `┃ 👹 ${monster.name}\n`;
        result += `┃ ⚔️ لقد هزمك الوحش!\n┃\n`;
        result += `┃ 💔 فقدت كل صحتك.\n`;
        result += `┃ استخدم .rest للنقاط.\n`;
        result += `┃\n╰━━━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text: result }, { quoted: m });
    }

    setUser(m.sender, user);
};

command.help = ['الصيد في الغابة المظلمة'];
command.tags = ['rpg'];
command.command = ['hunt', 'صيد'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = true;
command.cooldown = 8;

export default command;
