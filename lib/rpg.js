import config from '../config.js';
import { getUser, setUser } from './database.js';
import { pickRandom, randomInt, getRank, xpForLevel } from './helper.js';

export const monsters = [
    { name: '👹 غول الظلام', health: 80, attack: 12, defense: 5, reward: 200, xp: 50, rarity: 'common', drop: 'عظم غول' },
    { name: '🐺 ذئب الليل', health: 50, attack: 15, defense: 3, reward: 150, xp: 35, rarity: 'common', drop: 'فرو ذئب' },
    { name: '💀 فارس المقبرة', health: 120, attack: 18, defense: 10, reward: 350, xp: 80, rarity: 'rare', drop: 'خوذة فارس' },
    { name: '🧟 ميت متجول', health: 60, attack: 8, defense: 2, reward: 100, xp: 25, rarity: 'common', drop: 'عظام متحولة' },
    { name: '🐉 تنين الجحيم', health: 300, attack: 35, defense: 20, reward: 1000, xp: 200, rarity: 'epic', drop: 'حراقة تنين' },
    { name: '🦇 خفاش الوحوش', health: 30, attack: 10, defense: 1, reward: 80, xp: 20, rarity: 'common', drop: 'جناح خفاش' },
    { name: '🕷️ عنكبوت عملاق', health: 70, attack: 14, defense: 6, reward: 180, xp: 45, rarity: 'common', drop: 'خيط عنكبوت' },
    { name: '骷️ هيكلي حي', health: 90, attack: 16, defense: 8, reward: 250, xp: 60, rarity: 'rare', drop: 'bone مقدس' },
    { name: '👻 شبح الانتقام', health: 45, attack: 20, defense: 1, reward: 300, xp: 70, rarity: 'rare', drop: 'روح معلقة' },
    { name: '🌑 كائن الظلام', health: 200, attack: 25, defense: 15, reward: 600, xp: 120, rarity: 'epic', drop: 'نواة ظلام' },
    { name: '🐍 أفعى سامة', health: 40, attack: 18, defense: 2, reward: 130, xp: 30, rarity: 'common', drop: 'سم أفعى' },
    { name: '🦅 نسر الجماجم', health: 55, attack: 13, defense: 4, reward: 160, xp: 40, rarity: 'common', drop: 'ريشة نسر' }
];

export const rareMonsters = [
    { name: '🐲 أسد الجحيم', health: 500, attack: 45, defense: 30, reward: 2500, xp: 500, rarity: 'legendary', drop: 'قلب أسد' },
    { name: '⚔️ فارس الموت', health: 400, attack: 40, defense: 25, reward: 2000, xp: 400, rarity: 'legendary', drop: 'سيف الموت' },
    { name: '👁️ عين كاثولو', health: 800, attack: 50, defense: 35, reward: 5000, xp: 800, rarity: 'mythic', drop: 'ㄓ عين الحكمة' }
];

export const bosses = [
    { name: '👑 ملك الظلام', health: 1000, attack: 50, defense: 30, reward: 5000, xp: 1000, drops: ['تاج الظلام', 'سيف ملك الظلام', 'درع ملك الظلام'] },
    { name: '🐉 تنين الجحيم الأكبر', health: 1500, attack: 60, defense: 40, reward: 7500, xp: 1500, drops: ['حرق تنين أسطوري', 'درع تنين', '.Scale of Hell'] },
    { name: '💀 سيد المقابر', health: 800, attack: 45, defense: 25, reward: 4000, xp: 800, drops: ['مفتاح المقبرة', 'خاتم الموت'] },
    { name: '🌑 حاكم الظلال', health: 2000, attack: 70, defense: 50, reward: 10000, xp: 2000, drops: ['orb of shadows', 'crown of void', 'amulet of darkness'] }
];

export const miningOres = [
    { name: '🪨 حديد', rarity: 'common', price: 50, xp: 10, chance: 0.6 },
    { name: '⬜ فضة', rarity: 'uncommon', price: 120, xp: 20, chance: 0.25 },
    { name: '🟨 ذهب', rarity: 'rare', price: 300, xp: 40, chance: 0.1 },
    { name: '💎 ماس', rarity: 'epic', price: 800, xp: 80, chance: 0.03 },
    { name: '🟣 أحجار نادرة', rarity: 'rare', price: 500, xp: 60, chance: 0.015 },
    { name: '🔴 مواد أسطورية', rarity: 'legendary', price: 2000, xp: 150, chance: 0.005 }
];

