import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class YTComment extends Command {
	constructor() {
		super('ytcomment', {
			aliases: ['ytcomment'],
			description: {
				ctx: 'ytcomment',
				usage: '[comment]',
				example: ['this is a youtube comment'],
			},
			args: [
				{
					id: 'comment',
					match: 'content',
				},
			],
		});
	}

	async exec(message: Message, { comment }: { comment: string }) {
		if (!comment)
			return message.channel.send(
				'> You need to provide some text for the comment.',
			);

		if (comment.length > 1000)
			return message.channel.send(
				'> The comment can only be 1000 characters or less.',
			);

		const msg = await message.channel.send(
			`${this.client.config.emotes.settings} Processing...`,
		);

		await this.client
			.fetch(
				`https://some-random-api.ml/canvas/youtube-comment/?avatar=${message.author.displayAvatarURL(
					{ format: 'png' },
				)}&username=${
					message.author.username
				}&comment=${encodeURIComponent(comment)}`,
			)
			.then((res) => res.buffer())
			.then((buffer) =>
				message.channel.send({
					files: [{ attachment: buffer, name: 'ytcomment.png' }],
				}),
			);
	}
}
