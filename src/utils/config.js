require("dotenv").config()

function getLatestBedrockVersion() {
    try {
        return require("bedrock-protocol/src/options").CURRENT_VERSION
    } catch {
        // Fallback if package internals change.
        return "1.26.0"
    }
}

const LATEST_BEDROCK_VERSION = getLatestBedrockVersion()

module.exports = {
    discordToken: process.env.DISCORD_TOKEN,
    server: process.env.MC_SERVER,
    port: Number(process.env.MC_PORT),
    username: process.env.MC_USERNAME,
    mcVersion: process.env.MC_VERSION?.trim() || LATEST_BEDROCK_VERSION,

    logChannel: process.env.LOG_CHANNEL_ID,
    chatChannel: process.env.CHAT_CHANNEL_ID,
    chatWebhook: process.env.CHAT_WEBHOOK_URL,

    joinCommand: process.env.JOIN_COMMAND
}