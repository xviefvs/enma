import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Panda extends Command {
	constructor() {
		super('panda', {
			aliases: ['panda'],
			description: {
				ctx: 'Get a panda picture and a bonus panda fact.',
			},
		});
	}

	async exec(message: Message) {
		const img = await (
			await this.client.fetch('https://some-random-api.ml/img/panda')
		).json();

		const fact = await (
			await this.client.fetch('https://some-random-api.ml/facts/panda')
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
