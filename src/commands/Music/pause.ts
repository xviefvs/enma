import { Command } from 'discord-akairo';

export default class PauseCommand extends Command {
	constructor() {
		super('pause', {
			description: {
				ctx: 'Pause the current playing music',
			},
		});
	}
}
