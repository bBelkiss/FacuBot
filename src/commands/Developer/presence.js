const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActivityType,
    EmbedBuilder,
  } = require("discord.js");
  const botSchema = require("../../schemas/botPresence");
  
  module.exports = {
          data: new SlashCommandBuilder()
            .setName("presence")
            .setDescription("Define el estado y la presencia del bot")
            .addSubcommand((sub) =>
              sub
                .setName("add")
                .setDescription("Agrega una nueva presencia.")
                .addStringOption((opt) =>
                  opt
                    .setName("name")
                    .setDescription("El nombre de la presencia.")
                    .setRequired(true)
                )
                .addStringOption((opt) =>
                  opt
                    .setName("type")
                    .setDescription("El tipo de la presencia.")
                    .addChoices(
                      { name: "Competing", value: `${ActivityType.Competing}` },
                      { name: "Custom", value: `${ActivityType.Custom}` },
                      { name: "Listening", value: `${ActivityType.Listening}` },
                      { name: "Playing", value: `${ActivityType.Playing}` },
                      { name: "Streaming", value: `${ActivityType.Streaming}` },
                      { name: "Watching", value: `${ActivityType.Watching}` }
                    )
                    .setRequired(true)
                )
                .addStringOption((opt) =>
                  opt
                    .setName("status")
                    .setDescription("El estado de la presencia.")
                    .addChoices(
                      { name: "Online", value: "online" },
                      { name: "Idle", value: "idle" },
                      { name: "Dnd", value: "dnd" },
                      { name: "Invisible", value: "invisible" }
                    )
                    .setRequired(true)
                )
            )
            .addSubcommand((sub) =>
              sub
                .setName("remove")
                .setDescription("Elimina la ultima actividad agregada.")
            )
            .addSubcommand((sub) =>
              sub.setName("list").setDescription("Mira la lista de presencias.")
            )
            .toJSON(),
    testMode: false,
    devOnly: true,
    deleted: false,
    userPermissions: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    /**
     *
     * @param {Client} client
     * @param {ChatInpuCommandInteraction} interaction
     */
    run: async (client, interaction) => {
      const subs = interaction.options.getSubcommand();
      const data = await botSchema.findOne({ ClientID: client.user.id });
  
      switch (subs) {
        case "add":
          const name = interaction.options.getString("name");
          const type = interaction.options.getString("type");
          const status = interaction.options.getString("status");
  
          if (!data) {
            await botSchema.create({
              ClientID: client.user.id,
              Presences: [
                {
                  Activity: [
                    {
                      Name: name,
                      Type: parseInt(type),
                    },
                  ],
                  Status: status,
                },
              ],
            });
          } else {
            await botSchema.findOneAndUpdate(
              { ClientID: client.user.id },
              {
                $push: {
                  Presences: {
                    Activity: [{ Name: name, Type: parseInt(type) }],
                    Status: status,
                  },
                },
              }
            );
          }
          return interaction.reply({
            content: `\`✅\` Actividad \`${name}\` agregada exitosamente.`,
            ephemeral: true,
          });
  
        case "remove":
          if (!data) {
            return interaction.reply({
              content: `\`❌\` No se agregó ninguna presencia.`,
              ephemeral: true,
            });
          } else {
            await botSchema.findOneAndUpdate(
              { ClientID: client.user.id },
              {
                $pop: {
                  Presences: 1,
                },
              }
            );
          }
          return interaction.reply({
            content: `\`✅\` Actividad eliminada exitosamente.`,
            ephemeral: true,
          });
  
        case "list":
          if (!data) {
            return interaction.reply({
              content: "No se han agregado presencias.",
              ephemeral: true,
            });
          }
  
          const presences = data.Presences;
  
          const rEmbed = new EmbedBuilder()
            .setTitle(`\`⭐\` Actividades del bot`)
            .setColor("Yellow")
            .setFooter({
              text: `${client.user.username} - Lista de actividades`,
              iconURL: `${client.user.displayAvatarURL({ dynamic: true })}`,
            });
  
          const activityType = [
            "Playing",
            "Streaming",
            "Listening",
            "Watching",
            "Custom",
            "Competing",
          ];
          const activityStatus = {
            online: "Online",
            idle: "Idle",
            dnd: "Dnd",
            invisible: "Invisible",
          };
  
          presences.forEach((presence, index) => {
            return rEmbed.addFields({
              name: `\`${index + 1}\` - \`${presence.Activity[0].Name}\``,
              value: `**Tipo:** ${
                activityType[presence.Activity[0].Type]
              }\n**Estado:** ${activityStatus[presence.Status]}`,
            });
          });
  
          return interaction.reply({
            embeds: [rEmbed],
            ephemeral: false,
          });
      }
    },
  };