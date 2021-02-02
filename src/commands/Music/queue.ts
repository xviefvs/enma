import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class QueueCommand extends Command {
	constructor() {
		super('queue', {
			aliases: ['queue', 'q'],
			clientPermissions: ['EMBED_LINKS'],
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
			const current = queue.slice(start, start + 10);

			const embed = this.client.util.embed();
			embed.setColor(message.guild?.me?.displayHexColor ?? 'BLURPLE');
			embed.setAuthor(
				`Queue for ${message.guild?.name}`,
				message.guild?.iconURL({ dynamic: true })!,
			);
			const mapped = current.map(
				(track, i) =>
					`**${start + (i + 1)}.** [${track.title}](${track.uri})`,
			);
			embed.setDescription(mapped.join('\n\n'));

			if (queue.current)
				embed.addField(
					'Currently Playing 🎶',
					`[${queue.current.title}](${queue.current.uri})`,
				);
			return embed;
		};

		const author = message.author;

		message.channel.send(generateEmbed(0)).then((message) => {
			if (queue.length <= 10) return;

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
						? (currentIndex -= 10)
						: (currentIndex += 10);
					// edit message with new embed
					message.edit(generateEmbed(currentIndex));

					// react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
					if (currentIndex !== 0) await message.react('⬅️');
					// react with right arrow if it isn't the end
					if (currentIndex + 10 < queue.length) message.react('➡️');
				});
			});
		});
	}
}
