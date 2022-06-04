const { db } = require("../services/db")

module.exports = {
    name: 'clientconnect',
    description: 'clientconnect Event For TeamSpeak',
    once: false,
    run: async (ev) => {
        const wladmindb = await db.get(`wl.admin.${ev.client.databaseId}`);
        const wluserdb = await db.get(`wl.user.${ev.client.databaseId}`);

        const isAdminEnabled = await db.get(`wl.admin.enabled`);
        const isUserEnabled = await db.get(`wl.user.enabled`);

        // Check if they are a server admin
        if (ev.client.servergroups.includes('6')) return;

        // Check if admin whitelist is enabled
        if (isAdminEnabled) {
            // Check if they are on the admin whitelist
            if (!wladmindb) {
                ev.client.message(
                    'You are not on the admin whitelist. If you feel this is in error, please contact a server admin with your DBID: ' +
                        ev.client.databaseId,
                );
                ev.client.kickFromServer(
                    'This sever is in admin whitelist mode. You are not on the whitelist.',
                );
                return;
            }
        }

        // Check if user whitelist is enabled
        if (isUserEnabled) {
            // Check if they are on the user whitelist
            if (!wluserdb) {
                ev.client.message(
                    'You are not on the user whitelist. If you feel this is in error, please contact a server admin with your DBID: ' +
                        ev.client.databaseId,
                );
                ev.client.kickFromServer(
                    'This sever is in user whitelist mode. You are not on the whitelist.',
                );
                return;
            }
        }
    },
};
