const moment = require('moment-timezone');
const fs = require('fs').promises;
const cron = require('node-cron');
const { getGiveaways, checkGiveawayAvailability, removeGiveawayFromDb} = require('../../helpers/general');
const discord = require('discord.js');

require("dotenv").config();

async function fetchGiveaways(client, dirName) {
    const base_path = dirName
    console.log("🔎 Iniciando a busca de novas promoções");



    cron.schedule("*/10 * * * *", async () => {

        let stored_giveaways = fs.readFile(`${base_path}/extras/giveaways/db/giveaways.json`, 'utf8');
        stored_giveaways = JSON.parse(await stored_giveaways);

        getGiveaways().then(async giveaways => {

            for (let i = 0; i < giveaways.length; i++) {
                const giveaway = giveaways[i];

                let getRepeatedGiveaway = stored_giveaways.filter((storedgiveaway) => storedgiveaway.id === giveaway.id);
                if (getRepeatedGiveaway.length > 0) {
                    if (giveaway.status !== "Active") {
                        stored_giveaways.splice(stored_giveaways.indexOf(getRepeatedGiveaway[0]), 1);
                        console.log(`${giveaway.id} não é mais válido! Removido da base de dados.`);
                    }
                    continue;
                }

                if (giveaway.status !== "Active") continue;

                let newGiveaway = {
                    "id": giveaway.id,
                    "published_date": giveaway.published_date,
                    "title": giveaway.title,
                    "thumbnail": giveaway.thumbnail,
                    "image": giveaway.image,
                    "type": giveaway.type,
                    "platform": giveaway.platforms,
                    "link": `**${giveaway.open_giveaway ? giveaway.open_giveaway : giveaway.gamerpower_url}**`

                }
                stored_giveaways.push(newGiveaway);
                await fs.writeFile(`${base_path}/extras/giveaways/db/giveaways.json`, JSON.stringify(stored_giveaways));

                let txtChannel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

                const embed = new discord.MessageEmbed()
                    .setTitle(`:rotating_light: Alerta de nova promoção disponível! :rotating_light:`)
                    .addFields(
                        { name: 'Plataforma', value: newGiveaway.platform ? newGiveaway.platform : "Nenhum tipo de plataforma definido", inline: true },
                        { name: 'Tipo', value: newGiveaway.type ? newGiveaway.type : "Nenhum tipo de promoção definido", inline: true },
                        { name: 'Link', value: newGiveaway.link ? newGiveaway.link : "Nenhum link definido", inline: false }
                    )
                    .setThumbnail(giveaway.thumbnail)
                    .setImage(giveaway.image)
                    .setDescription(`${giveaway.title} ${giveaway.link ? " - " + giveaway.link : ""}`)
                    .setFooter({ text: `Data de publicação: ${moment(newGiveaway.published_date).format('DD/MM/YYYY HH:mm:ss')}`, iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 })})

                await txtChannel.send({ embeds: [embed] });

            }

        });

        stored_giveaways.forEach((storedGiveaway) => {

            checkGiveawayAvailability(storedGiveaway.id).then(async isAvailable => {
                if (!isAvailable) {
                    let giveaway = storedGiveaway;
                    let txtChannel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
                    let embed = new discord.MessageEmbed()
                        .setTitle(`:tired_face: Alerta de promoção encerrada! :tired_face:`)
                        .addFields(
                            {
                                name: 'Plataforma',
                                value: giveaway.platform ? giveaway.platform : "Nenhum tipo de plataforma definido",
                                inline: true
                            },
                            {
                                name: 'Tipo',
                                value: giveaway.type ? giveaway.type : "Nenhum tipo de promoção definido",
                                inline: true
                            }
                        )
                        .setThumbnail(giveaway.thumbnail)
                        .setImage(giveaway.image)
                        .setDescription(`Promoção encerrada: ${giveaway.title}`)

                    await txtChannel.send({ embeds: [embed] });
                    await removeGiveawayFromDb(giveaway.id);
                }
            });
            
        })

    }, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });

}

module.exports = { fetchGiveaways }