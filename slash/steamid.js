const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("steamid")
    .setDescription("Get a SteamID from a Steam profile URL")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The Steam profile URL")
        .setRequired(true)
    ),

  run: async ({ client, interaction }) => {
    const allowedRoleIds = [
      "1145767690280120403",
      "1201612445790240879",
      "1189575086089449582",
    ];

    const hasPermission = interaction.member.roles.cache.some((role) =>
      allowedRoleIds.includes(role.id)
    );

    if (!hasPermission) {
      return interaction.reply(
        "Você não tem permissão para usar este comando."
      );
    }

    const url = interaction.options.getString("url");

    try {
      const response = await axios.get(url);
      const steamIdMatch = response.data.match(/"steamid":"(\d+)"/);
      const steamId = steamIdMatch
        ? steamIdMatch[1]
        : "SteamID não encontrado.";

      await interaction.reply(`SteamID: ${steamId}`);
    } catch (error) {
      console.error("Erro ao buscar SteamID:", error);
      await interaction.reply("Houve um erro ao buscar o SteamID.");
    }
  },
};
