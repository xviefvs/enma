import { stripIndents } from 'common-tags';
import { createCanvas, registerFont } from 'canvas';
import path from 'path';
import words from '../../../assets/json/words.json';
import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
// @ts-ignore
import Diff from 'text-diff';
import { AkairoClient } from 'discord-akairo';
registerFont(`${process.cwd()}/assets/fonts/Noto-Regular.ttf`, {
	family: 'Noto',
});

export default class Typing extends Command {
	constructor() {
		super('typing', {
			aliases: ['typing-test', 'typing-game'],
			description: {
				ctx: 'See how fast you can type a sentence.',
			},
		});
	}

	async exec(msg: Message) {
		const sentence = this.generateSentence(5);
		await msg.reply(`**You have 30 seconds to type this sentence.**`, {
			files: [
				{
					attachment: this.generateImage(sentence),
					name: 'typing-test.png',
				},
			],
		});
		const now = Date.now();
		const msgs = await msg.channel.awaitMessages(
			(res) => res.author.id === msg.author.id,
			{
				max: 1,
				time: 30000,
			},
		);
		const win =
			msgs.size && msgs.first()!.content.toLowerCase() === sentence;
		const newScore = Date.now() - now;
		const highScoreGet = await this.client.settings.get(
			msg.guild!.id,
			'typing-test',
			null,
		);
		const highScore = highScoreGet
			? Number.parseInt(highScoreGet, 10)
			: null;
		const highScoreUser = await this.client.settings.get(
			msg.guild!.id,
			'typing-test-user',
			null,
		);
		const scoreBeat = win && (!highScore || highScore > newScore);
		const user = await this.fetchHSUserDisplay(this.client, highScoreUser);
		if (scoreBeat) {
			await this.client.settings.set(
				msg.guild!.id,
				'typing-test',
				newScore,
			);
			await this.client.settings.set(
				msg.guild!.id,
				'typing-test-user',
				msg.author.id,
			);
		}
		if (!msgs.size) return msg.reply('Sorry! You lose!');
		if (msgs.first()!.content.toLowerCase() !== sentence) {
			const diff = new Diff();
			const textDiff = diff.main(
				msgs.first()!.content.toLowerCase(),
				sentence,
			);
			diff.cleanupSemantic(textDiff);
			const formatted = textDiff
				.map((change: any[]) => {
					if (change[0] === 1) return `**${change[1]}**`;
					if (change[0] === 0) return change[1];
					return '';
				})
				.join('');
			return msg.reply(stripIndents`
				Sorry! You made a typo, so you lose!
				${formatted}
			`);
		}
		const wpm = sentence.length / 5 / (newScore / 1000 / 60);
		return msg.reply(stripIndents`
			Nice job! 10/10! You deserve some cake! (Took ${
				newScore / 1000
			} seconds, ${Math.round(wpm)} WPM)
			${scoreBeat ? `**New High Score!** Old:` : `High Score:`} ${
			highScore! / 1000
		}s (Held by ${user})
		`);
	}

	private generateSentence(length: number) {
		const sentence = [];
		for (let i = 0; i < length; i++)
			sentence.push(words[Math.floor(Math.random() * words.length)]);
		return sentence.join(' ');
	}

	private generateImage(sentence: string) {
		const canvasPre = createCanvas(1, 1);
		const ctxPre = canvasPre.getContext('2d');
		ctxPre.font = '75px Noto';
		const len = ctxPre.measureText(sentence);
		const canvas = createCanvas(100 + len.width, 200);
		const ctx = canvas.getContext('2d');
		ctx.font = '75px Noto';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'black';
		ctx.fillText(sentence, canvas.width / 2, canvas.height / 2);
		return canvas.toBuffer();
	}

	private async fetchHSUserDisplay(client: AkairoClient, userID: string) {
		let user;
		if (userID) {
			try {
				const fetched = await client.users.fetch(userID);
				user = fetched.tag;
			} catch {
				user = 'Unknown';
			}
		} else {
			user = 'no one';
		}
		return user;
	}
}
