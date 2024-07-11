import { Player } from 'discord-player'
import IMusicPlayer from '../interfaces/IMusicPlayer'
import CustomClient from './CustomClient'

export default class MusicPlayer extends Player implements IMusicPlayer {
  client: CustomClient

  constructor (client: CustomClient) {
    super(client)
    this.client = client
  }
}
