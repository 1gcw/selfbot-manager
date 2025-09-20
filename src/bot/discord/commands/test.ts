import { createCommand } from "@/bot/discord/base/command.js";

export default createCommand({
  name: "ping",
  description: "Not Description",
  category: "Test",
  permissions: ['Administrator'],
  async run(interaction, client) {
    await interaction.reply({ flags: ['Ephemeral'], content: `${client.ws.ping}` });
  }
});