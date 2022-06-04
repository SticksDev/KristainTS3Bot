const { teamspeak } = require("../services/teamspeak")
const { db } = require("../services/db")
const globals = require("../globals")

module.exports = {
    name: "wladd",
    description: "Add a user to a whitelist",
    usage: "!wladd <wltype (admin, user)> <databaseid> <op (allow, deny)>",
    args: {
        wltype: {
            type: "string",
            name: "wltype",
        },
        databaseid: {
            type: "string",
            name: "databaseid",
        },
        op: {
            type: "string",
            name: "op",
        },
    },
    run: async (event) => {
        if(!event.invoker.servergroups.includes(globals.permLevelIds.serveradmin)) {
            event.invoker.message(globals.messages.missingServerAdminPermission)
            return
        }

        if(!event.args.wltype || !event.args.databaseid || !event.args.op) {
            event.reply("Usage: !wladd <wltype (admin, user)> <databaseid> <op (allow, deny)>")
            return
        }

        if(event.args.wltype !== "admin" && event.args.wltype !== "user") {
            event.reply("Whitlist Type: " + event.args.wltype + " is not a valid type. Valid types are: admin, user")
            return
        }

        if(event.args.op !== "allow" && event.args.op !== "deny") {
            event.reply("Operation: " + event.args.op + " is not a valid operation. Valid operations are: allow, deny")
            return
        }

        const user = await teamspeak.getClientByDbid(event.args.databaseid)

        if(!user) {
            event.reply("User not found")
            return
        }

        db.set(`wl.${event.args.wltype}.${user.databaseId}`, event.args.op)

        event.reply(`${user.nickname} has been ${event.args.op}d to the ${event.args.wltype} whitelist.`)
    }
}