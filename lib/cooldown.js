import NodeCache from 'node-cache';
import config from '../config.js';

const cooldownCache = new NodeCache({ stdTTL: 86400, checkperiod: 300 });

export function checkCooldown(userId, action, cooldownTime) {
    const key = `cd_${userId}_${action}`;
    const lastUse = cooldownCache.get(key);
    if (lastUse) {
        const elapsed = (Date.now() - lastUse) / 1000;
        if (elapsed < cooldownTime) {
            return {
                onCooldown: true,
                remaining: Math.ceil(cooldownTime - elapsed)
            };
        }
    }
    return { onCooldown: false, remaining: 0 };
}

export function setCooldown(userId, action) {
    const key = `cd_${userId}_${action}`;
    cooldownCache.set(key, Date.now());
}

export function clearCooldown(userId, action) {
    const key = `cd_${userId}_${action}`;
    cooldownCache.del(key);
}

export function clearAllCooldowns(userId) {
    const keys = cooldownCache.keys().filter(k => k.startsWith(`cd_${userId}_`));
    keys.forEach(k => cooldownCache.del(k));
}

export function formatCooldown(seconds) {
    if (seconds <= 0) return 'جاهز!';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h} ساعة ${m} دقيقة`;
    if (m > 0) return `${m} دقيقة ${s} ثانية`;
    return `${s} ثانية`;
}

export default { checkCooldown, setCooldown, clearCooldown, clearAllCooldowns, formatCooldown };
