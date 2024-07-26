const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask-ai")
    .setDescription("Preguntale algo a una IA")
    .addStringOption((o) =>
      o
        .setName("prompt")
        .setDescription("La pregunta a hacer")
        .setRequired(true)
    )
    .toJSON(),
  deleted: false,

  run: async (client, interaction) => {
    await interaction.deferReply();
    const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

    async function run() {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-pro-latest",
        });
        const prompt = interaction.options.getString("prompt");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        if (text.length > 2000) {
          const chunks = text.match(/[\s\S]{1,2000}/g);
          for (const chunk of chunks) {
            const embed = new EmbedBuilder()
              .setDescription(chunk)
              .setColor("Yellow")
              .setTimestamp();
            await interaction.followUp({ embeds: [embed] });
          }
        } else {
          const embed2 = new EmbedBuilder()
            .setDescription(text)
            .setColor("Yellow")
            .setTimestamp();
          await interaction.editReply({ embeds: [embed2] });
        }
      } catch (error) {
        console.log(`An error occured in the askAI command:\n\n${error}`);
        await interaction.editReply({
          content: "An error occurred while processing your request.",
        });
      }
    }

    run();
  },
};