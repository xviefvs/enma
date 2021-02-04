import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class ClearQueue extends Command {
	constructor() {
		super('clear', {
			aliases: ['clear'],
			description: {
				ctx: 'Clear the current music queue.',
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

		player.queue.clear();

		return message.util!.send('> Cleared the music queue.');
	}
}
