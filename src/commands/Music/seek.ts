import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import moment from 'moment';
import 'moment-duration-format';

export default class SeekCommand extends Command {
	constructor() {
		super('seek', {
			aliases: ['seek'],
			description: {
				ctx: 'Seek to a timestamp of current playing song.',
				usage: '<seconds>',
				example: ['60', '120', '180'],
			},
			args: [
				{
					id: 'to',
					type: 'number',
				},
			],
		});
	}

	exec(message: Message, { to }: { to: number }) {
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

		if (player.paused) return message.util?.send('> The music is paused.');

		if (!player.queue!.current!.isSeekable) {
			return message.util!.send("> You can't seek a livestream.");
		}

		if (to * 1000 > player.queue.current?.duration!)
			return message.channel.send(
				"> You can't seek over the song duration.",
			);

		player.seek(to * 1000);

		return message.channel.send(
			`> Seeked to \`${moment
				.duration(to * 1000, 'milliseconds')
				.format('mm:ss')}\``,
		);
	}
}
