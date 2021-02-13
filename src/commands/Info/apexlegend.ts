import { Message } from 'discord.js';
import { defaultCipherList } from 'constants';
import { Command } from 'discord-akairo';

export default class ApexLegend extends Command {
	constructor() {
		super('apexinfo', {
			aliases: ['apexinfo', 'apex'],
			description: {
				ctx: 'Get a apex legend userinfo (pc only)',
				usage: '<username>',
				example: ['XVIIIIIXM'],
			},
			args: [
				{
					id: 'username',
				},
			],
		});
	}

	async exec(message: Message, { username }: { username: string }) {
		if (!username)
			return message.channel.send(
				'> You need to give me a username to search.',
			);

		await this.client
			.fetch(
				`https://public-api.tracker.gg/v2/apex/standard/profile/origin/${encodeURIComponent(
					username,
				)}`,
				{
					headers: {
						'TRN-Api-Key': process.env.track_gg!,
						'User-Agent': `Enma`,
					},
				},
			)
			.then((res) => res.json())
			.then((json) => {
				const data = json.data;
				const filtered = data.segments.filter(
					(m: any) =>
						m.metadata.name.toLowerCase() ===
						data.metadata.activeLegendName.toLowerCase(),
				);
				const embed = this.client.util
					.embed()
					.setAuthor(
						`User ${data.platformInfo.platformUserId}`,
						data.platformInfo.avatarUrl,
					)
					.setColor('BLURPLE')
					.addField('Statistics', [
						`**❯ Country Code:** ${
							data.userInfo.countryCode
								? data.userInfo.countryCode
								: 'None'
						}`,
						`**❯ Social Account:** ${
							data.userInfo.socialAccounts.length
								? data.userInfo.socialAccounts
										.map(
											(m: any) =>
												`${m.platformSlug}: ${m.platformUserHandle}`,
										)
										.join('\n')
								: 'No'
						}`,
						`**❯ Profile Viewed:** ${
							data.pageviews ? data.pageviews : 0
						}`,
						`**❯ Is Suspicious:** ${
							data.isSuspicious ? 'Yes' : 'No'
						}`,
						`**❯ Displaying Legend:** ${
							data.metadata.activeLegendName
								? data.metadata.activeLegendName
								: 'None'
						}`,
						`**❯ Is Active:** ${
							filtered[0].metadata.isActive ? 'Yes' : 'No'
						}`,
						`**❯ Rank:** ${
							filtered[0].stats.kills.rank
								? filtered[0].stats.kills.rank
								: 'Unranked'
						}`,
						`**❯ Kills:** ${filtered[0].stats.kills.value}`,
						'\u200b',
					])
					.setImage(filtered[0].metadata.bgImageUrl)
					.setTimestamp();
				return message.channel.send(embed);
			})
			.catch((err) =>
				message.channel.send(
					`> I can't find any user named: \`${username}\``,
				),
			);
	}
}
