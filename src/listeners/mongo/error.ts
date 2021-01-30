import { Listener } from 'discord-akairo';

export default class Opened extends Listener {
	constructor() {
		super('mongo_error', {
			emitter: 'mongo',
			event: 'error',
		});
	}

	exec(error: any) {
		// @ts-ignore
		this.client.log.error(`MongoDB error: ${error}`, 'database');
	}
}