export const fishTypes = [
    { name: '🐟 سمكة صغيرة', rarity: 'common', price: 30, xp: 8, chance: 0.4 },
    { name: '🐠 سمكة ملونة', rarity: 'common', price: 50, xp: 12, chance: 0.25 },
    { name: '🐡 بوجو', rarity: 'uncommon', price: 80, xp: 18, chance: 0.15 },
    { name: '🐟 تونة', rarity: 'rare', price: 200, xp: 35, chance: 0.1 },
    { name: '🦈 قرش', rarity: 'epic', price: 500, xp: 70, chance: 0.05 },
    { name: '🐋 حوت', rarity: 'legendary', price: 1500, xp: 150, chance: 0.02 },
    { name: '🐙 أخطبوط', rarity: 'rare', price: 300, xp: 45, chance: 0.03 }
];

export const workJobs = [
    { name: '⚔️ مرتزق', minMoney: 100, maxMoney: 400, xp: 30, message: 'قاتل الوحوش وحصل على أجرك!' },
    { name: '🏹 صياد', minMoney: 80, maxMoney: 300, xp: 25, message: 'صطدت الحيوانات البرية!' },
    { name: '⛏️ عامل منجم', minMoney: 120, maxMoney: 350, xp: 20, message: 'عملت في المنجم وحصلت على أجر!' },
    { name: '🧙 ساحر', minMoney: 150, maxMoney: 500, xp: 40, message: 'استخدمت السحر وحصلت على مكافأة!' },
    { name: '🛡️ حارس', minMoney: 100, maxMoney: 300, xp: 25, message: 'حرست القلعة بنجاح!' },
    { name: '🧑‍🍳 طباخ', minMoney: 90, maxMoney: 280, xp: 20, message: 'طبخت وجبة لذيذة وبعتها!' },
    { name: '📦 سمسار', minMoney: 60, maxMoney: 250, xp: 15, message: 'بعتت بضائع للتجار!' }
];

export const shopItems = {
    weapons: [
        { id: 'sword_1', name: '🗡️ سيف حديدي', attack: 5, critical: 2, price: 500, rarity: 'common', type: 'weapon' },
        { id: 'sword_2', name: '⚔️ سيف الفضة', attack: 12, critical: 5, price: 1500, rarity: 'uncommon', type: 'weapon' },
        { id: 'sword_3', name: '🔥 سيف النار', attack: 20, critical: 8, price: 4000, rarity: 'rare', type: 'weapon' },
        { id: 'sword_4', name: '💀 سيف الظلال', attack: 30, critical: 12, price: 8000, rarity: 'epic', type: 'weapon' },
        { id: 'sword_5', name: '⚡ سيف الصاعقة', attack: 40, critical: 15, price: 15000, rarity: 'legendary', type: 'weapon' },
        { id: 'axe_1', name: '🪓 فأس حديدي', attack: 8, critical: 3, price: 700, rarity: 'common', type: 'weapon' },
        { id: 'bow_1', name: '🏹 قوس الصياد', attack: 10, critical: 6, price: 1200, rarity: 'uncommon', type: 'weapon' },
        { id: 'staff_1', name: '🪄 عصا سحرية', attack: 15, critical: 10, price: 3000, rarity: 'rare', type: 'weapon' }
    ],
    armor: [
        { id: 'armor_1', name: '🛡️ درع حديدي', defense: 5, price: 600, rarity: 'common', type: 'armor' },
        { id: 'armor_2', name: '🛡️ درع فضي', defense: 12, price: 2000, rarity: 'uncommon', type: 'armor' },
        { id: 'armor_3', name: '🔥 درع النار', defense: 20, price: 5000, rarity: 'rare', type: 'armor' },
        { id: 'armor_4', name: '💀 درع الظلام', defense: 30, price: 10000, rarity: 'epic', type: 'armor' },
        { id: 'armor_5', name: '👑 درع الملك', defense: 45, price: 20000, rarity: 'legendary', type: 'armor' },
        { id: 'shield_1', name: '🛡️ درع صغير', defense: 3, price: 400, rarity: 'common', type: 'armor' }
    ],
    potions: [
        { id: 'potion_hp', name: '❤️ جرعة صحة', effect: 'heal', value: 50, price: 100, rarity: 'common', type: 'potion', stackable: true },
        { id: 'potion_hp_big', name: '❤️‍🩹 جرعة صحة كبيرة', effect: 'heal', value: 150, price: 300, rarity: 'uncommon', type: 'potion', stackable: true },
        { id: 'potion_atk', name: '⚔️ جرعة هجوم', effect: 'attack_buff', value: 10, price: 500, rarity: 'rare', type: 'potion', stackable: true },
        { id: 'potion_def', name: '🛡️ جرعة دفاع', effect: 'defense_buff', value: 10, price: 500, rarity: 'rare', type: 'potion', stackable: true },
        { id: 'potion_xp', name: '✨ جرعة خبرة', effect: 'xp_boost', value: 50, price: 800, rarity: 'epic', type: 'potion', stackable: true },
        { id: 'potion_full', name: '💖 جرعة ملء كامل', effect: 'full_heal', value: 999, price: 1000, rarity: 'epic', type: 'potion', stackable: true }
    ],
    misc: [
        { id: 'fishing_rod', name: '🎣 صنارة صيد', effect: 'fish', price: 300, rarity: 'common', type: 'misc', stackable: false },
        { id: 'pickaxe', name: '⛏️ معول تعدين', effect: 'mine', price: 300, rarity: 'common', type: 'misc', stackable: false },
        { id: 'teleport', name: '🌀 حجر انتقال', effect: 'teleport', price: 2000, rarity: 'rare', type: 'misc', stackable: true }
    ]
};

