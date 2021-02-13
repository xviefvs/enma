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

		this.client.log.info(
			`Logged in as ${this.client.user?.username}`,
			'ready',
		);
		this.client.log.info(
			`Loaded ${this.client.commandHandler.modules.size} commands`,
			'command',
		);
		this.client.log.info(
			`Loaded ${this.client.listenerHandler.modules.size} listeners`,
			'listener',
		);

		this.client.log.info(
			`Loaded ${this.client.inhibitorHandler.modules.size} inhibitors`,
			'inhibitor',
		);

		this.client.user?.setActivity(`Spotify`, {
			type: 'LISTENING',
		});
	}
}
