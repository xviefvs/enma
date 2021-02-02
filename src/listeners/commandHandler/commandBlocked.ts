import { Command, Listener } from 'discord-akairo';
import { Message } from 'discord.js';

export default class CommandBlockedListener extends Listener {
	public constructor() {
		super('commandBlocked', {
			emitter: 'commandHandler',
			event: 'commandBlocked',
		});
	}

	public exec(message: Message, command: Command, reason: string) {
		this.client.log.info(
			`Blocked ${command.aliases[0]} on ${
				message.guild
					? `${message.guild.name} (${message.guild.id})`
					: 'DM'
			} with reason ${reason}`,
			'command',
		);
	}
}
