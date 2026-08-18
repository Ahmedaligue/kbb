import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginsDir = join(__dirname, '..', 'plugins');

const commands = new Map();
let loadCount = 0;

export async function loadPlugins() {
    commands.clear();
    loadCount = 0;
    const files = await readdir(pluginsDir);
    const jsFiles = files.filter(f => f.endsWith('.js'));

    for (const file of jsFiles) {
        try {
            const plugin = await import(`../plugins/${file}`);

            const cmd = plugin.default || plugin.command || plugin;
            if (!cmd || !cmd.command) continue;

            const cmdNames = Array.isArray(cmd.command) ? cmd.command : [cmd.command];
            let loaded = false;

            for (const name of cmdNames) {
                const lower = name.toLowerCase();
                if (commands.has(lower)) {
                    console.log(`⚠️ أمر مكرر: ${lower} (تم تجاهل ${file})`);
                    continue;
                }
                commands.set(lower, cmd);
                loaded = true;
            }

            if (loaded) {
                loadCount++;
            }
        } catch (error) {
            console.log(`❌ خطأ في تحميل ${file}: ${error.message}`);
        }
    }

    console.log(`✦ تم تحميل ${loadCount} plugins | ${commands.size} أمر ✦`);
    return commands;
}

export function getCommand(name) {
    return commands.get(name.toLowerCase()) || null;
}

export function getAllCommands() {
    return commands;
}

export function reloadPlugins() {
    return loadPlugins();
}

export default { loadPlugins, getCommand, getAllCommands, reloadPlugins };
