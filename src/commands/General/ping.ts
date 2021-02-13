import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class PingCommand extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping', 'pong'],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				ctx: 'Get the bot latency',
			},
		});
	}

	async exec(message: Message) {
		const sent = await message.util!.send('Pong!');
		const timeDiff = sent.createdTimestamp - message.createdTimestamp;

		const ws = this.client.ws.ping;

		const embed = this.client.util
			.embed()
			.setAuthor(
				this.client.user?.username,
				this.client.user?.displayAvatarURL(),
			)
			.setColor(message.guild?.me?.displayHexColor ?? 'BLURPLE')
			.addField('Websocket', `\`${ws}ms\``, true)
			.addField('Delay', `\`${timeDiff}ms\``, true);

		sent.edit(embed);
	}
}
