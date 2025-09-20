import { ExtendedClient } from "@/bot/index.js";
import { readdir } from "fs/promises";
import { dirname, join } from "path";

export async function LoadEvents(client: ExtendedClient) {
  try {
    const __dirname = dirname(import.meta.filename);
    const path = join(__dirname, '..', 'discord', 'events');
    const entries = await readdir(path, { withFileTypes: true });

    const filesToLoad: string[] = [];

    for (const entry of entries) {
      if (entry.isFile() && isValidExtension(entry.name)) {
        filesToLoad.push(join(path, entry.name));
      }

      if (entry.isDirectory()) {
        const subFiles = await readdir(join(path, entry.name))
        subFiles
          .filter(isValidExtension)
          .forEach(file => filesToLoad.push(join(path, entry.name, file)));
      }

      for (const filePath of filesToLoad) {
        const { default: event } = await import(`file://${filePath}`);
        if (!event?.name) {
          console.warn(`\u001b[33m[WARN] Invalid event at ${filePath}\u001b[0m`);
          continue;
        }

        if (event.once) {
          client.once(event.name, (...args) => event.run(...args, client));
        } else {
          client.on(event.name, (...args) => event.run(...args, client));
        }
      }
    }
  } catch (err) {
    console.error(`\u001b[31m[ERROR] Failed to load events:\u001b[0m`, err);
  }
}

function isValidExtension(file: string) {
  return file.endsWith('.ts') || file.endsWith('.js');
}