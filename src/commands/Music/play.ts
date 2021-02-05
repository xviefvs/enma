import moment from 'moment';
import 'moment-duration-format';
import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import { TrackUtils } from 'erela.js';
import yt from 'youtube-sr';

export default class PlayCommand extends Command {
	constructor() {
		super('play', {
			aliases: ['play', 'p'],
			description: {
				ctx: 'Play a song or playlist from youtube and more...',
				usage: '<song>',
				example: ['never gonna give you up'],
			},
			clientPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
			args: [
				{
					id: 'song',
					match: 'content',
				},
			],
		});
	}
	async exec(message: Message, { song }: { song: string }) {
		if (!message.member?.voice.channel)
			return message.util?.send(
				'> You need to be in a voice channel to use this command.',
			);

		if (!song) song = message.attachments.first()?.proxyURL!;

		if (!song)
			return message.util?.send(
				'> You need to give me a song name or link to search.',
			);

		const res = await this.client.music.search(song, message.member);

		const player =
			this.client.music.players.get(message.guild!.id) ??
			this.client.music.create({
				guild: message.guild?.id!,
				textChannel: message.channel.id,
				voiceChannel: message.member?.voice.channel!.id,
				selfDeafen: true,
				volume: 85,
			});

		if (
			player.playing &&
			message.member.voice.channel.id !==
				message.guild?.me?.voice.channel?.id
		)
			return message.channel.send(
				'> You need to be in the same voice channel as mine to play a song.',
			);

		if (player.state !== 'CONNECTED') player.connect();

		switch (res.loadType) {
			case 'SEARCH_RESULT':
			case 'TRACK_LOADED':
				player.queue.add(res.tracks[0]);

				if (!player.playing && !player.paused && !player.queue.size)
					return player.play();

				const { title, duration, thumbnail } = res.tracks[0];

				const trackEmbed = this.client.util
					.embed()
					.setColor(message.member.displayHexColor)
					.addField('Enqueued 🎶', `\`${title}\` [${message.author}]`)
					.setTimestamp();
				message.util?.send(trackEmbed);
				break;
			case 'PLAYLIST_LOADED':
				// if (res.tracks.length > 300)
				// 	return message.channel.send(
				// 		'> You can only play a playlist with 300 tracks or less.',
				// 	);

				player.queue.add(res.tracks);

				if (
					!player.playing &&
					!player.paused &&
					player.queue.totalSize === res.tracks.length
				)
					player.play();

				const playlistEmbed = this.client.util
					.embed()
					.setColor(message.member.displayHexColor ?? 'BLURPLE')
					.setAuthor(
						message.author.username,
						message.author.displayAvatarURL({ dynamic: true }),
					)
					.setThumbnail(res.tracks[0].thumbnail!)
					.addField(
						`Enqueued Playlist 🎶`,
						`**[${res.playlist?.name}](${song})** with \`${res.tracks.length}\` tracks.`,
					)
					.addField(
						'Duration',
						moment
							.duration(res.playlist?.duration, 'milliseconds')
							.format('hh:mm:ss'),
						true,
					)
					.setTimestamp();
				message.util?.send(playlistEmbed);
				break;
			case 'LOAD_FAILED':
				if (!player.queue.current) player.destroy();
				throw res.exception;
				break;
			case 'NO_MATCHES':
				if (!player.queue.current) player.destroy();
				message.channel.send(
					this.client.util
						.embed()
						.setAuthor(
							message.author.username,
							message.author.displayAvatarURL({ dynamic: true }),
						)
						.setColor('RED')
						.setDescription(
							`> I can\'t find any results for: ${song}`,
						)

						.setColor(message.member.displayHexColor ?? 'BLURPLE'),
				);
				break;
		}
	}
}
