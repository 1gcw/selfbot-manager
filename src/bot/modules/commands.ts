import { ExtendedClient } from "@/bot/index.js";
import { readdir } from "fs/promises";
import { dirname, join } from "path";

export async function LoadCommands(client: ExtendedClient) {
  try {
    const __dirname = dirname(import.meta.filename);
    const path = join(__dirname, '..', 'discord', 'commands');
    const entries = await readdir(path, { withFileTypes: true });

    const filesToLoad: string[] = [];

    for (const entry of entries) {
      if (entry.isFile() && isValidExtension(entry.name)) {
        filesToLoad.push(join(path, entry.name));
      }

      if (entry.isDirectory()) {
        const subFiles = await readdir(join(path, entry.name));
        subFiles
          .filter(isValidExtension)
          .forEach(file => filesToLoad.push(join(path, entry.name, file)));
      }

      for (const filePath of filesToLoad) {
        const { default: cmd } = await import(`file://${filePath}`);
        if (!cmd?.name) {
          console.warn(`\u001b[33m[WARN] Invalid command at ${filePath}\u001b[0m`);
          continue;
        }
        client.slashCommands.set(cmd.name, cmd);
      }
    }

    client.on('clientReady', async () => {
      for (const guild of client.guilds.cache.values()) {
        await guild.commands.set([...client.slashCommands.values()]);
      }
    });

    client.on('guildCreate', async (guild) => {
      await guild.commands.set([...client.slashCommands.values()]);
    });
  } catch (err) {
    console.error(`\u001b[31m[ERROR] Failed to load commands:\u001b[0m`, err);
  }
}

function isValidExtension(file: string) {
  return file.endsWith('.ts') || file.endsWith('.js');
}