import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import ub from 'urban-dictionary';

export default class Define extends Command {
	constructor() {
		super('define', {
			aliases: ['define'],
			description: {
				ctx: 'Define a word',
				usage: '<word>',
				example: ['hello'],
			},
			args: [
				{
					id: 'word',
				},
			],
		});
	}

	async exec(message: Message, { word }: { word: string }) {
		if (!word)
			return message.channel.send(
				'> You need to give me a word to define',
			);
		// @ts-ignore
		const data = await ub.define(word, (error, results) => {
			if (error)
				return message.channel.send(
					`> I can't find any definition for \`${word}\``,
				);

			const res = results[0];

			const embed = this.client.util
				.embed()
				.setAuthor(
					message.author.username,
					message.author.displayAvatarURL({ dynamic: true }),
				)
				.setColor('RANDOM')
				.addField('Word', res.word)
				.addField('Definition', res.definition)
				.addField('Link', res.permalink)
				.addField('Sound', res.sound_urls[0])
				.addField('Author', res.author)
				.addField('Example', res.example)
				.setFooter(`👍 ${res.thumbs_up}   👎 ${res.thumbs_down}`);

			return message.channel.send(embed);
		});
	}
}
