import { stripIndents } from 'common-tags';
import { Message, User } from 'discord.js';
import { Command } from 'discord-akairo';

export default class AvatarCommand extends Command {
	constructor() {
		super('avatar', {
			aliases: ['avatar', 'pfp', 'av'],
			description: {
				ctx: 'Get a user avatar.',
				usage: '[user]',
				example: ['@tomc#7817'],
			},
			args: [
				{
					id: 'user',
					type: 'user',
				},
			],
		});
	}

	exec(message: Message, { user }: { user: User }) {
		if (!user) user = message.author;

		const png = user.displayAvatarURL({ format: 'png' });
		const jpeg = user.displayAvatarURL({ format: 'jpeg' });
		const jpg = user.displayAvatarURL({ format: 'jpg' });
		const webp = user.displayAvatarURL({ format: 'webp' });
		const dynamic = user.displayAvatarURL({ dynamic: true, size: 4096 });

		const embed = this.client.util
			.embed()
			.setColor(
				message.guild!.members.cache.get(user.id!)?.displayHexColor!,
			)
			.setDescription(
				stripIndents`
                **${user.username}'s avatar**
                **[png](${png})** **[jpeg](${jpeg})** **[jpg](${jpg})** **[webp](${webp})**`,
			)
			.setImage(dynamic)
			.setTimestamp();

		message.channel.send(embed);
	}
}
