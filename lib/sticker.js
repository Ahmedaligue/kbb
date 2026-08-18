import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import config from '../config.js';

export async function createSticker(conn, msg, type = 'full') {
    try {
        let buffer;
        if (msg.quoted && (msg.quoted.message.imageMessage || msg.quoted.message.videoMessage)) {
            buffer = await downloadMediaMessage(msg.quoted, 'buffer', {});
        } else if (msg.message && (msg.message.imageMessage || msg.message.videoMessage)) {
            buffer = await downloadMediaMessage(msg, 'buffer', {});
        } else {
            return null;
        }

        if (!buffer) return null;

        let stickerType;
        switch (type) {
            case 'crop':
                stickerType = StickerTypes.CROPPED;
                break;
            case 'circle':
                stickerType = StickerTypes.CIRCLE;
                break;
            case 'round':
                stickerType = StickerTypes.ROUNDED;
                break;
            default:
                stickerType = StickerTypes.FULL;
        }

        const sticker = new Sticker(buffer, {
            pack: config.packname,
            author: config.author,
            type: stickerType,
            quality: 70
        });

        return await sticker.toBuffer();
    } catch (error) {
        console.error('خطأ في إنشاء الملصق:', error.message);
        return null;
    }
}

export default { createSticker };
