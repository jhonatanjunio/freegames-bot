const { listGiveaways } = require("../../helpers/listGiveaways");
module.exports = {
    name: 'promocoes',
    description: 'Listar todas as promoções ativas!',
    type: 'CHAT_INPUT',
    run: async (client, interaction) => {
        return await listGiveaways(client, interaction)
    }
}