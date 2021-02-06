import { Message, User } from 'discord.js';
import { Command } from 'discord-akairo';

export default class TRiggerd extends Command {
	constructor() {
		super('triggered', {
			aliases: ['trigger', 'triggered'],
			description: {
				ctx: 'Trigger an user',
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

		const msg = await message.util!.send(
			`${this.client.config.emotes.settings} Procesing...`,
		);

		await this.client
			.fetch(
				`https://some-random-api.ml/canvas/triggered/?avatar=${user.displayAvatarURL(
					{ format: 'png', dynamic: false },
				)}`,
			)
			.then((res) => res.buffer())
			.then((buffer) => {
				msg.deletable && msg.delete();
				message.util!.send(
					this.client.util.attachment(
						buffer,
						`${user.username}_triggered.gif`,
					),
				);
			});
	}
}
