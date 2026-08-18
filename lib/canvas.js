import { createCanvas } from '@napi-rs/canvas';
import config from '../config.js';
import { getRank } from './helper.js';

export async function createProfileCard(user) {
    try {
        const width = 800;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, '#1a0a2e');
        gradient.addColorStop(1, '#0a0a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        ctx.strokeStyle = '#6d28d9';
        ctx.lineWidth = 1;
        ctx.strokeRect(15, 15, width - 30, height - 30);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(user.name || 'محارب مجهول', width / 2, 60);

        const rank = getRank(user.level);
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#a78bfa';
        ctx.fillText(rank, width / 2, 90);

        ctx.strokeStyle = '#4c1d95';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 110);
        ctx.lineTo(width - 50, 110);
        ctx.stroke();

        const stats = [
            { label: 'المستوى', value: `${user.level}`, icon: '⭐' },
            { label: 'الخبرة', value: `${user.xp}`, icon: '✨' },
            { label: 'الصحة', value: `${user.health}/${user.maxHealth}`, icon: '❤️' },
            { label: 'الهجوم', value: `${user.attack}`, icon: '⚔️' },
            { label: 'الدفاع', value: `${user.defense}`, icon: '🛡️' },
            { label: 'الذهب', value: `${user.money}`, icon: '💰' },
            { label: 'البنك', value: `${user.bank}`, icon: '🏦' },
            { label: 'القتل', value: `${user.kills}`, icon: '💀' }
        ];

        ctx.textAlign = 'right';
        let y = 150;
        stats.forEach(stat => {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '18px sans-serif';
            ctx.fillText(`${stat.icon} ${stat.label}:`, width / 2 - 10, y);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 18px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(stat.value, width / 2 + 10, y);
            ctx.textAlign = 'right';
            y += 35;
        });

        ctx.textAlign = 'center';
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('✦🔥 KABANE BOT 🔥✦', width / 2, height - 20);

        return canvas.toBuffer('image/png');
    } catch (error) {
        console.error('خطأ في إنشاء بطاقة الملف الشخصي:', error.message);
        return null;
    }
}

export default { createProfileCard };
