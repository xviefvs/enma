import { Node } from 'erela.js';
import { Listener } from 'discord-akairo';

export default class NodeReconnect extends Listener {
	constructor() {
		super('nodeReconnect', {
			emitter: 'music',
			event: 'nodeReconnect',
		});
	}

	exec(node: Node) {
		this.client.log.info(
			`Node ${node.options.identifier} has reconnected`,
			'lavalink',
		);
	}
}
