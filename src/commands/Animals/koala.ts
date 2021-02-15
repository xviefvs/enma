import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class koala extends Command {
	constructor() {
		super('koala', {
			aliases: ['koala'],
			description: {
				ctx: 'Get a koala picture and a bonus koala fact.',
			},
		});
	}

	async exec(message: Message) {
		const img = await (
			await this.client.fetch('https://some-random-api.ml/img/koala')
		).json();

		const fact = await (
			await this.client.fetch('https://some-random-api.ml/facts/koala')
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
