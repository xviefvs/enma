import { stripIndents } from 'common-tags';
import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class QueueCommand extends Command {
	constructor() {
		super('queue', {
			aliases: ['queue', 'q'],
			clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
			description: {
				ctx: 'Show the song queue for current guild.',
			},
		});
	}

	exec(message: Message) {
		const player = this.client.music.players.get(message.guild!.id);

		if (!player)
			return message.util?.send(
				'> There is no music playing in the guild.',
			);

		const queue = player.queue;
		const generateEmbed = (start: number) => {
			const current = queue.slice(start, start + 20);
			var page = 0;
			const embed = this.client.util
				.embed()
				.setColor(message.guild?.me?.displayHexColor ?? 'BLURPLE')
				.setAuthor(
					`Queue for ${message.guild?.name}`,
					message.guild?.iconURL({ dynamic: true })!,
				)
				.setFooter(
					`Showing track ${start + 1}-${
						start + current.length
					} out of ${queue.length} tracks`,
				);

			const mapped = current.map(
				(track, i) =>
					`**${start + (i + 1)}.** [${track.title}](${track.uri})`,
			);
			embed.setDescription(mapped.join('\n\n'));

			if (queue.current)
				embed.addField(
					'\nCurrently Playing 🎶',
					`[${queue.current.title}](${queue.current.uri})`,
				);
			return embed;
		};

		const author = message.author;

		message.channel.send(generateEmbed(0)).then((message) => {
			if (queue.length <= 20) return;
			try {
				message.react('➡️');
				const collector = message.createReactionCollector(
					(reaction, user) =>
						['⬅️', '➡️'].includes(reaction.emoji.name) &&
						user.id === author.id,
					// time out after a minute
					{ time: 60000 },
				);

				let currentIndex = 0;
				collector.on('collect', (reaction) => {
					// remove the existing reactions
					message.reactions.removeAll().then(async () => {
						// increase/decrease index
						reaction.emoji.name === '⬅️'
							? (currentIndex -= 20)
							: (currentIndex += 20);
						// edit message with new embed
						message.edit(generateEmbed(currentIndex));

						// react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
						if (currentIndex !== 0) await message.react('⬅️');
						// react with right arrow if it isn't the end
						if (currentIndex + 20 < queue.length)
							message.react('➡️');
					});
				});
			} catch (err) {
				return message.channel.send(
					'I am missing permission to edit message.',
				);
			}
		});
	}
}
