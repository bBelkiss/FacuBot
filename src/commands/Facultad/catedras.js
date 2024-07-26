const {
  EmbedBuilder,
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("links")
    .setDescription("Consegui links a las páginas de las cátedras."),

  testMode: false,
  devOnly: false,
  deleted: false,
  userPermissions: [],
  botPermissions: [],
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {[]} args
   */
  run: async (client, interaction, args) => {
    const user = interaction.user;
    await interaction.deferReply();

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('selectYear')
      .setPlaceholder('Toca aca')
      .addOptions([
        {
          label: 'Primer año (1er Semestre)',
          description: 'Ver enlaces para el primer año, primer semestre',
          value: 'first_semester',
        },
        {
          label: 'Primer año (2do Semestre)',
          description: 'Ver enlaces para el primer año, segundo semestre',
          value: 'second_semester',
        },
        // Agrega más opciones según sea necesario
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const initialEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setDescription("Selecciona el año/semestre:");

    await interaction.editReply({
      embeds: [initialEmbed],
      components: [row],
    });

    const filter = (i) => i.customId === 'selectYear' && i.user.id === user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (i) => {
      if (i.isStringSelectMenu()) {
        let embed;

        if (i.values[0] === 'first_semester') {
          embed = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription("Páginas de cada cátedra (primer año/primer semestre)")
            .addFields(
              { name: "Mate 1 (IDEAS)", value: "https://ideas.info.unlp.edu.ar/login", inline: true },
              { name: "CADP (IDEAS)", value: "https://ideas.info.unlp.edu.ar/login", inline: true },
              { name: "OC", value: "https://163.10.22.92/catedras/organizacion/", inline: true }
            )
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setAuthor({
              name: user.tag,
              iconURL: user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
        } else if (i.values[0] === 'second_semester') {
          embed = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription("Páginas de cada cátedra (primer año/segundo semestre)")
            .addFields(
              { name: "Mate 2 (IDEAS)", value: "https://ideas.info.unlp.edu.ar/login", inline: true },
              { name: "Taller (no se lol)", value: "https://ideas.info.unlp.edu.ar/login", inline: true },
              { name: "Arquitectura de Computadoras (no se lol)", value: "https://ideas.info.unlp.edu.ar/login", inline: true }
            )
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setAuthor({
              name: user.tag,
              iconURL: user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
        }

        await i.update({
          embeds: [embed],
          components: [row],
        });
      }
    });

    collector.on('end', async () => {
      await interaction.editReply({
        components: [],
      });
    });
  },
};
