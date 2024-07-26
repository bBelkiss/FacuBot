const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dice-roll")
    .setDescription("Tira un dado (1~6)"),

  run: async (client, interaction) => {
    const choices = ["1 ", "2", "3", "4", "5", "6"];
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];

    const embed = new EmbedBuilder();

    try {
      switch (randomChoice) {
        case "1":
          embed
            .setTitle("🎲 | Tiraste el dado...")
            .setColor("Yellow")
            .setDescription("Tu número es **1**!");
          return interaction.reply({ embeds: [embed] });
        case "2":
          embed
            .setTitle("🎲 | Tiraste el dado...")
            .setColor("Yellow")
            .setDescription("Tu número es **2**!");
          return interaction.reply({ embeds: [embed] });
        case "3":
          embed
            .setTitle("🎲 | Tiraste el dado...")
            .setColor("Yellow")
            .setDescription("Tu número es **3**!");
          return interaction.reply({ embeds: [embed] });
        case "4":
          embed
            .setTitle("🎲 | Tiraste el dado...")
            .setColor("Yellow")
            .setDescription("Tu número es **4**!");
          return interaction.reply({ embeds: [embed] });
        case "5":
          embed
            .setTitle("🎲 | Tiraste el dado...")
            .setColor("Yellow")
            .setDescription("Tu número es **5**!");
          return interaction.reply({ embeds: [embed] });
        case "6":
          embed
            .setTitle("🎲 | Tiraste el dado...")
            .setColor("Yellow")
            .setDescription("Tu número es **6**!");
          return interaction.reply({ embeds: [embed] });
      }
    } catch (err) {
      console.log(err);

      embed.setColor("Red").setDescription("⛔ Algo salió mal...");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};