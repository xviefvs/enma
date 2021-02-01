import Guild from '../models/guilds';

export default class Wrapper {
	private client: any;
	constructor(client: any) {
		this.client = client;
	}

	async addGuild(id: string) {
		const newDoc = new Guild({
			guildID: id,
		});

		return await newDoc
			.save()
			.catch((err) => this.client.log.error(err, 'database'));
	}

	async getDoc(id: string) {
		const guildDoc = await Guild.findOne({
			guildID: id,
		});

		if (!guildDoc) return await this.addGuild(id);

		return guildDoc;
	}

	async updateDoc(id: string, data: Object) {
		const updateDoc = await this.getDoc(id);

		if (!updateDoc) await this.addGuild(id);

		return await Guild.findOneAndUpdate(
			{
				guildID: id,
			},
			data,
		);
	}
}
