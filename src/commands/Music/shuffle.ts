import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class ShuffleCommand extends Command {
	constructor() {
		super('shuffle', {
			aliases: ['shuffle'],
			description: {
				ctx: 'Shuffle the music queue.',
			},
		});
	}

	exec(message: Message) {
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

		player.queue.shuffle();
		return message.util!.send('> Shuffled the queue.');
	}
}
