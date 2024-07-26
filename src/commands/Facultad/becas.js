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
      .setName("becas")
      .setDescription("Obtén información sobre las becas disponibles."),
  
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
        .setCustomId('selectBeca')
        .setPlaceholder('Selecciona el tipo de beca')
        .addOptions([
          {
            label: 'Albergue',
            value: 'beca_albergue',
          },
          {
            label: 'Comedor Universitario',
            value: 'beca_comedor',
          },
          {
            label: 'Beca de Salud',
            value: 'beca_salud',
          },
          {
            label: 'Becas Extras',
            value: 'becas_extras',
          }
          // Agregar más opciones según sea necesario
        ]);
  
      const row = new ActionRowBuilder().addComponents(selectMenu);
  
      const initialEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription("Selecciona el tipo de beca para obtener más información:");
  
      await interaction.editReply({
        embeds: [initialEmbed],
        components: [row],
      });
  
      const filter = (i) => i.customId === 'selectBeca' && i.user.id === user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
  
      collector.on('collect', async (i) => {
        if (i.isStringSelectMenu()) {
          let embed;
  
          if (i.values[0] === 'beca_albergue') {
            embed = new EmbedBuilder()
              .setColor("Yellow")
              .setDescription("Beca de Albergue Universitario")
              .addFields(
                { name: "Información", value: "Se brinda alojamiento en el cual también acceden a diversos beneficios: las cuatro comidas diarias, salas de computación, wi-fi en todo el predio, entre otras comodidades.", inline: false },
                { name: "Links importantes", value: "https://unlp.edu.ar/gestion/bienestar_universitario/estudiantes/albergue-universitario-tu-lugar-en-la-unlp-7892-12892/", inline: false }
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
          } else if (i.values[0] === 'beca_comedor') {
            embed = new EmbedBuilder()
              .setColor("Green")
              .setDescription("Comedor Universitario")
              .addFields(
                { name: "Información", value: "Este beneficio permite a quienes sean estudiantes y atraviesen una situación de vulnerabilidad económica, poder acceder al Comedor de manera gratuita tanto en el turno del mediodía, como por la noche, durante los días hábiles de la semana.", inline: false },
                { name: "Links importantes", value: "https://unlp.edu.ar/gestion/bienestar_universitario/estudiantes/comedor_universitario-3923-8923/", inline: false }
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
          } else if (i.values[0] === 'beca_salud') {
            embed = new EmbedBuilder()
              .setColor("Red")
              .setDescription("Cobertura de Salud")
              .addFields(
                { name: "Información", value: "Quienes sean estudiantes o ingresantes y requieran atención médica domiciliaria que no sea de urgencia, podrán comunicarse las 24hs, durante todo el Ciclo Lectivo, al servicio de Emergencias Médicas", inline: false },
                { name: "Links importantes", value: "https://unlp.edu.ar/gestion/bienestar_universitario/estudiantes/amplia-cobertura-de-salud-7893-12893/", inline: false }
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
          } else if (i.values[0] === 'becas_extras') {
            embed = new EmbedBuilder()
             .setColor("Purple")
             .setDescription("Becas Extras")
             .addFields(
                { name: "Información", value: "Becas extras.", inline: false },
                { name: "Links importantes", value: "https://unlp.edu.ar/becas/", inline: false }
              )
             .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
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
  