import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import config from '../config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '..', 'database.json');

const adapter = new JSONFile(filePath);
const db = new Low(adapter, {
    users: {},
    groups: {},
    settings: {},
    clans: {},
    marriages: {},
    transactions: [],
    logs: []
});

await db.read();
db.write = db.write.bind(db);

export function getUser(id) {
    if (!db.data.users[id]) {
        db.data.users[id] = {
            id,
            name: "",
            level: 1,
            xp: 0,
            money: 0,
            bank: 0,
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            attack: 10,
            defense: 5,
            critical: 5,
            luck: 5,
            rank: "مبتدئ",
            inventory: [],
            weapons: [],
            armor: [],
            potions: [],
            kills: 0,
            deaths: 0,
            wins: 0,
            losses: 0,
            lastDaily: 0,
            lastWeekly: 0,
            lastWork: 0,
            lastHunt: 0,
            lastMine: 0,
            lastFish: 0,
            lastHeal: 0,
            cooldowns: {},
            registered: false,
            premium: false,
            banned: false,
            muted: false,
            dailyStreak: 0,
            clan: null,
            clanRank: null,
            marriedTo: null,
            quests: [],
            title: "",
            profileBg: "default"
        };
        db.write();
    }
    return db.data.users[id];
}

export function setUser(id, data) {
    db.data.users[id] = { ...db.data.users[id], ...data };
    db.write();
}

export function getGroup(id) {
    if (!db.data.groups[id]) {
        db.data.groups[id] = {
            id,
            name: "",
            welcome: true,
            welcomeMsg: "",
            antiLink: false,
            antiSpam: true,
            autoAI: false,
            muted: false,
            muteUntil: 0,
            gameEnabled: true,
            pvpEnabled: true
        };
        db.write();
    }
    return db.data.groups[id];
}

export function setGroup(id, data) {
    db.data.groups[id] = { ...db.data.groups[id], ...data };
    db.write();
}

export function getSettings() {
    return db.data.settings;
}

export function setSettings(data) {
    db.data.settings = { ...db.data.settings, ...data };
    db.write();
}

export function getClan(name) {
    return db.data.clans[name] || null;
}

export function createClan(name, leader) {
    db.data.clans[name] = {
        name,
        leader,
        members: [leader],
        ranks: { [leader]: "قائد" },
        level: 1,
        xp: 0,
        treasury: 0,
        description: "",
        createdAt: Date.now()
    };
    db.write();
    return db.data.clans[name];
}

export function deleteClan(name) {
    delete db.data.clans[name];
    db.write();
}

export function getAllClans() {
    return db.data.clans;
}

export function getMarriage(id) {
    for (const [key, val] of Object.entries(db.data.marriages)) {
        if (val.partner1 === id || val.partner2 === id) return val;
    }
    return null;
}

export function createMarriage(p1, p2) {
    const id = `marry_${p1}_${p2}`;
    db.data.marriages[id] = {
        partner1: p1,
        partner2: p2,
        marriedAt: Date.now()
    };
    db.write();
    return db.data.marriages[id];
}

export function deleteMarriage(id) {
    delete db.data.marriages[id];
    db.write();
}

export function addTransaction(tx) {
    db.data.transactions.push({ ...tx, timestamp: Date.now() });
    if (db.data.transactions.length > 500) db.data.transactions = db.data.transactions.slice(-500);
    db.write();
}

export function addLog(log) {
    db.data.logs.push({ ...log, timestamp: Date.now() });
    if (db.data.logs.length > 1000) db.data.logs = db.data.logs.slice(-1000);
    db.write();
}

export function saveDB() {
    return db.write();
}

export default db;
