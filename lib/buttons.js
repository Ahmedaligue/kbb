import { proto } from '@whiskeysockets/baileys';

export async function sendButtons(conn, chat, text, buttons, quoted) {
    try {
        if (proto.Message.InteractiveMessage) {
            const msg = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2
                        },
                        interactiveMessage: {
                            body: { text },
                            footer: { text: '✦🔥 KABANE BOT 🔥✦' },
                            buttons: buttons.map((btn, i) => ({
                                buttonId: btn.id || `btn_${i}`,
                                buttonText: { displayText: btn.text },
                                type: 1
                            })),
                            header: { title: '' },
                            nativeFlowMessage: {
                                buttons: buttons.map((btn, i) => ({
                                    name: 'quick_reply',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: btn.text,
                                        id: btn.id || `btn_${i}`
                                    })
                                }))
                            }
                        }
                    }
                }
            };
            return await conn.sendMessage(chat, msg, { quoted });
        }
    } catch (e) {
        // Fallback: plain text with button info
    }

    let body = text + '\n\n';
    buttons.forEach((btn, i) => {
        body += `❬ ${i + 1}❭ ${btn.text}\n`;
    });
    body += '\n✦ اختر عن طريق الكتابة ✦';
    return await conn.sendMessage(chat, { text: body }, { quoted });
}

export async function sendList(conn, chat, title, text, buttonText, rows, quoted) {
    try {
        const msg = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: {
                        body: { text },
                        footer: { text: '✦🔥 KABANE BOT 🔥✦' },
                        header: { title },
                        nativeFlowMessage: {
                            buttons: [{
                                name: 'single_select',
                                buttonParamsJson: JSON.stringify({
                                    title: buttonText,
                                    sections: [{
                                        title,
                                        rows: rows.map((row, i) => ({
                                            title: row.title,
                                            description: row.description || '',
                                            rowId: row.id || `list_${i}`
                                        }))
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        };
        return await conn.sendMessage(chat, msg, { quoted });
    } catch (e) {
        let body = `*${title}*\n\n${text}\n\n`;
        rows.forEach((row, i) => {
            body += `▸ ${row.title}`;
            if (row.description) body += ` - ${row.description}`;
            body += '\n';
        });
        return await conn.sendMessage(chat, { text: body }, { quoted });
    }
}

export async function sendMenu(conn, chat, content, quoted) {
    return await conn.sendMessage(chat, { text: content }, { quoted });
}

export default { sendButtons, sendList, sendMenu };
