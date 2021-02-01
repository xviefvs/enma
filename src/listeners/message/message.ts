import { Message } from 'discord.js';
import { Listener } from 'discord-akairo';

export default class MessageEvent extends Listener {
	constructor() {
		super('message', {
			emitter: 'client',
			event: 'message',
		});
	}

	async exec(message: Message) {
		const { words } = await this.client.db.getDoc(message.guild?.id!);
		if (words.icludes(message.content)) {
			message.util
				?.reply('Opps you just used a bad word')
				.then((msg) => msg.delete({ timeout: 2000 }));

			return message.deletable && message.delete({ timeout: 3000 });
		}
	}
}
