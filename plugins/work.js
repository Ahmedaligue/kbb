import { getUser, setUser } from '../lib/database.js';
import { workJobs } from '../lib/rpg.js';
import { pickRandom, randomInt } from '../lib/helper.js';

let command = async (m, { conn }) => {
    const user = getUser(m.sender);

    const job = pickRandom(workJobs);
    const money = randomInt(job.minMoney, job.maxMoney);

    user.money += money;
    user.xp += job.xp;
    setUser(m.sender, user);

    let text = `╭━━〔 💼 عمل 〕━━╮\n┃\n`;
    text += `┃ ${job.name}\n`;
    text += `┃ ${job.message}\n┃\n`;
    text += `┃ 🎁 الأجر:\n`;
    text += `┃   💰 ${money} ذهب\n`;
    text += `┃   ✨ ${job.xp} خبرة\n`;
    text += `╰━━━━━━━━━━━━━━━━╯`;

    await conn.sendMessage(m.chat, { text }, { quoted: m });
};

command.help = ['العمل والكسب'];
command.tags = ['economy'];
command.command = ['work', 'عمل'];
command.group = false;
command.admin = false;
command.botAdmin = false;
command.owner = false;
command.limit = true;
command.cooldown = 10;

export default command;
