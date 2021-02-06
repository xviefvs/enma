import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class didyoumean extends Command {
	constructor() {
		super('didyoumean', {
			aliases: ['didyoumean'],
			description: {
				ctx: 'Make a didyoumean meme',
			},
			args: [
				{
					id: 'top',
					prompt: {
						start: 'What do you want the top text to be?',
					},
				},
				{
					id: 'bottom',
					prompt: {
						start: 'What do you want the bottom text to be?',
					},
				},
			],
		});
	}

	async exec(
		message: Message,
		{ top, bottom }: { top: string; bottom: string },
	) {
		const msg = await message.util!.send(
			`${this.client.config.emotes.settings} Processing...`,
		);
		await this.client
			.fetch(
				`https://api.alexflipnote.dev/didyoumean?top=${top}&bottom=${bottom}`,
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
					files: [{ attachment: buffer, name: 'didyoumean.png' }],
				});
			});
	}
}
