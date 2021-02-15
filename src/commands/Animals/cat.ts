import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Cat extends Command {
	constructor() {
		super('cat', {
			aliases: ['cat', 'neko'],
			description: {
				ctx: 'Get a cat picture and a bonus cat fact.',
			},
		});
	}

	async exec(message: Message) {
		const img = await (
			await this.client.fetch('https://some-random-api.ml/img/cat')
		).json();

		const fact = await (
			await this.client.fetch('https://some-random-api.ml/facts/cat')
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
