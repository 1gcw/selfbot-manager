import { createCommand } from "@/bot/discord/base/command.js";

export default createCommand({
  dev: {
    active: false,
    only: true, // I haven't thought about what it will be like yet
  },
  name: 'config',
  description: 'discord',
  category: 'developer',
  permissions: ['Administrator'],

  async run(interaction, client) {
    await interaction.reply({ flags: ['Ephemeral'], content: '🚧 | Coming Soon' });
  }
});