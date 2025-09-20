import type { ExtendedClient } from "@/bot/index.js";
import { ChatInputCommandInteraction, ApplicationCommandOption, PermissionResolvable, type CommandInteraction } from "discord.js";

interface Command {
  name: string;
  description?: string;
  category?: string;
  options?: ApplicationCommandOption[];
  permissions?: PermissionResolvable[];
  cooldown?: number;
  dev?: {
    active?: boolean;
    only?: boolean;
  };
  run: (interaction: ChatInputCommandInteraction | CommandInteraction, client: ExtendedClient) => any;
}


export function createCommand(command: Command): Command {
  if (!command.name) throw new Error("Missing command name");
  if (!command.description) throw new Error("Missing command description");
  if (!command.run) throw new Error(`Command "${command.name}" is missing execute()`);

  return command;
}
