import { Listener } from 'discord-akairo';

export default class Error extends Listener {
	constructor() {
		super('mongo_error', {
			emitter: 'mongo',
			event: 'error',
		});
	}

	exec(error: Error) {
		// @ts-ignore
		this.client.log.error(`MongoDB error: ${error}`, 'database');
	}
}
