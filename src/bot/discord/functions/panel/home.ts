import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder, type ButtonInteraction, type CommandInteraction } from "discord.js";

export async function PanelHome(interaction: CommandInteraction | ButtonInteraction) {
  const embed = new EmbedBuilder()
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
    .setColor('Default')
    .setDescription(`> Hello **${interaction.user.displayName}**, welcome to the configuration panel. Just below is the configuration menu.`)
    .setTimestamp()
    .setFooter({ text: interaction.guild?.name || '', iconURL: interaction.guild?.iconURL() || undefined });

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder({ style: 2, customId: 'tutorials', label: 'Tutorials' })
  );

  const menu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder({
      disabled: true,
      customId: 'menu_manager',
      placeholder: 'Select an option',
      options: [
        { label: 'Null', value: 'null' }
      ]
    })
  );

  return { content: '', components: [buttons, menu], embeds: [embed] };
}