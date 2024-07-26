const {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    Client,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Pong!"),

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
      await interaction.deferReply();
  
      const reply = await interaction.fetchReply();
      const user = interaction.user;
  
      const ping = reply.createdTimestamp - interaction.createdTimestamp;
      const days = Math.floor(client.uptime / 86400000);
      const hours = Math.floor(client.uptime / 3600000) % 24;
      const minutes = Math.floor(client.uptime / 60000) % 60;
      const seconds = Math.floor(client.uptime / 1000) % 60;
  
      const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  
      const embed = new EmbedBuilder()
        .setTitle(`🏓 Pong! | Ping de ${client.user.username}`)
        .setColor("Yellow")
        .setDescription(
          `Aca te muestro las estadisticas del bot :)`
        )
        .addFields(
          {
            name: "Ping del Cliente",
            value: `${ping}ms`,
            inline: true,
          },
          {
            name: "Ping Websocket",
            value: `${client.ws.ping}ms`,
            inline: true,
          },
          {
            name: "Tiempo en línea",
            inline: true,
            value: `${uptime}`,
          }
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
  
      await interaction.editReply({
        embeds: [embed],
      });
    },
  };