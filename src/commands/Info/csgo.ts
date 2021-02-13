import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class Csgo extends Command {
	constructor() {
		super('csgo', {
			aliases: ['csgoinfo', 'csgo'],
			description: {
				ctx: 'Get info about a csgo player',
				usage: '<steamID/steamCommunityURL/steamVanityUsername>',
				example: ['officials1mple'],
			},
			args: [
				{
					id: 'steam',
				},
			],
		});
	}

	async exec(message: Message, { steam }: { steam: string }) {
		if (!steam)
			return message.channel.send(
				'> You need to give me a steam id or steam link or steam username to search.',
			);

		await this.client
			.fetch(
				`https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${steam}`,
				{
					headers: {
						'TRN-Api-Key': process.env.track_gg!,
						'User-Agent': `Enma`,
					},
				},
			)
			.then((res) => res.json())
			.then((json) => {
				if (json.errors)
					return message.channel.send(`> ${json.errors[0].message}`);
				const data = json.data;
				const stats = data.segments[0].stats;
				const embed = this.client.util
					.embed()
					.setAuthor(data.platformInfo.platformUserHandle)
					.setThumbnail(data.platformInfo.avatarUrl)
					.setColor('BLURPLE')
					.addField('Statistics', [
						`**❯ Country Code:** ${
							data.userInfo.countryCode
								? data.userInfo.countryCode
								: 'No'
						}`,
						`**❯ Profile Viewed:** ${
							data.pageviews ? data.pageviews : 0
						}`,
						`**❯ Is Suspicious:** ${
							data.isSuspicious ? 'Yes' : 'No'
						}`,
						`**❯ Time Played:** ${
							stats.timePlayed
								? stats.timePlayed.displayValue
								: '0 Hour'
						}`,
						`**❯ Total Scores:** ${
							stats.score ? stats.score.displayValue : '0'
						}`,
						`**❯ Kills:** ${
							stats.kills.displayValue
								? stats.kills.displayValue
								: '0'
						}`,
						`**❯ Deaths:** ${
							stats.deaths.displayValue
								? stats.deaths.displayValue
								: '0'
						}`,
						`**❯ KD:** ${
							stats.kd.displayValue ? stats.kd.displayValue : '0'
						}`,
						`**❯ Damage:** ${
							stats.damage.displayValue
								? stats.damage.displayValue
								: '0'
						}`,
						`**❯ Headshot:** ${
							stats.headshots.displayValue
								? stats.headshots.displayValue
								: '0'
						}`,
						`**❯ KD:** ${
							stats.kd.displayValue ? stats.kd.displayValue : '0'
						}`,
						`**❯ Dominations:** ${
							stats.dominations.displayValue
								? stats.dominations.displayValue
								: '0'
						}`,
						`**❯ Shots Fired:** ${
							stats.shotsFired.displayValue
								? stats.shotsFired.displayValue
								: '0'
						}`,
						`**❯ Shots Hit:** ${
							stats.shotsHit.displayValue
								? stats.shotsHit.displayValue
								: '0'
						}`,
						`**❯ Shots Accuracy:** ${
							stats.shotsAccuracy.displayValue
								? stats.shotsAccuracy.displayValue
								: '0'
						}`,
						`**❯ Snipers Killed:** ${
							stats.snipersKilled.displayValue
								? stats.snipersKilled.displayValue
								: '0'
						}`,
						`**❯ Domination Overkills:** ${
							stats.dominationOverkills.displayValue
								? stats.dominationOverkills.displayValue
								: '0'
						}`,
						`**❯ Domination Revenges:** ${
							stats.dominationRevenges.displayValue
								? stats.dominationRevenges.displayValue
								: '0'
						}`,
						`**❯ Bombs Planted:** ${
							stats.bombsPlanted.displayValue
								? stats.bombsPlanted.displayValue
								: '0'
						}`,
						`**❯ Bombs Defused:** ${
							stats.bombsDefused.displayValue
								? stats.bombsDefused.displayValue
								: '0'
						}`,
						`**❯ Money Earned:** ${
							stats.moneyEarned.displayValue
								? stats.moneyEarned.displayValue
								: '0'
						}`,
						`**❯ Hostages Rescued:** ${
							stats.hostagesRescued.displayValue
								? stats.hostagesRescued.displayValue
								: '0'
						}`,
						`**❯ MVP:** ${
							stats.mvp.displayValue
								? stats.mvp.displayValue
								: '0'
						}`,
						`**❯ Wins:** ${
							stats.wins.displayValue
								? stats.wins.displayValue
								: '0'
						}`,
						`**❯ Ties:** ${
							stats.ties.displayValue
								? stats.ties.displayValue
								: '0'
						}`,
						`**❯ Matches Played:** ${
							stats.matchesPlayed.displayValue
								? stats.matchesPlayed.displayValue
								: '0'
						}`,
						`**❯ Losses:** ${
							stats.losses.displayValue
								? stats.losses.displayValue
								: '0'
						}`,
						`**❯ Rounds Played:** ${
							stats.roundsPlayed.displayValue
								? stats.roundsPlayed.displayValue
								: '0'
						}`,
						`**❯ Rounds Won:** ${
							stats.roundsWon.displayValue
								? stats.roundsWon.displayValue
								: '0'
						}`,
						`**❯ Rounds Won:** ${
							stats.roundsWon.displayValue
								? stats.roundsWon.displayValue
								: '0'
						}`,
						`**❯ W/L Percentage:** ${
							stats.wlPercentage.displayValue
								? stats.wlPercentage.displayValue
								: '0'
						}`,
						`**❯ Headshot Percentage:** ${
							stats.headshotPct.displayValue
								? stats.headshotPct.displayValue
								: '0'
						}`,
						'\u200b',
					]);
				return message.channel.send(embed);
			});
	}
}
