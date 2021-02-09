import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Supreme extends Command {
	constructor() {
		super('supreme', {
			aliases: ['supreme'],
			description: {
				ctx: 'Supremeify your text',
				usage: '<text> [mode]',
				example: ['tomc', 'tomc dark', 'tomc light'],
			},
			args: [{ id: 'text', match: 'content' }],
		});
	}

	async exec(message: Message, { text }: { text: string }) {
		if (!text)
			return message.channel.send(
				'> You need to give me some text first.',
			);

		await this.client
			.fetch(
				`https://api.alexflipnote.dev//supreme?text=${encodeURIComponent(
					text,
				)}&dark=true`,
				{
					headers: {
						Authorization: process.env.image_token!,
						'User-Agent': `Enma`,
					},
				},
			)
			.then((res) => res.buffer())
			.then((buffer) => {
				message.channel.send({
					files: [{ attachment: buffer, name: 'supreme.png' }],
				});
			});
	}
}
