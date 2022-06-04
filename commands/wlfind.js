const { teamspeak } = require("../services/teamspeak")
const { db } = require("../services/db")
const globals = require("../globals")

module.exports = {
    name: "wlfind",
    description: "Find a user in a whitelist",
    usage: "!wlfind <databaseid>",
    args: {
        dbid: {
            type: "string",
            name: "dbid",
        },
    },
    run: async (event) => {
        if(!event.invoker.servergroups.includes(globals.permLevelIds.serveradmin)) {
            event.invoker.message(globals.messages.missingServerAdminPermission)
            return
        }

        if(!event.args.dbid) {
            event.reply("Usage: !wlfind <dbid>")
            return
        }

        const user = await teamspeak.getClientByDbid(event.args.dbid)

        if(!user) {
            event.reply("User not found")
            return
        }

        const admin = await db.get(`wl.admin.${user.databaseId}`)
        const userdb = await db.get(`wl.user.${user.databaseId}`)

        event.reply(`\n${user.nickname} is ${admin ? "on the admin whitelist" : "not on the admin whitelist"}\n${user.nickname} is ${userdb ? "on the user whitelist" : "not on the user whitelist"}`)
    }
}