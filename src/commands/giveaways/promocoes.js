const discord = require('discord.js');
const {promises: fs} = require("fs");
const moment = require("moment-timezone");

module.exports = {
    name: 'promocoes',
    description: 'Listar todas as promoções ativas!',
    type: 'CHAT_INPUT',
    run: async (client, interaction) => {
        const base_path = __basedir;

        try {
            let stored_giveaways = fs.readFile(`${base_path}/extras/giveaways/db/giveaways.json`, 'utf8');
            stored_giveaways = JSON.parse(await stored_giveaways);
            if (!stored_giveaways.length) return interaction.reply({ content: ' Não há promoções registradas na database.' });

            let pageNumber = 1;
            let giveaway = stored_giveaways[pageNumber - 1];
            const embed = new discord.MessageEmbed()
                .setColor('AQUA')
                .setTitle(`:free: Listagem de promoções ativas! :free:`)
                .addFields(
                    { name: 'Plataforma', value: giveaway.platform ? giveaway.platform : "Nenhum tipo de plataforma definido", inline: true },
                    { name: 'Tipo', value: giveaway.type ? giveaway.type : "Nenhum tipo de promoção definido", inline: true },
                    { name: 'Link', value: giveaway.link ? giveaway.link : "Nenhum link definido", inline: false },
                    { name: 'Data de publicação', value: giveaway.published_date ? moment(giveaway.published_date).format('DD/MM/YYYY HH:mm:ss') : "Nenhum data de publicação definida", inline: true },
                )
                .setThumbnail(giveaway.thumbnail)
                .setImage(giveaway.image)
                .setDescription(`${giveaway.title} ${giveaway.link ? " - " + giveaway.link : ""}`)
                .setFooter({ text: `Página ${pageNumber}/${stored_giveaways.length}` })

            const getButtons = (pageNumber) => {
                return new discord.MessageActionRow().addComponents(
                    new discord.MessageButton()
                        .setLabel('Voltar')
                        .setCustomId('prev')
                        .setStyle('SUCCESS')
                        .setDisabled(pageNumber <= 1),
                    new discord.MessageButton()
                        .setLabel('Avançar')
                        .setCustomId('next')
                        .setStyle('SUCCESS')
                        .setDisabled(!(pageNumber < stored_giveaways.length)),
                );
            }

            const interactionMsg = await interaction.reply({ embeds: [embed], components: [getButtons(pageNumber)], fetchReply: true, ephemeral: true });
            const collector = interactionMsg.createMessageComponentCollector({ time: 600000, componentType: 'BUTTON' });

            collector.on('collect', async (i) => {
                if (i.customId === 'next') {
                    pageNumber++;
                } else if (i.customId === 'prev') {
                    pageNumber--;
                }

                let giveaway = stored_giveaways[pageNumber - 1];
                embed.fields = [];
                embed.setTitle(`:free: Listagem de promoções ativas! :free:`)
                    .addFields(
                        { name: 'Plataforma', value: giveaway.platform ? giveaway.platform : "Nenhum tipo de plataforma definido", inline: true },
                        { name: 'Tipo', value: giveaway.type ? giveaway.type : "Nenhum tipo de promoção definido", inline: true },
                        { name: 'Link', value: giveaway.link ? giveaway.link : "Nenhum link definido", inline: false },
                        { name: 'Data de publicação', value: giveaway.published_date ? moment(giveaway.published_date).format('DD/MM/YYYY HH:mm:ss') : "Nenhum data de publicação definida", inline: true },
                    )
                    .setThumbnail(giveaway.thumbnail)
                    .setImage(giveaway.image)
                    .setDescription(`${giveaway.title} ${giveaway.link ? " - " + giveaway.link : ""}`)
                    .setFooter({ text: `Página ${pageNumber}/${stored_giveaways.length}` });

                await i.update({ embeds: [embed], components: [getButtons(pageNumber)], fetchReply: true, ephemeral: true });
            });

        } catch (err) {
            console.error(err);
        }
    }
}