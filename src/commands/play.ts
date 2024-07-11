import {
  ApplicationCommandOptionType,
  CacheType,
  ChatInputCommandInteraction,
  PermissionsBitField
} from 'discord.js'
import Command from '../base/classes/Command'
import CustomClient from '../base/classes/CustomClient'
import ytdl from 'ytdl-core'
import ytSearch, { VideoSearchResult } from 'yt-search'
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnection
} from '@discordjs/voice'
import { isUrl } from '../utils/utils'
// import { QueueRepeatMode } from 'discord-player'

export default class Play extends Command {
  constructor (client: CustomClient) {
    super(client, {
      name: 'play',
      description: 'Reproducir canción desde una búsqueda.',
      dm_permission: false,
      default_member_permissions:
        PermissionsBitField.Flags.UseApplicationCommands,
      options: [
        {
          name: 'canción',
          description: 'Canción a reproducir.',
          type: ApplicationCommandOptionType.String,
          required: true,
          max_length: 100
        }
      ]
    })
  }

  async execute (
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    if (interaction.guild == null) return
    if (interaction.guild.members.me == null) return
    if (interaction.channel == null) return
    if (interaction.member == null) return

    const channelId = interaction.guild.members.cache.get(
      interaction.member.user.id
    )?.voice.channelId

    await interaction.deferReply()
    if (channelId === null || channelId === undefined) {
      interaction
        .editReply('No te encuentras en un canal de voz al cual pueda unirme.')
        .catch(e => console.log(e))
      return
    }
    const botPermissions = interaction.guild.members.me.permissions.serialize()

    if (!botPermissions.Connect) {
      interaction
        .editReply('Error: no tengo permisos para unirme al canal de voz.')
        .catch(e => console.error(e))
      return
    }

    const guildId = interaction.guild.id
    const adapterCreator = interaction.guild.voiceAdapterCreator

    const query = interaction.options.getString('canción')
    if (query === null) return

    // const result = await this.client.player.search(query, {
    //   requestedBy: interaction.user,
    //   searchEngine: 'soundcloud'
    // })

    // if (!result.hasTracks()) {
    //   const embed = new EmbedBuilder({
    //     title: 'No results found',
    //     description: `No results found for \`${query}\``
    //   })
    //   interaction.editReply({ embeds: [embed] }).catch(e => console.log(e))
    //   return
    // }

    // try {
    //   const { track, searchResult } = await this.client.player.play(
    //     channelId,
    //     result,
    //     {
    //       nodeOptions: {
    //         metadata: null,
    //         repeatMode: undefined,
    //         noEmitInsert: true,
    //         leaveOnStop: false,
    //         leaveOnEmpty: true,
    //         leaveOnEmptyCooldown: 60000,
    //         leaveOnEnd: true,
    //         leaveOnEndCooldown: 60000,
    //         pauseOnEmpty: true,
    //         preferBridgedMetadata: true,
    //         disableBiquad: true
    //       },
    //       requestedBy: interaction.user,
    //       connectionOptions: {
    //         deaf: true
    //       }
    //     }
    //   )

    //   const embed = new EmbedBuilder({
    //     title: `${searchResult.hasPlaylist() ? 'Playlist' : 'Track'} queued!`,
    //     thumbnail: { url: track.thumbnail },
    //     description: `[${track.title}](${track.url})`,
    //     fields:
    //       searchResult.playlist !== null && searchResult.playlist !== undefined
    //         ? [{ name: 'Playlist', value: searchResult.playlist.title }]
    //         : []
    //   })
    //   interaction.editReply({ embeds: [embed] }).catch(e => console.log(e))
    // } catch (e) {
    //   console.error(e)

    //   const embed = new EmbedBuilder({
    //     title: 'Something went wrong',
    //     description: `Something went wrong while playing \`${query}\``
    //   })
    //   interaction.editReply({ embeds: [embed] }).catch(e => console.log(e))
    // const search = await this.client.player.search(query)
    // console.log(search.tracks[0])
    // await this.client.player.play(channelId, search.tracks[0])

    if (isUrl(query)) {
      interaction
        .editReply('Lo siento por ahora no soporto la busqueda de enlaces.')
        .catch(e => console.log(e))
      return
    }

    const queryResult = await this.searchVideo(query)

    if (queryResult === null) {
      interaction
        .editReply('No se ha encontrado videos con la búsqueda introducida.')
        .catch(e => console.log(e))
      return
    }

    const connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator
    })

    this.playAudio(connection, queryResult.url)

    interaction.editReply(`Playing ${query}`).catch(e => console.log(e))
  }

  private playAudio (connection: VoiceConnection, video: string): void {
    const player = createAudioPlayer()
    const stream = ytdl(video, { filter: 'audioonly' })
    const resource = createAudioResource(stream)

    player.play(resource)
    connection.subscribe(player)

    player.on('error', error => {
      console.error(error)
    })
    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy()
    })
  }

  private async searchVideo (query: string): Promise<VideoSearchResult | null> {
    const searchResults = await ytSearch(query)
    if (searchResults.videos.length === 0) return null
    return searchResults.videos[0]
  }
}
