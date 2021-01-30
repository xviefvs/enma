import moment from 'moment';
import 'moment-duration-format';
import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class PlayCommand extends Command {
	constructor() {
		super('play', {
			aliases: ['play', 'p'],
			description: {
				ctx: 'Play a song or playlist from youtube and more...',
				usage: '{prefix}play <song>',
				example: ['{prefix}play never gonna give you up'],
			},
			clientPermissions: ['CONNECT', 'SPEAK'],
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
			});

		if (player.state !== 'CONNECTED') player.connect();

		switch (res.loadType) {
			case 'SEARCH_RESULT':
			case 'TRACK_LOADED':
				player.queue.add(res.tracks[0]);

				if (!player.playing && !player.paused && !player.queue.size)
					return player.play();

				const { title, uri, duration, thumbnail } = res.tracks[0];

				const trackEmbed = this.client.util
					.embed()
					.setAuthor(
						this.client.user?.username,
						this.client.user?.displayAvatarURL(),
					)
					.setThumbnail(thumbnail!)
					.addField('Song added to the queue 🎶', `\`${title}\``)
					.addField(
						'Duration',
						moment
							.duration(duration, 'milliseconds')
							.format('mm:ss'),
					)
					.setTimestamp();

				message.util?.send(trackEmbed);
				break;
		}
	}
}
