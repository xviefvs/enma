import { Message, TextChannel } from 'discord.js';
import { Command } from 'discord-akairo';
import { inspect } from 'util';
import { Type } from '@anishshobith/deeptype';
import { exec } from 'child_process';

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
			case 'owner':
				if (!this.client.isOwner(message.author)) return;
				switch (input) {
					case 'reload':
						this.client.commandHandler.reloadAll();
						return message.channel.send('> ✔ Reloaded.');
						break;
					case 'eval':
					case 'ev':
						if (!ops) return;
						const msg = message,
							embed = this.client.util.embed();

						let code = ops
							.replace(/[“”]/g, '"')
							.replace(/[‘’]/g, "'");

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
							asyncTime =
								(asyncTime[0] * 1e9 + asyncTime[1]) / 1e6;
						}

						const info = [
							`**Time**: *${time}ms* ${
								asyncTime ? `(async *${asyncTime} ms*)` : ''
							}`,
						];

						if (evaluated) {
							info.push(
								`**Type**: \`\`\`ts\n${
									new Type(evaluated).is
								}\n\`\`\` `,
							);
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
								.addField(
									'Evaluated',
									` \`\`\`js\n${evaluated}\n\`\`\` `,
								)
								.addField('Information', info);

							return message.channel.send(embed);
						}

						embed
							.setDescription('No output.')
							.addField('Information', info);

						return message.channel.send(embed);
						break;
					case 'exec':
						exec(ops, (error, stdout) => {
							const response = error || stdout;
							message.channel.send(response, {
								code: true,
								split: true,
							});
						});
						break;
					case 'lavalink':
						const _msg = await message.channel.send(
							`Getting lavalink stats...`,
						);

						const {
							memory,
							cpu,
							uptime,
							frameStats,
							playingPlayers,
							players,
						} = this.client.music.nodes.first()!.stats;

						const allocated = Math.floor(
							memory.allocated / 1024 / 1024,
						);
						const used = Math.floor(memory.used / 1024 / 1024);
						const free = Math.floor(memory.free / 1024 / 1024);
						const reservable = Math.floor(
							memory.reservable / 1024 / 1024,
						);

						const systemLoad = (cpu.systemLoad * 100).toFixed(2);
						const lavalinkLoad = (cpu.lavalinkLoad * 100).toFixed(
							2,
						);

						const botUptime = this.uptime(uptime);

						const lava = this.client.util
							.embed()
							.setAuthor('Lavalink Statistics')
							.setColor(
								message.guild!.me!.displayHexColor ?? 'BLURPLE',
							)
							.setThumbnail(this.client.user!.displayAvatarURL())
							.addField(
								'**❯ Playing Players/Players**',
								`\`\`\`${playingPlayers} playing / ${players} players\`\`\``,
							)
							.addField(
								'**❯ Memory**',
								`\`\`\`Allocated: ${allocated} MB\n❯ Used: ${used} MB\nFree: ${free} MB\nReservable: ${reservable} MB\`\`\``,
							)
							.addField(
								'**❯ CPU**',
								`\`\`\`Cores: ${cpu.cores}\nSystem Load: ${systemLoad}%\nLavalink Load: ${lavalinkLoad}%\`\`\``,
							)
							.addField(
								'**❯ Uptime**',
								`\`\`\`${botUptime}\`\`\``,
							)
							.setTimestamp(Date.now());

						if (frameStats) {
							const { sent, deficit, nulled } = frameStats;
							lava.addField(
								'**❯ Frame Stats**',
								`\`\`\`Sent: ${sent}\nDeficit: ${deficit}\nNulled: ${nulled}\`\`\``,
							);
						}
						return _msg.edit('', lava);
						break;
				}
				break;
			case 'prefix':
			case 'set-prefix':
			case 'setprefix':
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
			default:
				message.util?.send(
					this.client.util
						.embed()
						.setColor('BLURPLE')
						.setDescription('Available options')
						.addField(
							'prefix',
							'Set the new prefix for the current guild.',
						),
				);
		}
	}

	private uptime(time: number) {
		const calculations = {
			week: Math.floor(time / (1000 * 60 * 60 * 24 * 7)),
			day: Math.floor(time / (1000 * 60 * 60 * 24)),
			hour: Math.floor((time / (1000 * 60 * 60)) % 24),
			minute: Math.floor((time / (1000 * 60)) % 60),
			second: Math.floor((time / 1000) % 60),
		};

		let str = '';

		for (const [key, val] of Object.entries(calculations)) {
			if (val > 0) str += `${val} ${key}${val > 1 ? 's' : ''} `;
		}

		return str;
	}
}
