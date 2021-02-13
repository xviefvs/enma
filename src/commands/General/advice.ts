import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class AdviceCommand extends Command {
	constructor() {
		super('advice', {
			aliases: ['advice'],
			description: {
				ctx: 'Get you a random advice',
			},
		});
	}

	async exec(message: Message) {
		await this.client
			.fetch('https://api.adviceslip.com/advice')
			.then((res) => res.json())
			.then((json) => {
				const embed = this.client.util
					.embed()
					.setAuthor(
						'Here is your advice',
						message.author.displayAvatarURL({ dynamic: true }),
					)
					.setDescription(json.slip.advice)
					.setColor('RANDOM')
					.setTimestamp();

				return message.channel.send(embed);
			});
	}
}
