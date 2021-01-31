import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class SkipCommand extends Command {
	constructor() {
		super('skip', {
			aliases: ['skip', 's'],
			description: {
				ctx: 'Skip the current playing song.',
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

		if (channel.id !== bot?.id)
			return message.util?.send(
				'> You need to be in the same voice channel as mine to use this command.',
			);

		if (!player)
			return message.util?.send('> There is no music playing to skip.');

		message.util?.send(
			this.client.util
				.embed()
				.setColor(message.member?.displayHexColor ?? 'BLURPLE')
				.setDescription(`Skipped ${player.queue.current?.title}`),
		);
		player.stop();
	}
}
