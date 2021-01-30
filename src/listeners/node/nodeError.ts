import { Listener } from 'discord-akairo';
import { Node } from 'erela.js';

export default class NodeError extends Listener {
	constructor() {
		super('nodeError', {
			emitter: 'music',
			event: 'nodeError',
		});
	}

	exec(node: Node, error: any) {
		console.log(error);
	}
}
