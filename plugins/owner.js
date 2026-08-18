import { exec } from 'child_process';
import { getUser, setUser, saveDB } from '../lib/database.js';
import db from '../lib/database.js';
import { reloadPlugins } from '../lib/loader.js';
import config from '../config.js';
import { parseMention } from '../lib/helper.js';

let command = async (m, { conn, args, command: cmd }) => {
    const sub = args[0]?.toLowerCase();

    if (cmd === 'owner' || sub === 'info') {
        let text = `╭━━〔 👑 معلومات المالك 〕━━╮\n┃\n`;
        text += `┃ 👑 المالك: ${config.owner[0]}\n`;
        text += `┃ 🤖 اسم البوت: ${config.botName}\n`;
        text += `┃ 📝 البادئة: ${config.prefix}\n`;
        text += `┃\n╰━━━━━━━━━━━━━━━━━━━━━╯`;
        return conn.sendMessage(m.chat, { text }, { quoted: m });
    }

    if (sub === 'broadcast' || sub === 'bc') {
        const text = args.slice(1).join(' ');
        if (!text) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ الصيغة: .owner bc [الرسالة]\n┃\n╰━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, {
            text: `╭━━〔 📢 إذاعة 〕━━╮\n┃\n┃ جاري الإرسال...\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });

        try {
            const groups = await conn.groupFetchAllParticipating();
            const groupIds = Object.keys(groups);
            let sent = 0;

            for (const gid of groupIds) {
                try {
                    await conn.sendMessage(gid, { text: `📢 ${text}\n\n✦🔥 KABANE BOT 🔥✦` });
                    sent++;
                    await new Promise(r => setTimeout(r, 1000));
                } catch (e) { }
            }

            await conn.sendMessage(m.chat, {
                text: `╭━━〔 ✅ اكتمل 〕━━╮\n┃\n┃ تم الإرسال إلى ${sent} مجموعة.\n┃\n╰━━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        } catch (e) {
            await conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ حدث خطأ في الإرسال.\n┃\n╰━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }
        return;
    }

    if (sub === 'reload' || sub === 'rl') {
        try {
            await reloadPlugins();
            await conn.sendMessage(m.chat, {
                text: '╭━━〔 ✅ إعادة تحميل 〕━━╮\n┃\n┃ تم إعادة تحميل الأ_plugins بنجاح.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        } catch (e) {
            await conn.sendMessage(m.chat, {
                text: `╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ ${e.message}\n┃\n╰━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        }
        return;
    }

    if (sub === 'eval' || sub === 'ev') {
        const code = args.slice(1).join(' ');
        if (!code) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ الصيغة: .owner eval [الكود]\n┃\n╰━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        try {
            let result = await eval(code);
            if (typeof result !== 'string') result = JSON.stringify(result, null, 2);
            result = result.substring(0, 3000);
            await conn.sendMessage(m.chat, {
                text: `╭━━〔 🔍 نتيجة 〕━━╮\n┃\n${result}\n┃\n╰━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        } catch (e) {
            await conn.sendMessage(m.chat, {
                text: `╭━━〔 ❌ خطأ 〕━━╮\n┃\n${e.message}\n┃\n╰━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        }
        return;
    }

    if (sub === 'exec' || sub === 'ex') {
        const cmdStr = args.slice(1).join(' ');
        if (!cmdStr) {
            return conn.sendMessage(m.chat, {
                text: '╭━━〔 ❌ خطأ 〕━━╮\n┃\n┃ الصيغة: .owner exec [الأمر]\n┃\n╰━━━━━━━━━━━━━━━╯'
            }, { quoted: m });
        }

        try {
            exec(cmdStr, { timeout: 30000 }, async (error, stdout, stderr) => {
                let result = stdout || stderr || 'تم التنفيذ';
                result = result.substring(0, 3000);
                await conn.sendMessage(m.chat, {
                    text: `╭━━〔 🔍 نتيجة 〕━━╮\n┃\n${result}\n┃\n╰━━━━━━━━━━━━━━━╯`
                }, { quoted: m });
            });
        } catch (e) {
            await conn.sendMessage(m.chat, {
                text: `╭━━〔 ❌ خطأ 〕━━╮\n┃\n${e.message}\n┃\n╰━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        }
        return;
    }

    if (sub === 'ban') {
        const mentions = parseMention(args.slice(1).join(' '));
        if (mentions.length < 1) {
            return conn.sendMessage(m.chat, {
                text: `╭━━〔 🚫 حظر 〕━━╮\n┃\n┃ الصيغة: .owner ban @الشخص\n┃\n╰━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        }

        const targetId = mentions[0];
        const target = getUser(targetId);
        target.banned = true;
        setUser(targetId, target);

        return conn.sendMessage(m.chat, {
            text: `╭━━〔 🚫 حظر 〕━━╮\n┃\n┃ تم حظر اللاعب.\n┃\n╰━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    if (sub === 'unban') {
        const mentions = parseMention(args.slice(1).join(' '));
        if (mentions.length < 1) {
            return conn.sendMessage(m.chat, {
                text: `╭━━〔 ✅ إلغاء الحظر 〕━━╮\n┃\n┃ الصيغة: .owner unban @الشخص\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
            }, { quoted: m });
        }

        const targetId = mentions[0];
        const target = getUser(targetId);
        target.banned = false;
        setUser(targetId, target);

        return conn.sendMessage(m.chat, {
            text: `╭━━〔 ✅ إلغاء الحظر 〕━━╮\n┃\n┃ تم إلغاء حظر اللاعب.\n┃\n╰━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: m });
    }

    if (sub === 'restart' || sub === 'rs') {
        await conn.sendMessage(m.chat, {
            text: '╭━━〔 🔄 إعادة تشغيل 〕━━╮\n┃\n┃ جاري إعادة تشغيل البوت...\n┃\n╰━━━━━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
        await saveDB();
        process.exit(0);
    }

    if (sub === 'clear') {
        await saveDB();
        return conn.sendMessage(m.chat, {
            text: '╭━━〔 🧹 مسح 〕━━╮\n┃\n┃ تم حفظ البيانات.\n┃\n╰━━━━━━━━━━━━━━━╯'
        }, { quoted: m });
    }

    if (sub === 'stats') {
        const allUsers = Object.keys(db.data?.users || {}).length;
        let text = `╭━━〔 📊 إحصائيات 〕━━╮\n┃\n`;
        text += `┃ 👥 المستخدمين: ${allUsers}\n`;
        text += `┃ 📦 الإصدار: 1.0.0\n`;
        text += `┃ 🔧 Node.js: ${process.version}\n`;
        text += `┃ 💾 الذاكرة: ${Math.floor(process.memoryUsage().heapUsed / 1024 / 1024)}MB\n`;
        text += `┃\n╰━━━━━━━━━━━━━━━━━━━━╯`;
        return conn.sendMessage(m.chat, { text }, { quoted: m });
    }

    conn.sendMessage(m.chat, {
        text: `╭━━〔 👑 أوامر المالك 〕━━╮\n┃\n┃ .owner info - معلومات\n┃ .owner bc [رسالة] - إذاعة\n┃ .owner reload - إعادة تحميل\n┃ .owner eval [كود] - تنفيذ JS\n┃ .owner exec [أمر] - تنفيذ أمر\n┃ .owner ban @شخص - حظر\n┃ .owner unban @شخص - إلغاء حظر\n┃ .owner restart - إعادة تشغيل\n┃ .owner clear - حفظ البيانات\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━╯`
    }, { quoted: m });
};

command.help = ['أوامر المالك'];
command.tags = ['owner'];
command.command = ['owner', 'مالك'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = true;
command.limit = false;
command.cooldown = 3;

export default command;
