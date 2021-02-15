import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class birb extends Command {
	constructor() {
		super('birb', {
			aliases: ['birb', 'bird'],
			description: {
				ctx: 'Get a birb picture and a bonus birb fact.',
			},
		});
	}

	async exec(message: Message) {
		const img = await (
			await this.client.fetch('https://some-random-api.ml/img/birb')
		).json();

		const fact = await (
			await this.client.fetch('https://some-random-api.ml/facts/bird')
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
