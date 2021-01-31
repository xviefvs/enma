import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { Player, Track } from 'erela.js';
import moment from 'moment';
import 'moment-duration-format';

export default class TrackStart extends Listener {
	constructor() {
		super('trackStart', {
			emitter: 'music',
			event: 'trackStart',
		});
	}

	exec(player: Player, track: Track) {
		const embed = this.client.util
			.embed()
			.setAuthor(
				this.client.user?.username,
				this.client.user?.displayAvatarURL(),
			)
			.setColor('YELLOW')
			.setThumbnail(track.thumbnail!)
			.addField('Now Playing 🎶', `\`${track.title}\``)
			.addField(
				'Duration',
				moment.duration(track.duration, 'milliseconds').format('mm:ss'),
			)
			.setTimestamp();

		const channel = this.client.channels.cache.get(
			player.textChannel!,
		) as TextChannel;
		if (channel) channel.send(embed);
	}
}
