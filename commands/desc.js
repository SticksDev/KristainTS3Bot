const { teamspeak } = require("../services/teamspeak")
const globals = require("../globals")

module.exports = {
    name: "desc",
    description: "Change a user's description",
    usage: "!desc <user> <newdesc>",
    args: {
        user: {
            type: "string",
            name: "user"
        },
        newdesc: {
            type: "string",
            name: "newdesc"
        },
    },
    run: async (event) => {
        if(!event.invoker.servergroups.includes(globals.permLevelIds.serveradmin)) {
            event.invoker.message(globals.messages.missingServerAdminPermission)
            return
        }
        
        if(!event.args || !event.args.user || !event.args.newdesc) {
            event.reply("Usage: !desc <user> <newdesc>")
            return
        }
        
        const user = await teamspeak.getClientByName(event.args.user.split("-").join(" "))
        const nickname = event.args.newdesc.split("-").join(" ")

        if(!user) return event.reply("ERROR: User not found")
        if(!event.args.newdesc || !nickname) return event.reply("Description must be provided.")
        
        // Change clientDescription
        teamspeak.clientEdit(user, {
            "clientDescription": nickname
        })

        teamspeak.sendTextMessage(user, TextMessageTargetMode.CLIENT, `Your Description was changed to ${nickname}`)
        event.reply(`Description changed to ${nickname}`)
    }
}