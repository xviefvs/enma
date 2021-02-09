import { Node } from 'erela.js';
import { Listener } from 'discord-akairo';

export default class NodeConnect extends Listener {
	constructor() {
		super('nodeDisconnect', {
			emitter: 'music',
			event: 'nodeDisconnect',
		});
	}

	exec(node: Node, reason: { code: number; reason: string }) {
		this.client.log.debug(
			`Node ${node.options.identifier} disconnected with reason: ${reason.reason}, code: ${reason.code}`,
			'lavalink',
		);
	}
}
