import { Listener } from 'discord-akairo';
import { Message, MessageEmbed, VoiceState, TextChannel } from 'discord.js';
class VoiceStateUpdate extends Listener {
	constructor() {
		super('voiceStateUpdate', {
			emitter: 'client',
			event: 'voiceStateUpdate',
		});
	}

	async exec(oldVoice: VoiceState, newVoice: VoiceState) {
		const player = this.client.music.players.get(oldVoice.guild.id);

		if (!player) return;
		if (
			!newVoice.guild?.members?.cache.get(this.client.user!.id)!.voice
				.channelID
		)
			player.destroy();
		if (oldVoice.id === this.client.user!.id) return;
		if (
			!oldVoice.guild.members.cache.get(this.client.user!.id)!.voice
				.channelID
		)
			return;
		if (
			oldVoice.guild.members?.cache.get(this.client.user!.id)!.voice
				.channel!.id === oldVoice.channelID!
		) {
			if (
				oldVoice.guild.voice!.channel &&
				oldVoice.guild.voice!.channel.members.size === 1
			) {
				const vcName = oldVoice.guild.me!.voice.channel!.name;
				const delay = (ms: number) =>
					new Promise((res) => setTimeout(res, ms));
				await delay(300000);

				const vcMembers = oldVoice.guild.voice!.channel.members.size;
				if (!vcMembers || vcMembers === 1) {
					const newPlayer = this.client.music.players.get(
						newVoice.guild.id,
					);
					if (newPlayer) {
						player.destroy();
					} else {
						oldVoice.guild.voice!.channel.leave();
					}

					const channel = this.client.channels.cache.get(
						player.textChannel!,
					) as TextChannel;
					const embed2 = new MessageEmbed()
						.setDescription(
							`I left **${vcName}** because I was left alone.`,
						)
						.setColor('ORANGE');
					const msg = await channel.send(embed2);
				} else {
					return;
				}
			}
		}
	}
}
