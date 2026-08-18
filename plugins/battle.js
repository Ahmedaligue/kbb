import { getUser, setUser } from '../lib/database.js';
import { spawnMonster, calculateBattleDamage, rollDrop, checkLevelUp } from '../lib/rpg.js';
import { getRank } from '../lib/helper.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    if (user.health <= 0) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 💀 ميت 〕━━╮\n┃\n┃ أنت مصابة! استخدم .rest للنقاط.\n┃\n╰━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const monster = spawnMonster(false);
    const playerName = user.name || 'محارب';

    let userHp = user.health;
    let monsterHp = monster.health;
    let log = '';

    while (monsterHp > 0 && userHp > 0) {
        const playerDmg = calculateBattleDamage({ attack: user.attack, critical: user.critical }, { defense: monster.defense });
        monsterHp -= playerDmg.damage;
        log += `⚔️ ${playerName} هجم بـ ${playerDmg.damage}${playerDmg.isCrit ? ' 💥!' : ''}\n`;

        if (monsterHp <= 0) break;

        const monsterDmg = calculateBattleDamage({ attack: monster.attack, critical: 5 }, { defense: user.defense });
        userHp -= monsterDmg.damage;
        log += `👹 ${monster.name} هجمك بـ ${monsterDmg.damage}${monsterDmg.isCrit ? ' 💥!' : ''}\n`;
    }

    user.health = Math.max(0, userHp);

    if (monsterHp <= 0) {
        user.money += monster.reward;
        user.xp += monster.xp;
        user.kills += 1;

        const drop = rollDrop(monster);

        const levelResult = checkLevelUp(user);
        let lvlMsg = '';
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
            lvlMsg = `\n🌟 ارتقيت إلى مستوى ${user.level}!`;
        }

        let result = `╭━━〔 ⚔️ معركة 〕━━╮\n┃\n`;
        result += log;
        result += `┃\n┃ 👹 ${monster.name}\n`;
        result += `┃ 💀 هزمت الوحش!\n`;
        result += `┃ 💰 ${monster.reward} ذهب | ✨ ${monster.xp} خبرة\n`;
        if (drop) result += `┃ 📦 سقط: ${drop}\n`;
        result += `┃ ❤️ صحتك: ${user.health}/${user.maxHealth}`;
        if (lvlMsg) result += lvlMsg;
        result += `\n╰━━━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text: result }, { quoted: m });
    } else {
        user.deaths += 1;
        let result = `╭━━〔 💀 هزيمة 〕━━╮\n┃\n`;
        result += log;
        result += `┃\n┃ 👹 ${monster.name}\n`;
        result += `┃ ❌ هزمك الوحش!\n`;
        result += `┃ استخدم .rest للنقاط.\n`;
        result += `╰━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text: result }, { quoted: m });
    }

    setUser(m.sender, user);
};

command.help = ['قتال وحش عشوائي'];
command.tags = ['rpg'];
command.command = ['battle', 'قتال'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = true;
command.cooldown = 8;

export default command;
