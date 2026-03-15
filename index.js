const express = require("express")
const config = require("./src/utils/config")
const logger = require("./src/utils/logger")

const { startDiscordBot } = require("./src/bot/discordBot")
const { startMinecraftBot } = require("./src/bot/minecraftBot")

const hasDiscordConfig = Boolean(config.discordToken)
const hasMinecraftConfig = Boolean(config.server && config.port && config.username)

if (hasDiscordConfig) {
    startDiscordBot()
} else {
    logger.warn("Discord bot not started: missing DISCORD_TOKEN")
}

if (hasMinecraftConfig) {
    startMinecraftBot().catch((err) => {
        logger.error(`Failed to start Minecraft bot: ${err.message}`)
    })
} else {
    logger.warn("Minecraft bot not started: missing MC_SERVER, MC_PORT, or MC_USERNAME")
}

// Create HTTP server to keep Render alive
const app = express()
const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.status(200).send("Bot is running!")
})

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    })
})

app.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`)
    console.log(`Health check available at http://localhost:${PORT}/health`)
})