import { Listener } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';

class VoiceStateUpdate extends Listener {
	constructor() {
		super('voiceStateUpdate', {
			emitter: 'client',
			event: 'voiceStateUpdate',
		});
	}

	async exec(oldVoice: any, newVoice: any) {
		const player = this.client.music.get(oldVoice.guild.id);
		if (!player) return;

		if (
			!newVoice.guild.members.cache.get(this.client.user!.id).voice
				.channelID
		)
			player.destroy();
		if (oldVoice.id === this.client.user!.id) return;
		if (
			!oldVoice.guild.members.cache.get(this.client.user!.id).voice
				.channelID
		)
			return;
		if (
			oldVoice.guild.members.cache.get(this.client.user!.id).voice.channel
				.id === oldVoice.channelID
		) {
			if (
				oldVoice.guild.voice.channel &&
				oldVoice.guild.voice.channel.members.size === 1
			) {
				const vcName = oldVoice.guild.me.voice.channel.name;
				const embed = this.client.util
					.embed()
					.setDescription(
						`Im leaving the voice channel in 2 minutes because i was left alone.`,
					)
					.setColor('RANDOM');
				const channel = this.client.channels.cache.get(
					player.textChannel!,
				) as TextChannel;
				const msg = await channel.send(embed);
				const delay = (ms: number) =>
					new Promise((res) => setTimeout(res, ms));
				await delay(120000);
				const vcMembers = oldVoice.guild.voice.channel.members.size;
				if (!vcMembers || vcMembers === 1) {
					const newPlayer = this.client.music.get(newVoice.guild.id);
					if (newPlayer) {
						player.destroy();
					} else {
						oldVoice.guild.voice.channel.leave();
					}
					const embed2 = this.client.util
						.embed()
						.setDescription(
							`> I have left the voice channel due to inactivity.`,
						)
						.setColor('RANDOM');
					return msg.edit(embed2);
				} else {
					return msg.delete();
				}
			}
		}
	}
}
