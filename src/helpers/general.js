const file_get_contents = require("./file_get_contents");
const {promises: fs} = require("fs");
const path = require('path').resolve(__dirname, '..')
const arrayShuffle = require('array-shuffle')
function resolveFilePath(file){
    return path + `/${file}`;
}
async function getGiveaways(platform, type){
    platform = platform ? platform.toLowerCase() : "pc";
    type = type ? type.toLowerCase() : "game";
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

async function filterGiveaways(platform){
    let giveaways = fs.readFile(resolveFilePath("extras/giveaways/db/giveaways.json"), 'utf8');
    giveaways = arrayShuffle(await JSON.parse(await giveaways));
    let filtered;
    if(platform){
        filtered = giveaways.filter(g => {
            const explodePlatforms = g.platform.split(",").map(p => p.toLowerCase().trim());
            return g.platform === platform || explodePlatforms.includes(platform);
        });
    } else {
        filtered = giveaways
    }

    return filtered
}

module.exports = { getGiveaways, checkGiveawayAvailability, removeGiveawayFromDb, filterGiveaways }