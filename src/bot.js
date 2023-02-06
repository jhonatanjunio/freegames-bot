require("dotenv").config();
const { Client, Intents, Collection } = require('discord.js');
const giveaways = require("./extras/giveaways/giveaways");

async function main() {

    global.__basedir = __dirname;

    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.MESSAGE_CONTENT
        ],
        partials: [
            'MESSAGE',
            'GUILD_MEMBER',
            'USER',
            'CHANNEL',
            'REACTION'
        ],
    });
    
    ['commands', 'aliases'].forEach(f => client[f] = new Collection());
    ['commands', 'events'].forEach(f => require(`./handlers/${f}`)(client));

    client.login(process.env.DISCORD_TOKEN)

    client.on("ready", () => {
        giveaways.fetchGiveaways(client, __dirname);
        client.user.setActivity(`:mag_right: :free: /promocoes...`, {type: 'PLAYING'});
    });
}

main().catch((error) => {
    console.log(error);
});