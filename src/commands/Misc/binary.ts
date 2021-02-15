import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Binary extends Command {
	constructor() {
		super('binary', {
			aliases: ['binary'],
			description: {
				ctx: 'Encode/Decode binary',
			},
			args: [
				{
					id: 'op',
					prompt: {
						start: 'What do you want to do `decode` or `encode` ?',
					},
				},
				{
					id: 'value',
					prompt: {
						start:
							'Now enter the text you want me to `encode/decode`',
					},
				},
			],
		});
	}

	async exec(message: Message, { op, value }: { op: string; value: string }) {
		if (op.toLowerCase() === 'encode') {
			const res = await (
				await this.client.fetch(
					`https://some-random-api.ml/binary?text=${encodeURIComponent(
						value,
					)}`,
				)
			).json();

			message.channel.send(
				this.client.util
					.embed()
					.setAuthor(
						message.author.username,
						message.author.displayAvatarURL({ dynamic: true }),
					)
					.setColor('BLURPLE')
					.setDescription('**❯ Action:** ENCODE')
					.addField('Base', value)
					.addField('Output', res.binary)
					.setTimestamp(),
			);
		} else if (op.toLowerCase() === 'decode') {
			const des = await (
				await this.client.fetch(
					`https://some-random-api.ml/binary?decode=${encodeURIComponent(
						value,
					)}`,
				)
			).json();

			message.channel.send(
				this.client.util
					.embed()
					.setAuthor(
						message.author.username,
						message.author.displayAvatarURL({ dynamic: true }),
					)
					.setColor('BLURPLE')
					.setDescription('**❯ Action:** DECODE')
					.addField('Base', value)
					.addField('Output', des.text)
					.setTimestamp(),
			);
		} else {
			return message.channel.send(
				'> Invalid option, available options: `encode` `decode`',
			);
		}
	}
}
