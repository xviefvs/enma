import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class SkipTo extends Command {
	constructor() {
		super('skipto', {
			aliases: ['skipto', 'st'],
			description: {
				ctx: 'Skip to a specific index in the music queue.',
				usage: '<index>',
				example: ['10'],
			},
			args: [
				{
					id: 'index',
					type: 'number',
				},
			],
		});
	}

	async exec(message: Message, { index }: { index: number }) {
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

		player.stop(index);

		message.channel.send(`> Skipped to ${player.queue.current!.title}`);
	}
}
