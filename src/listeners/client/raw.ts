import { Listener } from 'discord-akairo';
import { VoicePacket } from 'erela.js';

export default class RawEvent extends Listener {
	constructor() {
		super('raw', {
			emitter: 'client',
			event: 'raw',
		});
	}

	exec(d: VoicePacket) {
		this.client.music.updateVoiceState(d);
	}
}
