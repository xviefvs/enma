import { Message } from 'discord.js';
import { Command } from 'discord-akairo';

export default class LyricsCommand extends Command {
	constructor() {
		super('lyrics', {
			aliases: ['lyrics', 'ly'],
			description: {
				ctx: 'Get the lyrics of a song.',
				usage: '[song]',
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
		const player = this.client.music.players.get(message.guild?.id!);

		const embed = this.client.util.embed().setColor('BLURPLE');

		if (!player) {
			if (!song)
				return message.util?.send(
					'> You need to give me a song name to search lyrics for.',
				);

			const firstRES = await this.client.ksoft.lyrics.get(song, {
				textOnly: false,
			});

			const { lyrics, name } = firstRES;

			if (lyrics.length > 2048) {
				const first_part = lyrics.slice(0, 2048);
				const second_part = lyrics.slice(2048);
				embed.setDescription(first_part);
				embed.setTitle(name);

				message.util?.send(embed);
				message.util?.send(
					this.client.util
						.embed()
						.setDescription(second_part)
						.setColor('BLURPLE')
						.setFooter(
							'Powered by KSoft.Si',
							'https://cdn.ksoft.si/images/Logo1024.png',
						),
				);
			}
			embed.setTitle(name);
			embed.setDescription(lyrics);
			embed.setFooter(
				'Powered by KSoft.Si',
				'https://cdn.ksoft.si/images/Logo1024.png',
			);
			return message.util?.send(embed);
		} else if (player && !song) {
			const songNAME = player?.queue.current?.title!;

			const secondRES = await this.client.ksoft.lyrics.get(songNAME, {
				textOnly: false,
			});

			const { lyrics: _lyrics, name: _name } = secondRES;

			if (_lyrics.length > 2048) {
				const _first_part = _lyrics.slice(0, 2048);
				const _second_part = _lyrics.slice(2048);
				embed.setDescription(_first_part);
				embed.setTitle(_name);

				message.util?.send(embed);
				message.util?.send(
					this.client.util
						.embed()
						.setColor('BLURPLE')
						.setDescription(_second_part)
						.setFooter(
							'Powered by KSoft.Si',
							'https://cdn.ksoft.si/images/Logo1024.png',
						),
				);
			}
			embed.setTitle(_name);
			embed.setDescription(_lyrics);
			embed.setFooter(
				'Powered by KSoft.Si',
				'https://cdn.ksoft.si/images/Logo1024.png',
			);
			return message.util?.send(embed);
		}
		const secondRES = await this.client.ksoft.lyrics.get(song, {
			textOnly: false,
		});

		const { lyrics: _lyrics, name: _name } = secondRES;

		if (_lyrics.length > 2048) {
			const _first_part = _lyrics.slice(0, 2048);
			const _second_part = _lyrics.slice(2048);
			embed.setDescription(_first_part);
			embed.setTitle(_name);

			message.util?.send(embed);
			message.util?.send(
				this.client.util
					.embed()
					.setColor('BLURPLE')
					.setDescription(_second_part)
					.setFooter(
						'Powered by KSoft.Si',
						'https://cdn.ksoft.si/images/Logo1024.png',
					),
			);
		}
		embed.setTitle(_name);
		embed.setDescription(_lyrics);
		embed.setFooter(
			'Powered by KSoft.Si',
			'https://cdn.ksoft.si/images/Logo1024.png',
		);
		return message.util?.send(embed);
	}
}
