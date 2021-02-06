import { Message, TextChannel } from 'discord.js';
import { Listener } from 'discord-akairo';

export default class MessageEvent extends Listener {
	constructor() {
		super('message', {
			emitter: 'client',
			event: 'message',
		});
	}

	async exec(message: Message) {
		const words = await this.client.settings.get(
			message.guild!.id,
			'words',
			[],
		);
		if (words.includes(message.content.toLowerCase())) {
			message
				.reply('Oops, you just used a bad word')
				.then((msg) => msg.delete({ timeout: 3500 }));

			return message.deletable && message.delete({ timeout: 3500 });
		}
	}
}
