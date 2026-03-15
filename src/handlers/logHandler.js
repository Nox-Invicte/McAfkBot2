const config = require("../utils/config")

function sendLog(client, message){
    if (!client || !config.logChannel) return

    const channel = client.channels?.cache?.get(config.logChannel)

    if(channel){
        channel.send(message).catch(() => {})
    }

}

module.exports = { sendLog }