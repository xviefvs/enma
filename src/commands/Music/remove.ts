import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class removeQueue extends Command {
	constructor() {
		super('remove', {
			aliases: ['remove'],
			description: {
				ctx: 'Remove a song in the current music queue.',
				usage: '<index>',
				example: ['5'],
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
		if (player.queue.current === player.queue[index - 1])
			return message.util!.send(
				"> You can't remove the current playing song.",
			);
		await message.util!.send(
			`> Removed \`${player.queue[index - 1].title}\`.`,
		);
		player.queue.remove(index - 1);
	}
}
