const { teamspeak } = require("../services/teamspeak")
const { db } = require("../services/db")
const globals = require("../globals")

module.exports = {
    name: "wlremove",
    description: "Remove a user from a whitelist",
    usage: "!wlremove <wltype (admin, user)> <databaseid>",
    args: {
        wltype: {
            type: "string",
            name: "wltype",
        },
        databaseid: {
            type: "string",
            name: "databaseid",
        },
    },
    run: async (event) => {
        if(!event.invoker.servergroups.includes(globals.permLevelIds.serveradmin)) {
            event.invoker.message(globals.messages.missingServerAdminPermission)
            return
        }

        if(!event.args.wltype || !event.args.databaseid) {
            event.reply("Usage: !wlremove <wltype (admin, user)> <databaseid>")
            return
        }

        if(event.args.wltype !== "admin" && event.args.wltype !== "user") {
            event.reply("Whitlist Type: " + event.args.wltype + " is not a valid type. Valid types are: admin, user")
            return
        }

        const user = await teamspeak.getClientByDbid(event.args.databaseid)

        if(!user) {
            event.reply("User not found")
            return
        }

        db.delete(`wl.${event.args.wltype}.${user.databaseId}`)

        event.reply(`${user.nickname} has been removed from the ${event.args.wltype} whitelist.`)
    }
}
