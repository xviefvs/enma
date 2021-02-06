import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import fetch from 'node-fetch';

export default class magic extends Command {
	constructor() {
		super('8ball', {
			aliases: ['8ball', '8b'],
			description: {
				ctx: 'Ask a question',
				usage: '<question>',
				example: ['question here'],
			},
			args: [
				{
					id: 'question',
					match: 'content',
				},
			],
		});
	}

	async exec(message: Message, { question }: { question: string }) {
		if (!question)
			return message.channel.send(
				'> You need to give me a question to answers.',
			);

		const res = await fetch(`https://nekos.life/api/v2/8ball`)
			.then((res) => res.json())
			.then((json) => {
				const embed = this.client.util
					.embed()
					.setAuthor(
						message.author.username,
						message.author.displayAvatarURL({ dynamic: true }),
					)
					.setColor(message.member!.displayHexColor)
					.setImage(json.url)
					.setDescription(
						stripIndents`
		    **Question:** \`${question}\`

		    **The magic 8ball say...** \`${json.response}\`
		    `,
					)
					.setTimestamp();

				message.util!.send(embed);
			});
	}
}
