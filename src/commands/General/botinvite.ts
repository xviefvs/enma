import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class BotInvite extends Command {
	constructor() {
		super('botinvite', {
			aliases: ['botinvite', 'botinv'],
			description: {
				ctx: 'Get the bot invite link.',
			},
		});
	}

	exec(message: Message) {
		message.util!.send(
			this.client.util
				.embed()
				.setColor(message.guild!.me!.displayHexColor)
				.setDescription(
					stripIndents`
            Click __**[Here](https://discord.com/api/oauth2/authorize?client_id=772690931539247104&permissions=37014592&scope=bot)**__ to invite me with basic permissions i need.
            Click __**[Here](https://discord.com/api/oauth2/authorize?client_id=772690931539247104&permissions=8&scope=bot)**__ for admin permission invite.
            `,
				)
				.setTimestamp(),
		);
	}
}
