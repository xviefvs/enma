import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { Player } from 'erela.js';

export default class TrackStart extends Listener {
	constructor() {
		super('queueEnd', {
			emitter: 'music',
			event: 'queueEnd',
		});
	}

	exec(player: Player) {
		const embed = this.client.util
			.embed()
			.setAuthor(
				this.client.user?.username,
				this.client.user?.displayAvatarURL(),
			)
			.setDescription('> Queue has ended.')
			.setTimestamp();

		const channel = this.client.channels.cache.get(
			player.textChannel!,
		) as TextChannel;
		if (channel) channel.send(embed);
	}
}
