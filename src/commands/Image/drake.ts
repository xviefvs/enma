import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Drake extends Command {
	constructor() {
		super('drake', {
			aliases: ['drake'],
			description: {
				ctx: 'Make a drake meme',
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
				`https://api.alexflipnote.dev/drake?top=${top}&bottom=${bottom}`,
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
					files: [{ attachment: buffer, name: 'drake.png' }],
				});
			});
	}
}
