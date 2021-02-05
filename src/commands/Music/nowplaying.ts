import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import Youtube from 'youtube-sr';
import createBar from 'string-progressbar';

export default class NowPlaying extends Command {
	constructor() {
		super('nowplaying', {
			aliases: ['nowplaying', 'np'],
			description: {
				ctx: 'Get info about current playing song.',
			},
			clientPermissions: ['EMBED_LINKS'],
		});
	}

	async exec(message: Message) {
		const player = this.client.music.players.get(message.guild!.id);

		if (!player) return message.util!.send('> There is no music playing.');

		const song = player.queue.current;

		const duration = song!.duration;

		message.util!.send('> Fetching current track data...');

		const data = await Youtube.searchOne(song?.identifier ?? song!.title!);

		const end =
			duration! > 6.048e8
				? '🔴 LIVE'
				: new Date(duration!).toISOString().slice(11, 19);

		const embed = this.client.util
			.embed()
			.setAuthor('Now Playing', this.client.config.emotes.sharingan_spin)
			.setColor(message.member?.displayHexColor ?? 'BLURPLE')
			.setThumbnail(data.thumbnail?.url!)
			.addFields([
				{
					name: 'Title',
					value: `**[${data.title}](${data.url})**`,
					inline: false,
				},
				{
					name: 'Uploader',
					value: data.channel?.name,
					inline: true,
				},
				{
					name: 'Views',
					value: data.views.toLocaleString(),
					inline: true,
				},
				{
					name: 'Uploaded At',
					value: data.uploadedAt,
					inline: true,
				},
				{
					name: '\u200b',
					value:
						new Date(player.position).toISOString().slice(11, 19) +
						' [' +
						createBar(
							// @ts-ignore
							duration > 6.048e8 ? player.position : duration,
							player.position,
							15,
							this.client.config.emotes.slider,
							this.client.config.emotes.sharingan,
						)[0] +
						'] ' +
						end,
					inline: false,
				},
			])
			.setTimestamp();

		message.util!.send(embed);
	}
}
