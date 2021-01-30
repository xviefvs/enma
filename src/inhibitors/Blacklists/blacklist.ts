import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

export default class BlacklistInhibitor extends Inhibitor {
	constructor() {
		super('blacklist', {
			reason: 'blacklist',
		});
	}

	exec(message: Message) {
		const blacklist: Array<string> = [];
		return blacklist.includes(message.author.id);
	}
}
