import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class MemeCommand extends Command {
	constructor() {
		super('meme', {
			aliases: ['memes', 'meme'],
			description: {
				ctx: 'Get memes from reddit',
			},
		});
	}

	async exec(message: Message) {
		const subs = ['memes', 'dankmemes'];
		const sub = Math.floor(Math.random() * subs.length);
		const res = await this.client.ksoft.images.reddit(subs[sub], {
			span: 'day',
			removeNSFW: false,
		});

		const embed = this.client.util
			.embed()
			.setColor('RANDOM')
			.setDescription(`**[${res.post.title}](${res.url})**`)
			.setImage(res.url)
			.setFooter(
				`👍 ${res.post.upvotes} 👎 ${res.post.downvotes} 💬 ${res.post.comments}`,
			);

		message.channel.send(embed);
	}
}
