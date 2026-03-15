const { Client, Intents } = require("discord.js")

const config = require("../utils/config")
const logger = require("../utils/logger")

const { startMinecraftBot, stopMinecraftBot, getStatus, sendMessage, setDiscordClient } = require("./minecraftBot")

let client = null

function startDiscordBot() {
    if (client) {
        return client
    }

    if (!config.discordToken) {
        logger.warn("Discord bot login skipped: missing DISCORD_TOKEN")
        return null
    }

    client = new Client({
        intents:[
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.MESSAGE_CONTENT
        ]
    })

    client.once("ready",()=>{
        logger.info("Discord bot ready")
        setDiscordClient(client)
    })

    client.on("messageCreate", async (msg)=>{

        if(msg.author.bot) return

        if(msg.content === "?start"){

            const started = await startMinecraftBot(client)
            if (started) {
                msg.reply("✅ Minecraft bot started")
            } else {
                msg.reply("⚠️ Minecraft bot could not start. Check MC_SERVER, MC_PORT, and MC_USERNAME.")
            }

        }

        if(msg.content === "?stop"){

            stopMinecraftBot()
            msg.reply("✅ Minecraft bot stopped")

        }

        if(msg.content === "?status"){

            const status = getStatus()

            if(status.connected){
                msg.reply(`🟢 Connected to ${status.server} as ${status.username}`)
            } else {
                msg.reply("🔴 Not connected to Minecraft server")
            }

        }

        if(msg.content.startsWith("?send ")){

            const message = msg.content.substring(6)

            if(!message || message.trim() === ""){
                msg.reply("⚠️ Please provide a message to send")
                return
            }

            try {
                const result = sendMessage(message)
                if(result){
                    msg.reply(`✅ Message sent to Minecraft server: "${message}"`)
                } else {
                    msg.reply(`⚠️ Message queued but confirmation uncertain: "${message}"`)
                }
            } catch(err) {
                msg.reply(`❌ Failed to send message: ${err.message}`)
            }

        }

    })

    client.login(config.discordToken).catch((err) => {
        logger.error(`Discord login failed: ${err.message}`)
        client = null
    })

    return client
}

function getDiscordClient() {
    return client
}

module.exports = { startDiscordBot, getDiscordClient }