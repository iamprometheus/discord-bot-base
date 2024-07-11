import { Collection } from 'discord.js'
import IConfig from './IConfig'
import Command from '../classes/Command'
// import MusicPlayer from '../classes/MusicPlayer'

export default interface ICustomClient {
  config: IConfig
  commands: Collection<string, Command>
  developmentMode: boolean
  // player: MusicPlayer

  Init: () => void
  LoadHandlers: () => void
}
