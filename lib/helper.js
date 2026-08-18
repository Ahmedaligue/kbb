import config from '../config.js';

export function isOwner(userId) {
    const cleanId = userId.replace(/:.*@/, '@').split('@')[0];
    return config.owner.some(o => cleanId === o || userId === o + '@s.whatsapp.net' || userId === o + '@lid');
}

export function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

export function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function parseMention(text) {
    const regex = /@(\d{5,16})/g;
    const matches = text.match(regex) || [];
    return matches.map(m => m.slice(1) + '@s.whatsapp.net');
}

export function getDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} يوم`;
    if (hours > 0) return `${hours} ساعة`;
    if (minutes > 0) return `${minutes} دقيقة`;
    return `${seconds} ثانية`;
}

export function getRemainingCooldown(lastUse, cooldownSeconds) {
    const now = Date.now();
    const elapsed = (now - lastUse) / 1000;
    if (elapsed >= cooldownSeconds) return 0;
    return Math.ceil(cooldownSeconds - elapsed);
}

export function progressBar(current, max, length = 10) {
    const filled = Math.round((current / max) * length);
    const empty = length - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

export function getRank(level) {
    if (level >= 100) return '🐉 أسطوري';
    if (level >= 80) return '👑 إلهي';
    if (level >= 60) return '⚔️ بطل';
    if (level >= 40) return '🛡️ محترف';
    if (level >= 25) return '🗡️ مقاتل';
    if (level >= 15) return '🏹 صياد';
    if (level >= 8) return '⛏️ عامل';
    return '💪 مبتدئ';
}

export function xpForLevel(level) {
    return Math.floor(config.rpg.xpPerLevel * Math.pow(config.rpg.xpMultiplier, level - 1));
}

export function calculateLevel(xp) {
    let level = 1;
    let required = config.rpg.xpPerLevel;
    while (xp >= required) {
        xp -= required;
        level++;
        required = xpForLevel(level);
    }
    return { level, currentXp: xp, nextLevelXp: required };
}

export function cleanPhoneNumber(phone) {
    return phone.replace(/[^0-9]/g, '');
}

export function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function truncate(str, len) {
    if (str.length <= len) return str;
    return str.slice(0, len - 3) + '...';
}

export function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
