import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Previous extends Command {
	constructor() {
		super('previous', {
			aliases: ['previous', 'prev'],
			description: {
				ctx: 'Replay the previous song.',
			},
		});
	}

	exec(message: Message) {
		const player = this.client.music.players.get(message.guild?.id!);

		const channel = message.member?.voice.channel;

		const bot = message.guild?.me?.voice.channel;

		if (!channel)
			message.util?.send(
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

		const previousSong = player.queue.previous;

		if (!previousSong)
			return message.util?.send('> There is no previous song.');

		player.queue.unshift(previousSong);
		player.stop();
	}
}
