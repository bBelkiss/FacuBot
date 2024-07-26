const {
    SlashCommandBuilder,
    EmbedBuilder,
    Client,
    ChatInputCommandInteraction,
  } = require("discord.js");
  const stringifyLanguage = require("../../utils/stringifyLanguage");
  const translate = require("@iamtraction/google-translate");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("translate")
      .setDescription("Traduce lo que desees a otro idioma.")
      .addStringOption((o) =>
        o
          .setName("message-id")
          .setDescription("La ID del mensaje que quieras traducir")
      )
      .addStringOption((o) =>
        o.setName("message").setDescription("El mensaje que quieras traducir")
      )
      .addStringOption((o) =>
        o
          .setName("language")
          .setDescription("El idioma que al cual quieres traducir el texto")
          .addChoices(
            { name: "English", value: "en" },
            { name: "German", value: "de" },
            { name: "French", value: "fr" },
            { name: "Spanish", value: "es" },
            { name: "Italian", value: "it" },
            { name: "Japanese", value: "ja" },
            { name: "Korean", value: "ko" },
            { name: "Portuguese", value: "pt" },
            { name: "Russian", value: "ru" },
            { name: "Chinese", value: "zh" },
            { name: "Arabic", value: "ar" },
            { name: "Bengali", value: "bn" },
            { name: "Dutch", value: "nl" },
            { name: "Finnish", value: "fi" },
            { name: "Greek", value: "el" },
            { name: "Hindi", value: "hi" },
            { name: "Indonesian", value: "id" },
            { name: "Malay", value: "ms" },
            { name: "Norwegian", value: "no" },
            { name: "Polish", value: "pl" },
            { name: "Swedish", value: "sv" },
            { name: "Thai", value: "th" },
            { name: "Turkish", value: "tr" },
            { name: "Vietnamese", value: "vi" },
            { name: "Welsh", value: "cy" }
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
      let message = "";
      await interaction.deferReply({ ephemeral: true });
  
      const rEmbed = new EmbedBuilder().setColor("Yellow").setFooter({
        text: `${client.user.username}`,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });
  
      const { options } = interaction;
      const messageID = options.getString("message-id");
      if (messageID) {
        message = await interaction.channel.messages.fetch(messageID);
      } else if (!messageID) {
        message = options.getString("message");
      }
  
      if (!message || message === "") {
        return interaction.editReply({
          embeds: [rEmbed.setDescription("Necesitas enviar un mensaje válido.")],
        });
      }
      const language = options.getString("language") || "en";
      const languageName = stringifyLanguage(language);
  
      translate(message, { to: language }).then((res) => {
        originalLanguage = stringifyLanguage(res.from.language.iso);
        translatedLanguage = languageName;
  
        rEmbed
          .addFields(
            { name: `Mensaje original`, 
              value: `${message}`, 
              inline: true },
            { name: `Mensaje traducido`, 
              value: `${res.text}`, 
              inline: true },
            {
              name: `Idioma original`,
              value: `${originalLanguage}`,
              inline: true,
            },
            {
              name: `Idioma traducido`,
              value: `${translatedLanguage}`,
              inline: true,
            }
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