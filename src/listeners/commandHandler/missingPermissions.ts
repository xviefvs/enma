import { Message, User, PermissionString } from 'discord.js';
import { Command, Listener } from 'discord-akairo';
import EnmaClient from '../../client/EnmaClient';

declare namespace Intl {
	class ListFormat {
		public format: (items: string[]) => string;
	}
}

export default class missingPerms extends Listener {
	public constructor() {
		super('missingPermissions', {
			emitter: 'commandHandler',
			event: 'missingPermissions',
		});
	}

	public exec(
		message: Message,
		command: Command,
		type: 'client' | 'user',
		missing: PermissionString[],
	) {
		const formatted = this.formatArray(missing.map(this.formatPerms));
		if (type === 'user') {
			return message.util!.reply(
				`You are missing \`${formatted}\` permissions, you need them to use this command!`,
			);
		}

		message.util!.reply(
			`I am missing \`${formatted}\` permissions, I need them to run this command!`,
		);
	}

	private formatArray(array: string[], type = 'conjunction') {
		// @ts-ignore
		return new Intl.ListFormat('en-GB', {
			style: 'short',
			type: type,
		}).format(array);
	}

	private formatPerms(perm: string) {
		return perm
			.toLowerCase()
			.replace(/(^|"|_)(\S)/g, (str: string) => str.toUpperCase())
			.replace(/_/g, ' ')
			.replace(/Guild/g, 'Server')
			.replace(/Use Vad/g, 'Use Voice Acitvity');
	}
}
