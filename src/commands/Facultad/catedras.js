const {
    EmbedBuilder,
    SlashCommandBuilder,
    Client,
    ChatInputCommandInteraction,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
    .setName("links")
    .setDescription("Obtiene links a las páginas de las cátedras."),

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
      
      const embed = new EmbedBuilder()
      .setColor("Yellow")
      .setDescription(
        "Páginas de cada cátedra (primer año/primer semestre)"
      )
      .addFields({
        name: "Mate 1 (IDEAS)", value: "https://ideas.info.unlp.edu.ar/login", inline: true
      },
      {
        name: "CADP (IDEAS)", value: "https://ideas.info.unlp.edu.ar/login", inline: true
      },
      {
        name: "OC", value: "https://163.10.22.92/catedras/organizacion/", inline: true
      })
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
  
      await interaction.editReply({
        embeds: [embed],
      });
    },
  };