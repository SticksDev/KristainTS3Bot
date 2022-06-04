const { teamspeak } = require("../services/teamspeak")
module.exports = {
    name: "aboutuser",
    description: "Get information about a user",
    usage: "!aboutuser",
    run: async (event) => {
        const user = await teamspeak.getClientByName(event.invoker.nickname)

        event.invoker.message(`[color=red] Do not share this information with anyone unless they are an admin. Look at the roles on teamspeak![/color]`)
        event.invoker.message(`ID: ${user.clid}\nDBID: ${user.databaseId}\nUniqueIdentifier: ${user.uniqueIdentifier}`)
    }
}