import CustomClient from '../classes/CustomClient'
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction
} from 'discord.js'

export default interface ICommand {
  client: CustomClient
  name: string
  description: string
  dm_permission: boolean
  default_member_permissions: bigint
  options: Object

  execute: (interaction: ChatInputCommandInteraction) => void
  autoComplete: (interaction: AutocompleteInteraction) => void
}
