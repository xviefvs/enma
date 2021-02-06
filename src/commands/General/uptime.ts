import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import moment from 'moment';

export default class BotInvite extends Command {
	constructor() {
		super('uptime', {
			aliases: ['uptime', 'ut'],
			description: {
				ctx: 'Get the bot invite link.',
			},
		});
	}

	exec(message: Message) {
		const uptime = (moment.duration(this.client.uptime) as any).format(
			' D [days], H [hrs], m [mins], s [secs]',
		);
		message.util!.send(
			this.client.util
				.embed()
				.setColor(message.guild!.me!.displayHexColor)
				.setDescription(uptime)
				.setTimestamp(),
		);
	}
}
