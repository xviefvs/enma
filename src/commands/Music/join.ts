import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class JoinCommand extends Command {
	constructor() {
		super('join', {
			aliases: ['join', 'connect', 'summon'],
			description: {
				ctx: 'Make the bot join a voice channel.',
			},
			clientPermissions: ['CONNECT'],
		});
	}

	exec(message: Message) {
		let player = this.client.music.players.get(message.guild!.id);

		const channel = message.member?.voice.channel;

		if (player)
			return message.util!.send('> I am already in a voice channel.');

		if (!channel)
			return message.util?.send(
				'> You need to be in a voice channel to use this command.',
			);

		player = this.client.music.create({
			guild: message.guild!.id,
			textChannel: message.channel.id,
			voiceChannel: channel.id,
			selfDeafen: true,
			volume: 85,
		});

		player.connect();

		return message.util!.send(`Joined **${channel.name}**`);
	}
}
