import { Collection, Events, REST, Routes } from 'discord.js'
import CustomClient from '../../base/classes/CustomClient'
import Event from '../../base/classes/Event'
import Command from '../../base/classes/Command'

export default class Ready extends Event {
  constructor (client: CustomClient) {
    super(client, {
      name: Events.ClientReady,
      description: 'Ready Event',
      once: true
    })
  }

  async execute (): Promise<void> {
    const tag: string = this.client.user?.tag ?? 'unknkown'
    const guilds: number = this.client.guilds.cache.size
    console.log(`Ready! Logged in as ${tag}`)
    console.log(`Currently on ${guilds} guilds`)

    const rest = new REST().setToken(this.client.config.token)

    if (!this.client.developmentMode) {
      const globalCommands: any = await rest.put(
        Routes.applicationCommands(this.client.config.clientId),
        {
          body: this.GetJson(this.client.commands)
        }
      )

      return globalCommands?.length === 0
        ? console.log("Could't not set global commands")
        : console.log(
            `Succesfully set ${globalCommands.length} global command(s)` // eslint-disable-line @typescript-eslint/restrict-template-expressions
          ) // eslint-disable-line @typescript-eslint/indent
    }

    const commands = this.GetJson(this.client.commands)
    const devCommands: any = await rest.put(
      Routes.applicationGuildCommands(
        this.client.config.clientId,
        this.client.config.devGuildId
      ),
      {
        body: commands
      }
    )

    return devCommands?.length === 0
      ? console.log("Could't not set developer commands")
      : console.log(`Succesfully set ${devCommands.length} command(s)`) // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }

  private GetJson (commands: Collection<string, Command>): Object[] {
    const data: object[] = []

    commands.forEach(command => {
      data.push({
        name: command.name,
        description: command.description,
        options: command.options,
        default_member_permissions:
          command.default_member_permissions.toString(),
        dm_permissions: command.dm_permission
      })
    })

    return data
  }
}
