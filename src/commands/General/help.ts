import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class HelpCommand extends Command {
	constructor() {
		super('help', {
			aliases: ['help', 'h'],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				ctx: 'Get all the available commands.',
				usage: '{prefix}help',
				example: ['{prefix}help'],
			},
			args: [
				{
					id: 'command',
				},
			],
		});
	}

	async exec(message: Message, { command }: { command: Command }) {}
}
