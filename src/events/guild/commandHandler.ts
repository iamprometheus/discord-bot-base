/* eslint-disable no-alert, no-console, new-cap, @typescript-eslint/strict-boolean-expressions */

import { ChatInputCommandInteraction, Events } from 'discord.js'
import CustomClient from '../../base/classes/CustomClient'
import Event from '../../base/classes/Event'
import Command from '../../base/classes/Command'

export default class CommandHandler extends Event {
  constructor (client: CustomClient) {
    super(client, {
      name: Events.InteractionCreate,
      description: 'Command Input Event',
      once: false
    })
  }

  execute (interaction: ChatInputCommandInteraction): void {
    if (!interaction.isChatInputCommand()) return

    const command: Command | undefined = this.client.commands.get(
      interaction.commandName
    )

    if (!command) {
      interaction
        .reply({
          content: "Command doesn't exists.",
          ephemeral: true
        })
        .catch(e => console.log(e))
      return
    }

    try {
      return command.execute(interaction)
    } catch (e) {
      console.log(e)
    }
  }
}
