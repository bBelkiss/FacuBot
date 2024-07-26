const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    MessageContextMenuCommandInteraction,
    Client,
  } = require("discord.js");
  const stringifyLanguage = require("../../utils/stringifyLanguage");
  const translate = require("@iamtraction/google-translate");
  
  module.exports = {
    data: new ContextMenuCommandBuilder()
      .setName("Translate")
      .setType(ApplicationCommandType.Message),
    userPermissions: [],
    botPermissions: [],
  
    /**
     *
     * @param {Client} client
     * @param {MessageContextMenuCommandInteraction} interaction
     */
  
    run: async (client, interaction) => {
      await interaction.deferReply({ ephemeral: true });
  
      const rEmbed = new EmbedBuilder().setColor("Yellow").setFooter({
        text: `${client.user.username}`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });
  
      const { targetMessage } = interaction;
  
      const message = targetMessage.content;
      if (!message) {
        return interaction.editReply({
          embeds: [
            rEmbed.setDescription("Necesitas seleccionar un mensaje válido.").setColor("Red"),
          ],
        });
      }
  
      const language = "en";
      const languageName = stringifyLanguage(language);
  
      translate(message, { to: language }).then((res) => {
        originalLanguage = stringifyLanguage(res.from.language.iso);
        translatedLanguage = languageName;
  
        rEmbed
          .addFields(
            { name: `Mensaje original`, value: `${message}`, inline: true },
            { name: `Mensaje traducido`, value: `${res.text}`, inline: true },
            { name: `Idioma original`, value: `${originalLanguage}`, inline: true },
            { name: `Idioma traducido`, value: `${translatedLanguage}`, inline: true }
          )
          .setTimestamp()
          .setThumbnail(
            `https://flagcdn.com/h240/${language}.png`
              .replace("en", "gb")
              .replace("zh", "cn")
              .replace("ko", "kr")
          );
  
        interaction.editReply({ embeds: [rEmbed] });
      });
    },
  };