import { Listener } from 'discord-akairo';

export default class Ready extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
		});
	}

	exec() {
		this.client.music.init(this.client.user?.id);
		// @ts-ignore
		this.client.log.info(
			`Logged in as ${this.client.user?.username}`,
			'ready',
		);

		this.client.user?.setActivity(`${this.client.users.cache.size}`);
	}
}
