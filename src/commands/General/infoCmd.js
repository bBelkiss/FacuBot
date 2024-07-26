const {
    SlashCommandBuilder,
    EmbedBuilder,
    time,
    discordSort,
    ChatInputCommandInteraction,
    Client,
  } = require("discord.js");
  const packageJson = require("../../../package.json");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("info")
      .setDescription("Muestra información.")
      .addSubcommand((s) =>
        s.setName("bot").setDescription("Muestra información sobre el bot.")
      )
      .addSubcommand((s) =>
        s
          .setName("server")
          .setDescription("Muestra información sobre el servidor.")
      )
      .addSubcommand((s) =>
        s
          .setName("user")
          .setDescription("Muestra información sobre un usuario.")
          .addUserOption((o) =>
            o
              .setName("target")
              .setDescription("El usuario que quieras información acerca.")
          )
      )
      .toJSON(),
    userPermissions: [],
    botPermissions: [],
  
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
  
    run: async (client, interaction) => {
      await interaction.deferReply();
  
      const { options, guild } = interaction;
      const subcommand = options.getSubcommand();
  
      const infoEmbed = new EmbedBuilder().setColor("Yellow");
  
      switch (subcommand) {
        case "user":
          const user = options.getUser("target") || interaction.user;
          const member = guild.members.cache.get(user.id);
          const roles = [];
  
        if (member.roles)
          member.roles.cache.forEach((role) => {
            if (role.id !== interaction.guild.roles.everyone.id)
              roles.push(`${role.toString()}`);
          });
  
  
          infoEmbed.setAuthor({
            name: user.tag,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          });
          infoEmbed.addFields(
            { name: "ID", value: user.id, inline: true },
            { name: "Apodo", value: member.nickname || "Ninguno", inline: true },
            { name: "Usuario", value: user.username, inline: true },
            {
              name: "Estado",
              value: getStatusText(member.presence.status),
              inline: true,
            },
            {
              name: "Se unió al servidor hace",
              value: time(member.joinedAt, "R"),
              inline: true,
            },
            {
              name: "Se unió a Discord hace",
              value: time(user.createdAt, "R"),
              inline: true,
            },
            {
              name: "Roles",
              value: `**[${member.roles?.cache?.size - 1}]**: ${roles.join(", ")}`,
              inline: true,
            }
          );
          infoEmbed.setThumbnail(user.displayAvatarURL({ dynamic: true }));
  
          await interaction.editReply({ embeds: [infoEmbed] });
          break;
  
        case "server":
          infoEmbed.setAuthor({
            name: guild.name,
            iconURL: guild.iconURL({ dynamic: true }),
          });
          infoEmbed.addFields(
            { name: "Dueño", value: `<@${guild.ownerId}>`, inline: true },
            { name: "Usuarios", value: `${guild.memberCount}`, inline: true },
            {
              name: "Canales",
              value: `${guild.channels.cache.size}`,
              inline: true,
            },
            { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
            {
              name: "Creado en",
              value: time(guild.createdAt, "R"),
              inline: true,
            },
            {
              name: "Boosts",
              value: `${guild.premiumSubscriptionCount}`,
              inline: true,
            }
          );
          infoEmbed.setThumbnail(guild.iconURL({ dynamic: true }));
  
          await interaction.editReply({ embeds: [infoEmbed] });
          break;
  
        case "bot":
          const uptime = new Date(Date.now() - client.uptime);
  
          infoEmbed.setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          });
          infoEmbed.addFields(
            {
              name: "Ping",
              value: `${Math.round(client.ws.ping)}ms`,
              inline: true,
            },
            { name: "Tiempo en línea", value: time(uptime, "R"), inline: true },
            {
              name: "Uso de memoria",
              value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
                2
              )} MB`,
              inline: true,
            },
            {
              name: "Uso de CPU",
              value: `${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%`,
              inline: true,
            },
            { name: "Versión de Node.js", value: process.version, inline: true },
            {
              name: "Versión de Discord.js",
              value: packageJson.dependencies["discord.js"].substring(1),
              inline: true,
            }
          );
          infoEmbed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
  
          await interaction.editReply({ embeds: [infoEmbed] });
          break;
      }
    },
  };
  
  function getStatusText(status) {
    switch (status) {
      case "online":
        return "`🟢` En línea";
      case "idle":
        return "`🟡` Ausente";
      case "dnd":
        return "`🔴` No disponible";
      case "offline":
        return "`⚫` Desconectado";
      case "invisible":
        return "`⚪` Invisible";
      default:
        return "`❔` Desconocido";
    }
  }