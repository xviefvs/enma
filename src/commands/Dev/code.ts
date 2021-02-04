import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import fs from 'fs';

export default class CodeCommand extends Command {
	constructor() {
		super('code', {
			aliases: ['code'],
			ownerOnly: true,
			args: [
				{
					id: 'module',
				},
				{
					id: 'cmd',
				},
			],
		});
	}

	exec(message: Message, { module, cmd }: { module: string; cmd: string }) {
		if (!module)
			return message.util!.send('https://github.com/xviefvs/enma');
		let code;

		try {
			code = fs
				.readFileSync(
					`${process.cwd()}/src/commands/${module}/${cmd}.ts`,
				)
				.toString();
		} catch (error) {
			return message.channel.send(
				`I couldn't find any modules/commands with that name`,
			);
		}

		try {
			if (cmd) {
				message.channel.send(
					`Here is the code for the ${cmd} command:\n\`\`\`js\n${code.substr(
						0,
						1900,
					)}\`\`\``,
				);
			}
		} catch (e) {
			return message.channel.send(
				"There was an error displaying the command's code.",
			);
		}
	}
}
