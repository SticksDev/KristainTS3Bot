require('dotenv').config();
const { Commander } = require('teamspeak-commander');
const { db } = require('./services/db');
const { teamspeak } = require('./services/teamspeak');
const fs = require('fs');
const logger = require('@jakeyprime/logger');
let commander = new Commander({ prefix: '!' });
const globals = require('./globals');

function initbot() {
    // Load files from the commands folder, and add them to the commander
    fs.readdirSync('./commands').forEach((file) => {
        const command = require(`./commands/${file}`);
        logger.info(`[CommandLoader]: Loading command: ${command.name}`);

        const commanderCommand = commander.createCommand(command.name);

        // Check if the command has args
        if (command.args) {
            logger.info(
                `[CommandLoader]: ${command.name} has args - adding them`,
            );
            // Loop through the args
            for (const arg in command.args) {
                // Create the ars

                let argName = command.args[arg].name;
                let argType = command.args[arg].type;

                // Switch for types
                switch (command.args[arg].type) {
                    case 'string':
                        commanderCommand.addArgument((arg) =>
                            arg.string.name(argName),
                        );
                        break;
                    case 'number':
                        commanderCommand.addArgument((arg) =>
                            arg.number.name(argName),
                        );
                        break;
                    default:
                        logger.error(`[ArgLoader]: Unknown type: ${argType}`);
                        break;
                }
            }
        }

        if (!command.run) {
            logger.error(
                `[CommandLoader]: ${command.name} has no run function. Please fix this and restart the bot.`,
            );
            process.exit(1);
        }

        commanderCommand.run(command.run);
    });

    // Load all events from the events folder
    fs.readdirSync('./events').forEach((file) => {
        const event = require(`./events/${file}`);
        logger.info(`[EventLoader]: Loading event: ${event.name}`);

        if (!event.run || !event.name) {
            logger.error(
                `[EventLoader]: ${event.name} has no run function or no name. Please fix this and restart the bot.`,
            );
            process.exit(1);
        }

        if (event.once) {
            logger.warning(`[EventLoader]: ${event.name} is a once event.`);
            teamspeak.once(event.name, event.run);
            return;
        } else {
            teamspeak.on(event.name, event.run);
        }
    });
}

// This must be in the main file to call the commander
teamspeak.on('ready', async () => {
    logger.info('Successfully connected to Teamspeak.');
    logger.info('Running bot init...');
    await initbot();
    await commander.addInstance(teamspeak);
    logger.info('Commander ready!');
    logger.info('Bot ready!');
});
