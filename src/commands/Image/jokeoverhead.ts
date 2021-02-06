import { Message, User } from 'discord.js';
import { Command } from 'discord-akairo';

export default class didyoumean extends Command {
	constructor() {
		super('jokeoverhead', {
			aliases: ['jokeoverhead', 'joh'],
			description: {
				ctx: 'The command name say it all',
				usage: '[user]',
				example: ['@tomc#7817'],
			},
			args: [
				{
					id: 'top',
					type: 'user',
				},
			],
		});
	}

	async exec(message: Message, { top }: { top: User }) {
		const msg = await message.util!.send(
			`${this.client.config.emotes.settings} Processing...`,
		);

		if (!top) top = message.author;

		const avatar = top.displayAvatarURL({ dynamic: false, format: 'png' });

		await this.client
			.fetch(
				`https://api.alexflipnote.dev/jokeoverhead?image=${avatar}`,
				{
					headers: {
						Authorization: process.env.image_token!,
						'User-Agent': `Enma`,
					},
				},
			)
			.then((res) => res.buffer())
			.then((buffer) => {
				msg.deletable && msg.delete();
				message.util!.send({
					files: [{ attachment: buffer, name: 'jokeoverhead.png' }],
				});
			});
	}
}
