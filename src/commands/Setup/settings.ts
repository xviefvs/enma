import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import guilds from '../../models/guilds';

export default class SettingsCommand extends Command {
	constructor() {
		super('settings', {
			aliases: ['settings', 'setup'],
			description: {
				ctx: 'Change settings for your guild.',
				usage: '<option> <input>',
				example: ['prefix ?'],
			},
			userPermissions: ['MANAGE_GUILD'],
			args: [
				{
					id: 'option',
				},
				{
					id: 'input',
				},
			],
		});
	}

	async exec(
		message: Message,
		{ option, input }: { option: string; input: any },
	) {
		const data = await this.client.db.getDoc(message.guild?.id!);
		switch (option) {
			case 'prefix':
				if (!input)
					return message.util?.send(
						'> You need to give me a prefix to change.',
					);

				if (input.length > 5)
					return message.util?.send(
						'> The prefix can only be 5 or less characters.',
					);

				await this.client.settings.set(
					message.guild?.id!,
					'prefix',
					input.replace(/_/g, ' '),
				);
				return message.util?.send(
					this.client.util
						.embed()
						.setAuthor(
							message.author.username,
							message.author.displayAvatarURL({ dynamic: true }),
						)
						.setColor(message.guild?.me?.displayHexColor!)
						.setDescription(
							`Successfully updated new prefix to: ${input}`,
						)
						.setTimestamp(),
				);
				break;

			case 'blacklistword':
				if (!input)
					return message.util?.send(
						'> You need to give me a word to blacklist.',
					);
				if (data.words.includes(input))
					return message.util?.send(
						'> That word is already in blacklisted words list.',
					);

				await this.client.db.updateDoc(message.guild?.id!, {
					words: [...data.words, input],
				});

				message.util?.send('> Updated the blacklisted words list.');
				break;
			default:
				message.util?.send(
					this.client.util
						.embed()
						.setColor('BLURPLE')
						.setDescription('Available options')
						.addField(
							'prefix',
							'Set the new prefix for the current guild.',
						),
				);
		}
	}
}
