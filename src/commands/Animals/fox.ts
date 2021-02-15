import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Fox extends Command {
	constructor() {
		super('fox', {
			aliases: ['fox'],
			description: {
				ctx: 'Get a fox picture and a bonus fox fact.',
			},
		});
	}

	async exec(message: Message) {
		const img = await (
			await this.client.fetch('https://some-random-api.ml/img/fox')
		).json();

		const fact = await (
			await this.client.fetch('https://some-random-api.ml/facts/fox')
		).json();

		const embed = this.client.util
			.embed()
			.setAuthor(
				'Did you know?',
				message.author.displayAvatarURL({ dynamic: true }),
			)
			.setDescription(fact.fact)
			.setImage(img.link)
			.setTimestamp()
			.setColor('RANDOM');

		return message.channel.send(embed);
	}
}
