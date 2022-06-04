const { teamspeak } = require("../services/teamspeak")
const { db } = require("../services/db")
const globals = require("../globals")

module.exports = {
    name: "wlenable",
    description: "Enables/Disables a user in the whitelist",
    usage: "!wlenable <wltype (admin, user)>",
    run: async (event) => {
        if(!event.invoker.servergroups.includes(globals.permLevelIds.serveradmin)) {
            event.invoker.message(globals.messages.missingServerAdminPermission)
            return
        }

        if(!event.args.wltype) {
            event.reply("Usage: !wlenable <wltype (admin, user)>")
            return
        }

        if(event.args.wltype !== "admin" && event.args.wltype !== "user") {
            event.reply("Whitelist Type: " + event.args.wltype + " is not a valid type. Valid types are: admin, user")
            return
        }

        
        // Check if whitelist is enabled
        const enabled = await db.get(`wl.${event.args.wltype}.enabled`)

        if(enabled) {
            // Set whitelist to disabled
            await db.set(`wl.${event.args.wltype}.enabled`, false)
            event.reply(`${event.args.wltype} whitelist is now disabled.`)
            return;
        }

        // Set whitelist to enabled
        await db.set(`wl.${event.args.wltype}.enabled`, true)
        event.reply(`${event.args.wltype} whitelist is now enabled.`)
    }
}