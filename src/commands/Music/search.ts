import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import moment from 'moment';
import 'moment-duration-format';

export default class SearchCommand extends Command {
	constructor() {
		super('search', {
			aliases: ['search', 'sr'],
			clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS', 'CONNECT'],
			description: {
				ctx: 'Search a song to play',
				usage: '<song>',
				example: ['never gonna give you up'],
			},
			args: [
				{
					id: 'song',
					match: 'content',
				},
			],
		});
	}

	async exec(message: Message, { song }: { song: string }) {
		if (!message.member?.voice.channel)
			return message.channel.send(
				'> You need to be in a voice channel to use this command.',
			);
		if (!song)
			return message.channel.send(
				'> You need to give me a song or link to search.',
			);

		const res = await this.client.music.search(song, message.member);

		const player =
			this.client.music.players.get(message.guild!.id) ??
			this.client.music.create({
				guild: message.guild?.id!,
				textChannel: message.channel.id,
				voiceChannel: message.member?.voice.channel!.id,
				selfDeafen: true,
				volume: 85,
			});

		if (player.state !== 'CONNECTED') player.connect();

		switch (res.loadType) {
			case 'SEARCH_RESULT':
				const total = res.tracks;
				const generateEmbed = (start: number) => {
					const current = total.slice(start, start + 10);

					const embed = this.client.util
						.embed()
						.setColor(
							message.guild?.me?.displayHexColor ?? 'BLURPLE',
						);
					const mapped = current.map(
						(track, i) =>
							`**${start + (i + 1)}.** [${track.title}](${
								track.uri
							})`,
					);
					embed.setDescription(mapped.join('\n\n'));

					return embed;
				};

				const author = message.author;

				message.channel.send(generateEmbed(0)).then((message) => {
					if (total.length <= 10) return;

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
							if (currentIndex + 10 < total.length)
								message.react('➡️');
						});
					});
				});
				const filter = (m: Message) =>
					m.author.id === message.author.id;
				const op = {
					max: 1,
					time: 60000,
				};
				const indexCollector = await message.channel.awaitMessages(
					filter,
					op,
				);

				if (!indexCollector.size)
					return message.channel.send(
						"> You didn't provide a selection in time.",
					);

				let index = indexCollector.first()?.content;

				//@ts-ignore
				if (isNaN(index))
					return message.channel.send(
						'> You need to give me a number, please try again.',
					);
				//@ts-ignore
				if (index <= 0 || index >= res.tracks.length)
					return message.channel.send(
						`> You need to give me a number from 1-${res.tracks.length}`,
					);

				//@ts-ignore
				player.queue.add(res.tracks[index - 1]);
				//@ts-ignore
				const { title, duration, thumbnail } = res.tracks[index - 1];

				if (!player.playing && !player.paused && !player.queue.size)
					return player.play();

				const trackEmbed = this.client.util
					.embed()
					.setColor(message.member.displayHexColor)
					.addField('Enqueued 🎶', `\`${title}\` [${message.author}]`)
					.setTimestamp();
				message.util?.send(trackEmbed);
				break;
			case 'PLAYLIST_LOADED':
				return message.util!.send(
					"> Bruh you can't search a playlist use play command instead?.",
				);
				break;
			case 'LOAD_FAILED':
				if (!player.queue.current) player.destroy();
				throw res.exception;
				break;
			case 'NO_MATCHES':
				if (!player.queue.current) player.destroy();
				message.channel.send(
					this.client.util
						.embed()
						.setAuthor(
							message.author.username,
							message.author.displayAvatarURL({ dynamic: true }),
						)
						.setColor('RED')
						.setDescription(
							`> I can\'t find any results for: ${song}`,
						)

						.setColor(message.member.displayHexColor ?? 'BLURPLE'),
				);
				break;
		}
	}
}
