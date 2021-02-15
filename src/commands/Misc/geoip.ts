import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class GeoIP extends Command {
	constructor() {
		super('geoip', {
			aliases: ['geoip'],
			args: [
				{
					id: 'ip',
				},
			],
		});
	}

	async exec(message: Message, { ip }: { ip: string }) {
		if (!ip) return;

		const data = await this.client.ksoft.kumo.geoip(ip);
		const { location, map } = data;
		const { address, lat, lon } = location;

		message.channel.send(
			stripIndents`
        Address: ${address} 
        Latitude: ${lat} 
        Longitude: ${lon} 
        Map: ${map}`,
			{ code: true },
		);
	}
}
