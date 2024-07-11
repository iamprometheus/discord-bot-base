import { Client, Collection, GatewayIntentBits } from 'discord.js'
import ICustomClient from '../interfaces/ICustomClient'
import IConfig from '../interfaces/IConfig'
import 'dotenv/config'
import Handler from './Handler'
import Command from './Command'
// import MusicPlayer from './MusicPlayer'

export default class CustomClient extends Client implements ICustomClient {
  config: IConfig
  handler: Handler
  commands: Collection<string, Command>
  developmentMode: boolean
  // player: MusicPlayer

  constructor () {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
      ]
    })

    this.config = {
      token: process.env.TOKEN ?? 'NO_TOKEN',
      clientId: process.env.CLIENT_ID ?? 'NO_CLIENT_ID',
      devGuildId: process.env.GUILD_ID ?? 'NO_GUILD_ID'
    }
    this.developmentMode = process.argv.slice(2).includes('--development')
    this.handler = new Handler(this)
    this.commands = new Collection()
    // this.player = new MusicPlayer(this)
  }

  async Init (): Promise<void> {
    // await this.player.extractors.loadDefault(ext => ext !== 'YouTubeExtractor')
    console.log(
      `Starting the bot in ${
        this.developmentMode ? 'development' : 'production'
      } mode`
    )
    this.LoadHandlers()

    this.login(this.config.token).catch(e => console.error(e))
  }

  LoadHandlers (): void {
    this.handler.LoadEvents().catch(e => console.log(e))
    this.handler.LoadCommands().catch(e => console.log(e))
  }
}
