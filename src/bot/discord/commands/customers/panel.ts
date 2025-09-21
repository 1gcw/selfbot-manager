import { createCommand } from "@/bot/discord/base/command.js";
import { PanelHome } from "@/bot/discord/functions/panel/home.js";

export default createCommand({
  name: 'panel',
  description: 'Use to manage my feutures',
  category: 'customers',

  async run(interaction, client) {
    const panel = await PanelHome(interaction);
    await interaction.reply({ flags: ['Ephemeral'], ...panel });
  }
});