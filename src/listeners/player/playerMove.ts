import { Player } from 'erela.js';
import { Listener } from 'discord-akairo';
import { VoiceChannel } from 'discord.js';

export default class PlayerMove extends Listener {
	constructor() {
		super('playerMove', {
			emitter: 'music',
			event: 'playerMove',
		});
	}

	exec(player: Player, oldChannel: string, newChannel: string) {
		if (!newChannel) return player.destroy();
		player.setVoiceChannel(newChannel);
	}
}
