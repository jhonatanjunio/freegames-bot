const { listGiveaways } = require("../../helpers/listGiveaways");
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    ...new SlashCommandBuilder()
        .setName("promocoes")
        .setDescription("Listar todas as promoções ativas!")
        .addStringOption( option =>
            option.setName('plataforma')
                .setDescription('Para qual plataforma quer listar as promoções?')
                .setRequired(false)
                .addChoices(
                    {name: "PC (todas as lojas)", value: "pc"},
                    {name: "Epic Games", value: "epic games store"},
                    {name: "GOG", value: "gog"},
                    {name: "Origin (EA)", value: "origin"},
                    {name: "Steam", value: "steam"},
                )
        ),
        async run(client, interaction, args) {
            return await listGiveaways(client, interaction)
        }

    }
// module.exports = {
//     name: 'promocoes',
//     description: 'Listar todas as promoções ativas!',
//     type: 'CHAT_INPUT',
//     .addStringOption( option =>
//         option.setName('plataforma')
//             .setDescription('Para qual plataforma quer listar as promoções?')
//             .setRequired(false)
//             .addChoices(
//                 { name: "PC (todas as lojas)", value: "pc" },
//                 { name: "Epic Games", value: "epic-games-store" },
//                 { name: "GOG", value: "gog" },
//                 { name: "Origin (EA)", value: "origin" },
//                 { name: "Steam", value: "steam" },
//             )
//     )
//
//     run: async (client, interaction) => {
//         return await listGiveaways(client, interaction)
//     }
// }