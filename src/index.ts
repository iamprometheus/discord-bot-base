import CustomClient from './base/classes/CustomClient'

const client = new CustomClient()
client.Init().catch(e => console.log(e))
// Events
// console.log(client)ssss

// const eventsPath = './events'
// const eventFiles = readdirSync('./src/events').filter(file => file.endsWith('.ts'))
// for (const file of eventFiles) {
//   const filePath = eventsPath + '/' + file
//   const event = await import(filePath)
//   if (event.once) {
//     client.once(event.name, (...args) => event.execute(...args))
//   } else {
//     client.on(event.name, (...args) => event.execute(...args))
//   }
// }

// Commands
// client.commands = new Collection()

// const commandsPath = './commands/slashCommands'
// const commandFiles = readdirSync(commandsPath).filter(file =>
//   file.endsWith('.js')
// )

// for (const file of commandFiles) {
//   const filePath = commandsPath + '/' + file
//   const { data, execute } = await import(filePath)
//   // Set a new item in the Collection with the key as the command name and the value as the exported module
//   if (data && execute) {
//     client.commands.set(data.name, { data, execute })
//   } else {
//     console.log(
//       `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
//     )
//   }
// }

// Log in to Discord with your client's token
