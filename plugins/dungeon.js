import { getUser, setUser } from '../lib/database.js';
import { spawnMonster, calculateBattleDamage, rollDrop, checkLevelUp, bosses } from '../lib/rpg.js';
import { getRank, randomInt, pickRandom } from '../lib/helper.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);

    if (user.health <= 0) {
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 💀 ميت 〕━━╮\n┃\n┃ أنت مصابة! استخدم .rest للنقاط.\n┃\n╰━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    const totalFloors = 5;
    let currentFloor = 1;
    let totalReward = 0;
    let totalXp = 0;
    let userHp = user.health;
    let log = '';
    let survived = true;

    while (currentFloor <= totalFloors && survived) {
        log += `\n┃ 🏰 المرحلة ${currentFloor}/${totalFloors}\n`;
        log += `┃ ─────────────\n`;

        let monster;
        if (currentFloor === totalFloors) {
            monster = { name: '👑 حارس الزنزانة', health: 200 + currentFloor * 50, attack: 20 + currentFloor * 5, defense: 10 + currentFloor * 3, reward: 500 + currentFloor * 200, xp: 100 + currentFloor * 50 };
        } else {
            monster = spawnMonster(false);
            monster.health = Math.floor(monster.health * (0.5 + currentFloor * 0.3));
            monster.attack = Math.floor(monster.attack * (0.5 + currentFloor * 0.2));
        }

        let monsterHp = monster.health;
        while (monsterHp > 0 && userHp > 0) {
            const playerDmg = calculateBattleDamage({ attack: user.attack, critical: user.critical }, { defense: monster.defense });
            monsterHp -= playerDmg.damage;

            if (monsterHp <= 0) break;

            const monsterDmg = calculateBattleDamage({ attack: monster.attack, critical: 5 }, { defense: user.defense });
            userHp -= monsterDmg.damage;
        }

        if (userHp <= 0) {
            survived = false;
            log += `┃ ❌ هزمك ${monster.name}!\n`;
        } else {
            totalReward += monster.reward;
            totalXp += monster.xp;
            log += `┃ ✅ هزمت ${monster.name}\n`;
            log += `┃ 💰 ${monster.reward} ذهب | ✨ ${monster.xp} خبرة\n`;

            if (currentFloor === totalFloors) {
                const drop = rollDrop(monster);
                if (drop && user.inventory) {
                    const existing = user.inventory.find(i => i.name === drop);
                    if (existing) {
                        existing.quantity = (existing.quantity || 1) + 1;
                    } else {
                        user.inventory.push({ name: drop, quantity: 1 });
                    }
                }
            }

            if (Math.random() < 0.3 && currentFloor < totalFloors) {
                const heal = Math.floor(user.maxHealth * 0.2);
                userHp = Math.min(user.maxHealth, userHp + heal);
                log += `┃ ❤️ وجدت جرعة +${heal} صحة\n`;
            }
        }

        currentFloor++;
    }

    user.health = Math.max(0, userHp);
    user.money += totalReward;
    user.xp += totalXp;

    if (survived) {
        user.kills += totalFloors;

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
            lvlMsg = `\n┃ 🌟 ارتقيت إلى مستوى ${user.level}!`;
        }

        let result = `╭━━〔 🏰 الزنزانة 〕━━╮\n┃\n`;
        result += `┃ 🎉 أكملت الزنزانة!\n`;
        result += log;
        result += `┃\n┃ 🏆 المكافآت الإجمالية:\n`;
        result += `┃   💰 ${totalReward} ذهب\n`;
        result += `┃   ✨ ${totalXp} خبرة\n`;
        result += `┃ ❤️ صحتك: ${user.health}/${user.maxHealth}`;
        if (lvlMsg) result += lvlMsg;
        result += `\n╰━━━━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text: result }, { quoted: m });
    } else {
        let result = `╭━━〔 🏰 الزنزانة 〕━━╮\n┃\n`;
        result += log;
        result += `┃\n┃ 💀 هزمك في الزنزانة!\n`;
        result += `┃ 💰 حصلت على ${totalReward} ذهب\n`;
        result += `┃ استخدم .rest للنقاط.\n`;
        result += `╰━━━━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(m.chat, { text: result }, { quoted: m });
    }

    setUser(m.sender, user);
};

command.help = ['دخول الزنزانة'];
command.tags = ['rpg'];
command.command = ['dungeon', 'زنزانة'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = true;
command.cooldown = 60;

export default command;
