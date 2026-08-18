import { getUser, setUser, getClan, createClan, deleteClan, getAllClans } from '../lib/database.js';
import { parseMention } from '../lib/helper.js';

let command = async (m, { conn, args }) => {
    const user = getUser(m.sender);
    const sub = args[0]?.toLowerCase();

    if (!sub || sub === 'list') {
        const clans = getAllClans();
        let text = `╭━━〔 🏰 العشائر 〕━━╮\n┃\n`;

        const clanNames = Object.keys(clans);
        if (clanNames.length === 0) {
            text += `┃ لا توجد عشائر بعد.\n`;
            text += `┃ استخدم .clan create [اسم]\n`;
        } else {
            clanNames.forEach((name, i) => {
                const c = clans[name];
                text += `┃ ${i + 1}. ${name}\n`;
                text += `┃    👑 القائد: ${c.leader}\n`;
                text += `┃    👥 الأعضاء: ${c.members.length}\n`;
                text += `┃    ⭐ المستوى: ${c.level}\n`;
            });
        }

        text += `┃\n╰━━━━━━━━━━━━━━━━━━━━╯`;
        return conn.sendMessage(m.chat, { text }, { quoted: m });
    }

    if (sub === 'create') {
        if (user.clan) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ في عشيرة 〕━━╮\n┃\n┃ أنت في عشيرة بالفعل.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        const name = args.slice(1).join(' ');
        if (!name) {
            return conn.sendMessage(m.chat, {
                text: `╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ الصيغة: .clan create [اسم العشيرة]\n┃\n╰━━━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        }

        if (getClan(name)) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ موجود 〕━━╮\n┃\n┃ هذا الاسم مستخدم بالفعل.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        if (user.money < 1000) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 💰 لا يكفي 〕━━╮\n┃\n┃ تحتاج 1000 ذهب لإنشاء عشيرة.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        user.money -= 1000;
        user.clan = name;
        user.clanRank = 'قائد';
        createClan(name, m.sender);
        setUser(m.sender, user);

        return conn.sendMessage(m.chat, {
            text: `╭━━〔 🏰 عشيرة جديدة 〕━━╮\n┃\n┃ 🎉 أنشأت العشيرة: ${name}\n┃ 💰 التكلفة: 1000 ذهب\n┃\n╰━━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    if (sub === 'join') {
        const clanName = args.slice(1).join(' ');
        const clan = getClan(clanName);
        if (!clan) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ غير موجودة 〕━━╮\n┃\n┃ هذه العشيرة غير موجودة.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        if (user.clan) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ في عشيرة 〕━━╮\n┃\n┃ غادر عشيرتك أولاً.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        user.clan = clanName;
        user.clanRank = 'عضو';
        clan.members.push(m.sender);
        setUser(m.sender, user);

        return conn.sendMessage(m.chat, {
            text: `╭━━〔 🏰 انضمام 〕━━╮\n┃\n┃ انضممت إلى عشيرة: ${clanName}\n┃\n╰━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    if (sub === 'leave') {
        if (!user.clan) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ لا عشيرة 〕━━╮\n┃\n┃ أنت لا تنتمي لأي عشيرة.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        const clan = getClan(user.clan);
        if (clan) {
            clan.members = clan.members.filter(m => m !== m.sender);
            if (clan.members.length === 0) {
                deleteClan(user.clan);
            }
        }

        const clanName = user.clan;
        user.clan = null;
        user.clanRank = null;
        setUser(m.sender, user);

        return conn.sendMessage(m.chat, {
            text: `╭━━〔 👋 مغادرة 〕━━╮\n┃\n┃ غادرت عشيرة: ${clanName}\n┃\n╰━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    if (sub === 'info') {
        const clanName = user.clan;
        if (!clanName) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ لا عشيرة 〕━━╮\n┃\n┃ أنت لا تنتمي لأي عشيرة.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        const clan = getClan(clanName);
        if (!clan) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ غير موجودة 〕━━╮\n┃\n┃ عشيرتك غير موجودة.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        let text = `╭━━〔 🏰 معلومات العشيرة 〕━━╮\n┃\n`;
        text += `┃ 📛 الاسم: ${clan.name}\n`;
        text += `┃ 👑 القائد: ${clan.leader}\n`;
        text += `┃ 👥 الأعضاء: ${clan.members.length}\n`;
        text += `┃ ⭐ المستوى: ${clan.level}\n`;
        text += `┃ ✨ الخبرة: ${clan.xp}\n`;
        text += `┃ 💰 الخزينة: ${clan.treasury}\n`;
        text += `┃\n╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

        return conn.sendMessage(m.chat, { text }, { quoted: m });
    }

    if (sub === 'members') {
        const clan = getClan(user.clan);
        if (!clan) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ لا عشيرة 〕━━╮\n┃\n┃ أنت لا تنتمي لأي عشيرة.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        let text = `╭━━〔 👥 أعضاء العشيرة 〕━━╮\n┃\n`;
        clan.members.forEach((m, i) => {
            const rank = clan.ranks[m] || 'عضو';
            text += `┃ ${i + 1}. ${m.split('@')[0]} [${rank}]\n`;
        });
        text += `┃\n╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

        return conn.sendMessage(m.chat, { text }, { quoted: m });
    }

    if (sub === 'kick') {
        if (user.clanRank !== 'قائد') {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 👑 للقائد فقط 〕━━╮\n┃\n┃ هذا الأمر للقائد فقط.\n┃\n╰━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        const mentions = parseMention(args.slice(1).join(' '));
        if (mentions.length < 1) {
            return conn.sendMessage(m.chat, {
                text: `╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ الصيغة: .clan kick @العضو\n┃\n╰━━━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        }

        const targetId = mentions[0];
        const target = getUser(targetId);

        if (target.clan !== user.clan) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ ليس في العشيرة 〕━━╮\n┃\n┃ هذا اللاعب ليس في عشيرتك.\n┃\n╰━━━━━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        const clan = getClan(user.clan);
        clan.members = clan.members.filter(m => m !== targetId);
        target.clan = null;
        target.clanRank = null;
        setUser(targetId, target);

        return conn.sendMessage(m.chat, {
            text: `╭━━〔 🚪 طرد 〕━━╮\n┃\n┃ تم طرد ${targetId.split('@')[0]} من العشيرة.\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    conn.sendMessage(m.chat, {
        text: `╭━━〔 🏰 أوامر العشيرة 〕━━╮\n┃\n┃ .clan create [اسم] - إنشاء\n┃ .clan join [اسم] - انضمام\n┃ .clan leave - مغادرة\n┃ .clan info - معلومات\n┃ .clan members - الأعضاء\n┃ .clan kick @العضو - طرد\n┃ .clan list - القائمة\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m });
};

command.help = ['نظام العشائر'];
command.tags = ['social'];
command.command = ['clan', 'عشيرة'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = false;
command.cooldown = 5;

export default command;
