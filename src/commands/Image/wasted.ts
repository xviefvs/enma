import { Message, User } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Wasted extends Command {
	constructor() {
		super('wasted', {
			aliases: ['wasted'],
			description: {
				ctx: 'Wasted an user',
				usage: '[user]',
				example: ['@tomc#7817'],
			},
			args: [
				{
					id: 'user',
					type: 'user',
				},
			],
		});
	}

	async exec(message: Message, { user }: { user: User }) {
		if (!user) user = message.author;

		message.util!.send({
			files: [
				{
					attachment: `https://some-random-api.ml/canvas/wasted/?avatar=${user.displayAvatarURL(
						{ format: 'png', dynamic: false },
					)}`,
					name: 'wasted.png',
				},
			],
		});
	}
}
