import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import { exec } from 'child_process';

export default class Execute extends Command {
	constructor() {
		super('exec', {
			aliases: ['exec', 'ex'],
			ownerOnly: true,
			args: [
				{
					id: 'code',
					match: 'content',
				},
			],
		});
	}

	async exec(message: Message, args: any) {
		exec(args.code, (error, stdout) => {
			const response = error || stdout;
			message.channel.send(response, { code: true, split: true });
		});
	}
}
