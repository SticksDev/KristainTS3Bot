module.exports = {
    name: "ping",
    description: "Pong?",
    usage: "!ping",
    run: async (event) => {
        event.reply("Pong!")
    }
}