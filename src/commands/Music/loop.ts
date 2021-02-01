import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class LoopCommand extends Command {
	constructor() {
		super('loop', {
			aliases: ['loop', 'l'],
			description: {
				ctx: 'Loop the current playing track/queue.',
				usage: '[track/queue]',
				example: ['queue', 'track'],
			},
			args: [
				{
					id: 'type',
				},
			],
		});
	}

	exec(message: Message, { type }: { type: string }) {
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

		if (!type || type === 'track') {
			if (player.trackRepeat) {
				player.setTrackRepeat(false);
				return message.util?.send('> Track loop: **OFF**');
			}
			player.setTrackRepeat(true);
			return message.util?.send('> Track loop: **ON**');
		} else if (type === 'queue') {
			if (player.queueRepeat) {
				player.setQueueRepeat(false);
				return message.util!.send('> Queue loop: **OFF**');
			}
			player.setQueueRepeat(true);
			return message.util!.send('> Queue loop: **ON**');
		}
	}
}
