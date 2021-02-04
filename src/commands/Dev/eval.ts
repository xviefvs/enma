import { Message } from 'discord.js';
import { inspect } from 'util';
import { Type } from '@anishshobith/deeptype';
import { Command } from 'discord-akairo';

export default class EvalCommand extends Command {
	constructor() {
		super('eval', {
			ownerOnly: true,
			aliases: ['eval', 'ev'],
			args: [
				{
					id: 'id',
					match: 'content',
				},
			],
		});
	}

	async exec(message: Message, { id }: { id: string }) {
		if (!id) return;
		const msg = message,
			embed = this.client.util.embed();

		let code = id.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

		if (code.includes('await')) {
			code = `(async () => {${code}})()`;
		}

		let evaluated, time, asyncTime;
		try {
			const start = process.hrtime();

			evaluated = eval(code);
			if (evaluated instanceof Promise) {
				const _start = process.hrtime();
				evaluated = await evaluated;
				asyncTime = process.hrtime(_start);
			}

			time = process.hrtime(start);
		} catch (err) {
			embed
				.setColor('RED')
				.setDescription(
					`I ran into an error: \`\`\`js\n${err}\n\`\`\``,
				);

			return msg.channel.send(embed);
		}

		time = (time[0] * 1e9 + time[1]) / 1e6;
		if (asyncTime) {
			asyncTime = (asyncTime[0] * 1e9 + asyncTime[1]) / 1e6;
		}

		const info = [
			`**Time**: *${time}ms* ${
				asyncTime ? `(async *${asyncTime} ms*)` : ''
			}`,
		];

		if (evaluated) {
			info.push(`**Type**: \`\`\`ts\n${new Type(evaluated).is}\n\`\`\` `);
			if (typeof evaluated !== 'string') {
				evaluated = inspect(evaluated, {
					depth: 0,
				});
			}

			const esc = String.fromCharCode(8203);
			evaluated = evaluated
				.replace(/`/g, `\`${esc}`)
				.replace(/@/g, `@${esc}`)
				.replace(
					new RegExp(this.client.token!, 'gi'),
					'"**redacted**"',
				);

			/* corona!?!?! */
			if (evaluated.length >= 1000) {
				evaluated = evaluated.substr(0, 1000);
				evaluated += '...';
			}

			embed
				.addField('Evaluated', ` \`\`\`js\n${evaluated}\n\`\`\` `)
				.addField('Information', info);

			return message.channel.send(embed);
		}

		embed.setDescription('No output.').addField('Information', info);

		return message.channel.send(embed);
	}
}
