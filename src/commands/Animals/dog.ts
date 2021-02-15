import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Dog extends Command {
	constructor() {
		super('dog', {
			aliases: ['dog', 'doggo'],
			description: {
				ctx: 'Get a dog picture and a bonus dog fact.',
			},
		});
	}

	async exec(message: Message) {
		const img = await (
			await this.client.fetch('https://some-random-api.ml/img/dog')
		).json();

		const fact = await (
			await this.client.fetch('https://some-random-api.ml/facts/dog')
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