export const quests = [
    { id: 'hunt_5', name: '⚔️ قتل 5 وحوش', type: 'hunt', target: 5, reward: { money: 500, xp: 100 } },
    { id: 'hunt_10', name: '⚔️ قتل 10 وحوش', type: 'hunt', target: 10, reward: { money: 1000, xp: 200 } },
    { id: 'mine_5', name: '⛏️ جمع 5 معادن', type: 'mine', target: 5, reward: { money: 400, xp: 80 } },
    { id: 'mine_10', name: '⛏️ جمع 10 معادن', type: 'mine', target: 10, reward: { money: 800, xp: 160 } },
    { id: 'fish_5', name: '🎣 اصطد 5 أسماك', type: 'fish', target: 5, reward: { money: 300, xp: 60 } },
    { id: 'fish_10', name: '🎣 اصطد 10 أسماك', type: 'fish', target: 10, reward: { money: 600, xp: 120 } },
    { id: 'boss_1', name: '👑 اهزم Boss واحد', type: 'boss', target: 1, reward: { money: 2000, xp: 500 } },
    { id: 'pvp_3', name: '⚔️ اربح 3 مباريات PvP', type: 'pvp', target: 3, reward: { money: 1500, xp: 300 } }
];

export function calculateBattleDamage(attacker, defender) {
    const baseDamage = attacker.attack - (defender.defense * 0.5);
    const critChance = attacker.critical / 100;
    const isCrit = Math.random() < critChance;
    const multiplier = isCrit ? 1.5 + Math.random() * 0.5 : 1;
    const damage = Math.max(1, Math.floor(baseDamage * multiplier * (0.8 + Math.random() * 0.4)));
    return { damage, isCrit };
}

export function checkLevelUp(user) {
    const levelData = { level: user.level, xp: user.xp };
    const results = [];

    while (true) {
        const required = xpForLevel(levelData.level);
        if (levelData.xp >= required && levelData.level < config.rpg.maxLevel) {
            levelData.xp -= required;
            levelData.level++;

            const healthGain = config.rpg.healthPerLevel;
            const attackGain = config.rpg.attackPerLevel;
            const defenseGain = config.rpg.defensePerLevel;
            const moneyGain = config.rpg.moneyPerLevel;

            results.push({
                level: levelData.level,
                healthGain,
                attackGain,
                defenseGain,
                moneyGain
            });
        } else {
            break;
        }
    }

    return { results, finalXp: levelData.xp, finalLevel: levelData.level };
}

export function spawnMonster(isRare = false) {
    if (isRare || Math.random() < 0.05) {
        return pickRandom(rareMonsters);
    }
    return pickRandom(monsters);
}

export function rollDrop(monster) {
    if (Math.random() < 0.3) {
        return monster.drop || null;
    }
    return null;
}

export function rollOre() {
    const roll = Math.random();
    let cumulative = 0;
    for (const ore of miningOres) {
        cumulative += ore.chance;
        if (roll < cumulative) return ore;
    }
    return miningOres[0];
}

export function rollFish() {
    const roll = Math.random();
    let cumulative = 0;
    for (const fish of fishTypes) {
        cumulative += fish.chance;
        if (roll < cumulative) return fish;
    }
    return fishTypes[0];
}

export function getDailyReward(streak) {
    const baseMoney = 200;
    const baseXp = 50;
    const streakBonus = Math.min(streak, config.rpg.maxDailyStreak) * config.rpg.dailyStreakBonus;
    return {
        money: Math.floor(baseMoney * (1 + streakBonus)),
        xp: Math.floor(baseXp * (1 + streakBonus)),
        streak: streak + 1
    };
}

export function getWeeklyReward(level) {
    return {
        money: 1000 + (level * 200),
        xp: 200 + (level * 30),
        items: []
    };
}

export default {
    monsters, rareMonsters, bosses, miningOres, fishTypes, workJobs,
    shopItems, quests, calculateBattleDamage, checkLevelUp, spawnMonster,
    rollDrop, rollOre, rollFish, getDailyReward, getWeeklyReward
};
