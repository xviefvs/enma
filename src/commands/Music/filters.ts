import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import filters from '../../utils/filters';

export default class NightcoreCommand extends Command {
	constructor() {
		super('filter', {
			aliases: ['filter'],
			description: {
				ctx: 'Enable filters for the current playing song.',
				usage: '<filter name> <on/off>',
				example: ['filter nightcore on'],
			},
			args: [
				{
					id: 'name',
				},
				{
					id: 'value',
					type: 'number',
				},
			],
		});
	}
	async exec(
		message: Message,
		{ name, value }: { name: string; value: string },
	) {
		const player = this.client.music.players.get(message.guild?.id!);

		const channel = message.member?.voice.channel;

		const bot = message.guild?.me?.voice.channel;

		if (!channel)
			return message.util?.send(
				'> You need to be in a voice channel to use this command.',
			);

		if (channel?.id !== bot?.id)
			return message.util?.send(
				'> You are not in the same voice channel as mine to use this command.',
			);

		if (!player)
			return message.util?.send(
				'> There is no music playing in the guild.',
			);

		if (!name)
			return message.util!.send(
				this.client.util
					.embed()
					.setColor('ORANGE')
					.setAuthor(
						message.author.username,
						message.author.displayAvatarURL({ dynamic: true }),
					)
					.setDescription(
						stripIndents`
                    Available filters (You can't stack up filters)
					nightcore
					bass
					treblebass
                    pitch
                    speed
					soft
					pop
					vaporwave
					clear-filter
					`,
					)
					.setTimestamp(),
			);

		switch (name) {
			case 'clear-filter':
			case 'clearfilter':
				player.node.send({
					op: 'filters',
					guildId: message.guild!.id,
				});
				message.util!.send('> Clearing filters...');
				await this.delay(4000);
				return message.util!.send(
					'Successfully cleared all the filters.',
				);
				break;
			case 'nightcore':
				player.node.send({
					op: 'filters',
					guildId: message.guild?.id,
					timescale: {
						rate: 1,
						speed: 1.3,
						pitch: 1.4,
					},
				});
				message.util!.send('> Adding **nightcore** filter...');
				await this.delay(4000);
				return message.util!.send(
					'> Successfully enabled **nightcore** filter.',
				);

				break;
			case 'vaporwave':
				player.node.send({
					op: 'filters',
					guildId: message.guild?.id!,
					equalizer: [
						{ band: 1, gain: 0.3 },
						{ band: 0, gain: 0.3 },
					],
					timescale: { pitch: 0.5 },
					tremolo: { depth: 0.3, frequency: 14 },
				});
				message.util!.send('> Adding **vaporwave** filter...');
				await this.delay(4000);
				return message.util!.send(
					'> Successfully enabled **vaporwave** filter.',
				);
				break;
			case 'soft':
				player.node.send({
					op: 'filters',
					guildId: message.guild?.id!,
					equalizer: [
						{ band: 0, gain: 0 },
						{ band: 1, gain: 0 },
						{ band: 2, gain: 0 },
						{ band: 3, gain: 0 },
						{ band: 4, gain: 0 },
						{ band: 5, gain: 0 },
						{ band: 6, gain: 0 },
						{ band: 7, gain: 0 },
						{ band: 8, gain: -0.25 },
						{ band: 9, gain: -0.25 },
						{ band: 10, gain: -0.25 },
						{ band: 11, gain: -0.25 },
						{ band: 12, gain: -0.25 },
						{ band: 13, gain: -0.25 },
					],
				});
				message.util!.send('> Adding **soft** filter...');
				await this.delay(4000);
				return message.util!.send(
					'> Successfully enabled **soft** filter.',
				);
				break;
			case 'treblebass':
				player.node.send({
					op: 'filters',
					guildId: message.guild?.id!,
					equalizer: [
						{ band: 0, gain: 0.6 },
						{ band: 1, gain: 0.67 },
						{ band: 2, gain: 0.67 },
						{ band: 3, gain: 0 },
						{ band: 4, gain: -0.5 },
						{ band: 5, gain: 0.15 },
						{ band: 6, gain: -0.45 },
						{ band: 7, gain: 0.23 },
						{ band: 8, gain: 0.35 },
						{ band: 9, gain: 0.45 },
						{ band: 10, gain: 0.55 },
						{ band: 11, gain: 0.6 },
						{ band: 12, gain: 0.55 },
						{ band: 13, gain: 0 },
					],
				});
				message.util!.send('> Adding **treblebass** filter...');
				await this.delay(4000);
				return message.util!.send(
					'Successfully enabled **treblebass** filter.',
				);
				break;
			case 'pop':
				player.node.send({
					op: 'filters',
					guildId: message.guild?.id!,
					equalizer: [
						{ band: 0, gain: 0.65 },
						{ band: 1, gain: 0.45 },
						{ band: 2, gain: -0.45 },
						{ band: 3, gain: -0.65 },
						{ band: 4, gain: -0.35 },
						{ band: 5, gain: 0.45 },
						{ band: 6, gain: 0.55 },
						{ band: 7, gain: 0.6 },
						{ band: 8, gain: 0.6 },
						{ band: 9, gain: 0.6 },
						{ band: 10, gain: 0 },
						{ band: 11, gain: 0 },
						{ band: 12, gain: 0 },
						{ band: 13, gain: 0 },
					],
				});
				message.util!.send('> Adding **pop** filter...');
				await this.delay(4000);
				return message.util!.send(
					'> Successfully enabled **pop** filter.',
				);
				break;
			case 'bass':
				player.node.send({
					op: 'filters',
					guildId: message.guild?.id!,
					equalizer: [
						{ band: 0, gain: 0.6 },
						{ band: 1, gain: 0.67 },
						{ band: 2, gain: 0.67 },
						{ band: 3, gain: 0 },
						{ band: 4, gain: -0.5 },
						{ band: 5, gain: 0.15 },
						{ band: 6, gain: -0.45 },
						{ band: 7, gain: 0.23 },
						{ band: 8, gain: 0.35 },
						{ band: 9, gain: 0.45 },
						{ band: 10, gain: 0.55 },
						{ band: 11, gain: 0.6 },
						{ band: 12, gain: 0.55 },
						{ band: 13, gain: 0 },
					],
				});
				message.util!.send('> Adding **bass** filter...');
				await this.delay(4000);
				return message.util!.send(
					'> Successfully enabled **bass** filter.',
				);
				break;
			case 'pitch':
				player.node.send({
					op: 'filters',
					guildId: message.guild!.id,
					timescale: { pitch: Number(value) },
				});
				message.util!.send('> Adding **pitch** filter...');
				await this.delay(4000);
				return message.util!.send(
					'> Successfully enabled **pitch** filter to ' + value,
				);
				break;
			case 'speed':
				player.node.send({
					op: 'filters',
					guildId: message.guild!.id,
					timescale: { speed: Number(value) },
				});
				message.util!.send('> Adding **speed** filter...');
				await this.delay(4000);
				return message.util!.send(
					'> Successfully enabled **speed** filter to ' + value,
				);
				break;
			default:
				return message.util!.send('> Invalid filter name.');
				break;
		}
	}

	private delay(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}
}
