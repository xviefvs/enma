import { stripIndents } from 'common-tags';
import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { Player, Track } from 'erela.js';
import Youtube from 'youtube-sr';

export default class TrackStart extends Listener {
	constructor() {
		super('trackStart', {
			emitter: 'music',
			event: 'trackStart',
		});
	}

	async exec(player: Player, track: Track) {
		const data = await Youtube.searchOne(track.uri);

		const embed = this.client.util
			.embed()
			.setAuthor(
				'Now Playing',
				'https://cdn.discordapp.com/emojis/722279362329837570.gif?v=1',
			)
			.setColor('YELLOW')
			.setThumbnail(track.thumbnail!)
			.addField('Title', `**[${track.title}](${track.uri})**`)
			.addField('Uploader', track.author, true)
			.addField('Duration', data.durationFormatted, true)
			.addField('Views', data.views.toLocaleString(), true)
			.addField('Uploaded at', data.uploadedAt, true)
			.setTimestamp();

		const channel = this.client.channels.cache.get(
			player.textChannel!,
		) as TextChannel;
		if (channel) channel.send(embed);
	}
}
