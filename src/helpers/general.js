const file_get_contents = require("./file_get_contents");
const {promises: fs} = require("fs");
const path = require('path').resolve(__dirname, '..')

function resolveFilePath(file){
    return path + `/${file}`;
}
async function getGiveaways(platform, type){
    platform = platform ? platform.toLowerCase() : "pc";
    type = type ? type.toLowerCase() : "game.loot";
    const file = await file_get_contents(`https://www.gamerpower.com/api/giveaways?platform=${platform}&type=${type}&sort-by=popularity`);
    return JSON.parse(file);
}

async function checkGiveawayAvailability(id){
    let getGiveaway = await file_get_contents(`https://www.gamerpower.com/api/giveaway?id=${id}`);
    getGiveaway = JSON.parse(getGiveaway)
    return getGiveaway.status === "Active";
}

async function removeGiveawayFromDb(id){

    let giveaways = fs.readFile(resolveFilePath("extras/giveaways/db/giveaways.json"), 'utf8');
    giveaways = JSON.parse(await giveaways);
    giveaways = giveaways.filter(g => g.id !== id);

    await fs.writeFile(resolveFilePath("extras/giveaways/db/giveaways.json"), JSON.stringify(giveaways));
}

module.exports = { getGiveaways, checkGiveawayAvailability, removeGiveawayFromDb }