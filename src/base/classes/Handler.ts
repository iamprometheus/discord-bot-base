/* eslint-disable no-alert, no-console, new-cap, @typescript-eslint/strict-boolean-expressions */

import path from 'path'
import { glob } from 'glob'
import IHandler from '../interfaces/IHandler'
import CustomClient from './CustomClient'
import Event from './Event'
import Command from './Command'

export default class Handler implements IHandler {
  client: CustomClient
  constructor (client: CustomClient) {
    this.client = client
  }

  async LoadEvents (): Promise<void> {
    const files = (await glob('dist/events/**/*.js')).map(filePath =>
      path.resolve(filePath)
    )

    files.map(async (file: string) => {
      const event: Event = new (await import(file)).default(this.client)

      const execute = (...args: any): void => event.execute(...args)

      // @ts-expect-error No
      if (event.once) this.client.once(event.name, execute)
      // @ts-expect-error No
      else this.client.on(event.name, execute)

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      return delete require.cache[require.resolve(file)]
    })
  }

  async LoadCommands (): Promise<void> {
    const files = (await glob('dist/commands/**/*.js')).map(filePath =>
      path.resolve(filePath)
    )

    files.map(async (file: string) => {
      const command: Command = new (await import(file)).default(this.client)

      this.client.commands.set(command.name, command)
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      return delete require.cache[require.resolve(file)]
    })
  }
}
