const { teamspeak } = require("../services/teamspeak")
const { db } = require("../services/db")
const globals = require("../globals")

module.exports = {
    name: "wlremoveall",
    description: "Remove said user from all whitelists",
    usage: "!wlremoveall <databaseid>",
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
            event.reply("Usage: !wlremoveall <dbid>")
            return
        }

        const user = await teamspeak.getClientByDbid(event.args.dbid)

        if(!user) {
            event.reply("User not found")
            return
        }

        db.delete(`wl.admin.${user.databaseId}`)
        db.delete(`wl.user.${user.databaseId}`)

        event.reply(`${user.nickname} has been removed from the whitelists.`)
    }
}