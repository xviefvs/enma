import moment from 'moment';
import { Command } from 'discord-akairo';
import { MessageEmbed, Message, Role, UserFlags } from 'discord.js';

const flags = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	DISCORD_PARTNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery',
	HOUSE_BRILLIANCE: 'House of Brilliance',
	HOUSE_BALANCE: 'House of Balance',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer',
};

export default class extends Command {
	constructor() {
		super('userinfo', {
			aliases: ['user', 'ui'],
			description: {
				ctx:
					'Displays information about a provided user or the message author.',
				usage: '[user]',
				example: ['@Tomc#7817'],
			},
			args: [
				{
					id: 'target',
				},
			],
		});
	}

	async exec(message: Message, { target }: { target: string }) {
		const member =
				message.mentions.members?.last() ||
				message.guild?.members?.cache.get(target) ||
				message.member,
			roles = member?.roles.cache
				.sort((a, b) => b.position - a.position)
				.map((role: Role) => role.toString())
				.slice(0, -1);

		const userFlags = member?.user?.flags?.toArray();
		const embed = new MessageEmbed()
			.setThumbnail(
				member?.user.displayAvatarURL({ dynamic: true, size: 512 })!,
			)
			.setColor(member?.displayHexColor || 'BLUE')
			.addField('User', [
				`**❯ Username:** ${member?.user.username}`,
				`**❯ Discriminator:** ${member?.user.discriminator}`,
				`**❯ ID:** ${member?.id}`,
				`**❯ Flags:** ${
					userFlags?.length
						? userFlags!
								.map((flag) => {
									// @ts-ignore
									flags[flag];
								})
								.join(', ')
						: 'None'
				}`,
				`**❯ Avatar:** [Link to avatar](${member?.user.displayAvatarURL(
					{
						dynamic: true,
					},
				)})`,
				`**❯ Time Created:** ${moment(
					member?.user.createdTimestamp,
				).format('LT')} ${moment(member?.user.createdTimestamp).format(
					'LL',
				)} ${moment(member?.user.createdTimestamp).fromNow()}`,
				`**❯ Status:** ${member?.user.presence.status}`,
				`**❯ Game:** ${
					member?.user.presence.activities[0] || 'Not playing a game.'
				}`,
				'\u200b',
			])
			.addField('member?', [
				`**❯ Highest Role:** ${
					member?.roles.highest.id === message.guild?.id
						? 'None'
						: member?.roles.highest.name
				}`,
				`**❯ Server Join Date:** ${moment(member?.joinedAt).format(
					'LL LTS',
				)}`,
				`**❯ Hoist Role:** ${
					member?.roles.hoist ? member?.roles.hoist.name : 'None'
				}`,
				`**❯ Roles [${roles?.length}]:** ${
					roles?.length! < 10
						? roles?.join(', ')
						: roles?.length! > 10
						? this.trimArray(roles)
						: 'None'
				}`,
				'\u200b',
			]);

		return message.channel.send(embed);
	}

	private trimArray(arr: any, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}
}
