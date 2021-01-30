import { Listener } from 'discord-akairo';

export default class Opened extends Listener {
	constructor() {
		super('mongo_open', {
			emitter: 'mongo',
			event: 'open',
		});
	}

	exec() {
		// @ts-ignore
		this.client.log.info(`MongoDB connection has been opened.`, 'database');
	}
}
