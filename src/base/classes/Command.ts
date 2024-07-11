import {
  ChatInputCommandInteraction,
  CacheType,
  AutocompleteInteraction
} from 'discord.js'
import ICommand from '../interfaces/ICommand'
import CustomClient from './CustomClient'
import ICommandOptions from '../interfaces/ICommandOptions'

export default class Command implements ICommand {
  client: CustomClient
  name: string
  description: string
  dm_permission: boolean
  default_member_permissions: bigint
  options: Object

  constructor (client: CustomClient, options: ICommandOptions) {
    this.client = client
    this.name = options.name
    this.description = options.description
    this.dm_permission = options.dm_permission
    this.default_member_permissions = options.default_member_permissions
    this.options = options.options
  }

  execute (interaction: ChatInputCommandInteraction<CacheType>): void {}
  autoComplete (interaction: AutocompleteInteraction<CacheType>): void {}
}
