import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

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
				{
					id: 'ops',
				},
			],
		});
	}
	async exec(
		message: Message,
		{ option, input, ops }: { option: string; input: any; ops: any },
	) {
		const data = await this.client.settings.getDocument(message.guild!.id);

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
				switch (input) {
					case 'add':
						if (!ops)
							return message.util?.send(
								'> You need to give me a word to blacklist.',
							);
						const words = this.client.settings.get(
							message.guild!.id,
							'words',
							[],
						);
						if (words.includes(ops))
							return message.util?.send(
								'> That word is already in blacklisted words list.',
							);

						await this.client.settings.set(
							message.guild!.id,
							'words',
							[...words, ops.toLowerCase()],
						);

						message.util?.send(
							'> Updated the blacklisted words list.',
						);
						break;
					case 'remove':
						if (!ops)
							return message.util?.send(
								'> You need to give me a word to remove.',
							);
						const remove: string[] = this.client.settings.get(
							message.guild!.id,
							'words',
							[],
						);
						if (!remove.includes(ops.toLowerCase()))
							return message.util?.send(
								'> That word is already is not in blacklist words list.',
							);

						const filtered = remove.filter(
							(i) => i !== ops.toLowerCase(),
						);

						await this.client.settings.set(
							message.guild!.id,
							'words',
							[...filtered],
						);

						message.util?.send(
							'> Updated the blacklisted words list.',
						);
						break;
					case 'view':
						const views = this.client.settings.get(
							message.guild!.id,
							'words',
							null,
						);

						if (views.length)
							return message.util!.send(
								`\`\`\`js\n${views.join(', ')}\`\`\``,
							);

						return message.util!.send(
							'> There is no blacklisted words yet.',
						);
						break;
					default:
						return message.util!.send(
							this.client.util
								.embed()
								.setColor('RANDOM')
								.setDescription(
									'Available options: `add`, `remove`, `view`',
								),
						);
				}
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
						)
						.addField(
							'blacklistword',
							'Add or remove a word to blacklisted words.',
						),
				);
		}
	}
}
