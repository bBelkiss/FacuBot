const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
  } = require("discord.js");
  const fs = require("fs");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("help")
      .setDescription("Muestra la lista de comandos."),
  
    run: async (client, interaction) => {
      const user = interaction.user;
      const commandFolders = fs
        .readdirSync("./src/commands")
        .filter((folder) => !folder.startsWith("."));
      const commandbyCategory = {};
  
      for (const folder of commandFolders) {
        const commandFiles = fs
          .readdirSync(`./src/commands/${folder}`)
          .filter((file) => file.endsWith(".js"));
        const commands = [];
  
        for (const file of commandFiles) {
          const { default: command } = await import(`./../${folder}/${file}`);
          commands.push(`\`${command.data.name}\``);
        }
  
        commandbyCategory[folder] = commands;
      }
  
      const dropdownOptions = Object.keys(commandbyCategory).map((folder) => ({
        label: folder,
        value: folder,
      }));
  
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("category_select")
        .setPlaceholder("Selecciona una categoria")
        .addOptions(
          ...dropdownOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))
        );
  
      const embed = new EmbedBuilder()
        .setTitle("`💡` Menú de Comandos")
        .setDescription(
          "Selecciona una categoría en el menú de abajo para ver la lista de comandos."
        )
        .setColor("Yellow")
        .setTimestamp()
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setAuthor({
          name: user.tag,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        });
  
      const row = new ActionRowBuilder().addComponents(selectMenu);
      await interaction.reply({ embeds: [embed], components: [row] });
  
      const filter = (i) =>
        i.isStringSelectMenu() && i.customId === "category_select";
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
      });
      collector.on("collect", async (i) => {
        const selectedCategory = i.values[0];
        const categoryCommands = commandbyCategory[selectedCategory];
  
        const categoryEmbed = new EmbedBuilder()
          .setTitle(`${selectedCategory}`)
          .setDescription(
            "`💡` Para ayuda sobre algún comando en específico, etiqueta a @belap."
          )
          .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
          .addFields({
            name: "`📖` Comandos",
            value: categoryCommands.join(", "),
          })
          .setColor("Yellow")
          .setTimestamp()
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setAuthor({
            name: user.tag,
            iconURL: user.displayAvatarURL({ dynamic: true }),
          });
        await i.update({ embeds: [categoryEmbed] });
      });
    },
  };