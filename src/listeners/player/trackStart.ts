import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { Player, Track } from 'erela.js';

export default class TrackStart extends Listener {
	constructor() {
		super('trackStart', {
			emitter: 'music',
			event: 'trackStart',
		});
	}

	async exec(player: Player, track: Track) {
		const embed = this.client.util
			.embed()
			.setAuthor('Now Playing', this.client.config.emotes.spin_main)
			.setColor('YELLOW')
			.setThumbnail(track.thumbnail!)
			.setDescription(`**[${track.title}](${track.uri})**`)
			.setTimestamp();
		const channel = this.client.channels.cache.get(
			player.textChannel!,
		) as TextChannel;
		if (channel) channel.send(embed);
	}
}
