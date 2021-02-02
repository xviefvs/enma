import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';

export default class LavalinkStats extends Command {
	constructor() {
		super('lavalink', {
			aliases: ['lavalink'],
			description: {
				ctx: '.',
			},
		});
	}
	async exec(message: Message) {
		const msg = await message.channel.send(`Getting lavalink stats...`);

		const {
			memory,
			cpu,
			uptime,
			frameStats,
			playingPlayers,
			players,
		} = this.client.music.nodes.first()!.stats;

		const allocated = Math.floor(memory.allocated / 1024 / 1024);
		const used = Math.floor(memory.used / 1024 / 1024);
		const free = Math.floor(memory.free / 1024 / 1024);
		const reservable = Math.floor(memory.reservable / 1024 / 1024);

		const systemLoad = (cpu.systemLoad * 100).toFixed(2);
		const lavalinkLoad = (cpu.lavalinkLoad * 100).toFixed(2);

		const botUptime = this.uptime(uptime);

		const embed = new MessageEmbed()
			.setAuthor('Lavalink Statistics')
			.setColor(message.guild!.me!.displayHexColor ?? 'BLURPLE')
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
			.addField('**❯ Uptime**', `\`\`\`${botUptime}\`\`\``)
			.setTimestamp(Date.now());

		if (frameStats) {
			const { sent, deficit, nulled } = frameStats;
			embed.addField(
				'**❯ Frame Stats**',
				`\`\`\`Sent: ${sent}\nDeficit: ${deficit}\nNulled: ${nulled}\`\`\``,
			);
		}
		return msg.edit('', embed);
	}

	uptime(time: number) {
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
