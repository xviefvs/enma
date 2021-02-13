import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class FactCommand extends Command {
	constructor() {
		super('fact', {
			aliases: ['fact'],
			description: {
				ctx: 'Get a random fact',
			},
		});
	}

	async exec(message: Message) {
		await this.client
			.fetch('https://nekos.life/api/v2/fact')
			.then((res) => res.json())
			.then((json) => {
				const embed = this.client.util
					.embed()
					.setColor('RANDOM')
					.setDescription(json.fact)
					.setAuthor(
						'Did you know',
						message.author.displayAvatarURL({ dynamic: true }),
					)
					.setTimestamp();

				return message.channel.send(embed);
			});
	}
}
