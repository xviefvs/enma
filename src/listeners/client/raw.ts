import { Listener } from 'discord-akairo';

export default class RawEvent extends Listener {
	constructor() {
		super('raw', {
			emitter: 'client',
			event: 'raw',
		});
	}

	exec(d: any) {
		this.client.music.updateVoiceState(d);
	}
}
