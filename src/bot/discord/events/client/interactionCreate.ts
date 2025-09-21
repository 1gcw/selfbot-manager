import { type ChatInputCommandInteraction, type PermissionResolvable } from "discord.js";
import type { ExtendedClient } from "@/bot/index.js";
import { createEvent } from "@/bot/discord/base/event.js";


export default createEvent({
  name: 'InteractionCreate',

  async run(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);

      if (!cmd) {
        await interaction.reply({ flags: ['Ephemeral'], content: '❌ | Command not found.' });
        return;
      }

      if (cmd?.dev?.active == false) {
        await interaction.reply({ flags: ['Ephemeral'], content: '🚧 | Command is not active.' });
        return;
      }

      if (cmd?.dev?.only) {
        await interaction.reply({ flags: ['Ephemeral'], content: '❌ | Only **Developers** can use this command.' });
        return;
      }

      if (interaction.guild || cmd.permissions) {
        const permissionsNeeded = cmd.permissions as PermissionResolvable[];
        const memberPerms = interaction.memberPermissions;

        if (!memberPerms || !memberPerms.has(permissionsNeeded)) {
          await interaction.reply({ flags: ['Ephemeral'], content: '❌ | You are not allowed to use this command.' });
          return;
        }
      }

      try {
        await cmd.run(interaction, client);
      } catch (error) {
        console.log('\u001b[31m[CommandName] ' + interaction.commandName);
        console.error('\u001b[31m[ERROR] An error occurred in the command.\u001b[0m\n' + error);
        await interaction.reply({ flags: ['Ephemeral'], content: '🚧 | An internal server error has occurred. This issue has been logged and is being investigated. We apologize for the inconvenience.' });
      }
    }
  }
})