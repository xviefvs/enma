import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class LeaveCommand extends Command {
	constructor() {
		super('leave', {
			aliases: ['leave', 'disconnect', 'dc', 'fuckoff'],
			description: {
				ctx: 'Make the bot leave the voice channel',
			},
		});
	}

	exec(message: Message) {
		const player = this.client.music.players.get(message.guild!.id);

		if (!player)
			return message.util!.send(
				'> I need to be in a voice channel for you to use this command.',
			);

		const user = message.member!.voice.channel;

		const bot = message.guild!.me?.voice.channel;

		if (!user)
			return message.util!.send(
				'> You need to be in a voice channel to use this command.',
			);

		if (bot!.id !== user.id)
			return message.util!.send(
				'> You need to be in the same voice channel as mine to use this command.',
			);

		player.destroy();

		return message.util!.send(`Left **${user.name}**`);
	}
}
