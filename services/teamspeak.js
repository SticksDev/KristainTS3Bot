const { TeamSpeak } = require("ts3-nodejs-library")

const teamspeak = new TeamSpeak({
    host: "208.87.128.54",
    queryport: 10011,
    serverport: 9987,
    username: process.env.TS_USER,
    password: process.env.TS_PASS,
    nickname: "KrystianBot",
    keepAlive: true
})

module.exports.teamspeak = teamspeak;