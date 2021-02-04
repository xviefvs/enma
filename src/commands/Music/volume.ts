import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class VolumeCommand extends Command {
	constructor() {
		super('volume', {
			aliases: ['volume', 'v'],
			description: {
				ctx: 'Set the volume of a song.',
				usage: '<volume>',
				example: ['100'],
			},
			args: [
				{
					id: 'volume',
				},
			],
		});
	}

	exec(message: Message, { volume }: { volume: number }) {
		const player = this.client.music.players.get(message.guild?.id!);
		const channel = message.member?.voice.channel;
		const bot = message.guild?.me?.voice.channel;

		if (!channel)
			return message.util?.send(
				'> You need to be in a voice channel to use this command.',
			);

		if (channel.id !== bot?.id)
			return message.util?.send(
				'> You need to be in the same voice channel as mine to use this command.',
			);

		if (!player)
			return message.util?.send('> There is no music playing to skip.');

		if (!volume || isNaN(volume) || volume < 0 || volume > 200)
			return message.channel.send(
				'> You need to give me a number from 1-200',
			);

		player.setVolume(volume);
		return message.channel.send(
			`> Successfully set the volume to \`${volume}%\``,
		);
	}
}
