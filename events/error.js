const logger = require("@jakeyprime/logger");
module.exports = {
    name: "error",
    description: "error Event For TeamSpeak",
    once: false,
    run: async (err) => {
        logger.error(`A client error has occurred: ${err}`);
    }
}