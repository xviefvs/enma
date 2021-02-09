import { Listener } from 'discord-akairo';
import { Node } from 'erela.js';

export default class NodeConnect extends Listener {
	constructor() {
		super('nodeConnect', {
			emitter: 'music',
			event: 'nodeConnect',
		});
	}

	exec(node: Node) {
		this.client.log.info(
			`Connected to ${node.options.identifier}`,
			'lavalink',
		);
	}
}
