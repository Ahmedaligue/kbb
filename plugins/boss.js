import { getUser, setUser } from '../lib/database.js';
import { bosses, calculateBattleDamage, checkLevelUp } from '../lib/rpg.js';
import { getRank, pickRandom } from '../lib/helper.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    if (user.health <= 0) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 💀 ميت 〕━━╮\n┃\n┃ أنت مصابة! استخدم .rest للنقاط.\n┃\n╰━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const boss = pickRandom(bosses);

    let userHp = user.health;
    let bossHp = boss.health;
    let log = '';
    let turnCount = 0;

    while (bossHp > 0 && userHp > 0 && turnCount < 30) {
        turnCount++;
        const playerDmg = calculateBattleDamage({ attack: user.attack, critical: user.critical }, { defense: boss.defense });
        bossHp -= playerDmg.damage;
        log += `⚔️ هجمت بـ ${playerDmg.damage}${playerDmg.isCrit ? ' 💥!' : ''}\n`;

        if (bossHp <= 0) break;

        const bossDmg = calculateBattleDamage({ attack: boss.attack, critical: 10 }, { defense: user.defense });
        userHp -= bossDmg.damage;
        log += `👹 ${boss.name} هجمك بـ ${bossDmg.damage}${bossDmg.isCrit ? ' 💥!' : ''}\n`;
    }

    user.health = Math.max(0, userHp);

    if (bossHp <= 0) {
        user.money += boss.reward;
        user.xp += boss.xp;
        user.kills += 1;

        if (!user.inventory) user.inventory = [];
        const droppedItem = pickRandom(boss.drops);
        if (droppedItem) {
            const existing = user.inventory.find(i => i.name === droppedItem);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                user.inventory.push({ name: droppedItem, quantity: 1 });
            }
        }

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

        let result = `╭━━〔 👑 معركة Boss 〕━━╮\n┃\n`;
        result += log;
        result += `┃\n┃ 👑 ${boss.name}\n`;
        result += `┃ 💀 هزمت Boss!\n`;
        result += `┃ 💰 ${boss.reward} ذهب | ✨ ${boss.xp} خبرة\n`;
        if (droppedItem) result += `┃ 📦 سقط: ${droppedItem}\n`;
        result += `┃ ❤️ صحتك: ${user.health}/${user.maxHealth}`;
        if (lvlMsg) result += lvlMsg;
        result += `\n╰━━━━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text: result }, { quoted: m });
    } else {
        user.deaths += 1;
        let result = `╭━━〔 💀 هزيمة Boss 〕━━╮\n┃\n`;
        result += log;
        result += `┃\n┃ 👑 ${boss.name}\n`;
        result += `┃ ❌ هزمك Boss!\n`;
        result += `┃ استخدم .rest للنقاط.\n`;
        result += `╰━━━━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text: result }, { quoted: m });
    }

    setUser(m.sender, user);
};

command.help = ['معركة Boss'];
command.tags = ['rpg'];
command.command = ['boss', 'بوس'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = true;
command.cooldown = 30;

export default command;
