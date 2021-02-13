import { Message } from 'discord.js';
import { Command } from 'discord-akairo';
import fs from 'fs';

export default class CodeCommand extends Command {
	constructor() {
		super('code', {
			aliases: ['code'],
			ownerOnly: true,
			args: [
				{
					id: 'module',
				},
				{
					id: 'cmd',
				},
			],
		});
	}

	exec(message: Message, { module, cmd }: { module: string; cmd: string }) {
		if (!module)
			return message.util!.send('https://github.com/xviefvs/enma');
		let code;

		try {
			code = fs
				.readFileSync(`${process.cwd()}/src/commands/${module}/${cmd}`)
				.toString();
		} catch (error) {
			return message.channel.send(
				`I couldn't find any modules/commands with that name`,
			);
		}

		try {
			if (cmd) {
				message.channel.send(
					`Here is the code for the ${cmd} command:\n\`\`\`js\n${code.substr(
						0,
						1900,
					)}\`\`\``,
				);
			}
		} catch (e) {
			return message.channel.send(
				"There was an error displaying the command's code.",
			);
		}
	}
}

// import { Message } from 'discord.js';
// import { Command } from 'discord-akairo';
// // @ts-ignore
// import { get } from 'node-superfetch';
// import { Canvas } from 'canvas-constructor';
// Canvas.registerFont(`${process.cwd()}/assets/fonts/bebas.ttf`, 'fatality');

// export default class CanvasCommand extends Command {
// 	constructor() {
// 		super('canvas', {
// 			aliases: ['canvas'],
// 			ownerOnly: true,
// 			args: [
// 				{
// 					id: 'link',
// 				},
// 			],
// 		});
// 	}

// 	async exec(message: Message, { id }: { id: string }) {
// 		const background = id || 'https://wallpapercave.com/wp/wp6835078.jpg';
// 		let WELCOME_MESSAGE_TITLE = `${message.author.username} Just joined!`;

// 		let WELCOME_MESSAGE_TEXT = `You are our ${message.guild?.memberCount}th member.`;

// 		// .replace(/{user}/g, message)
// 		// .replace(/{server}/g, message.guild.name)
// 		// .replace(/{serverCount}/g, message.guild.messages.cache.filter(m => !m.user.bot).messageCount)
// 		// .replace(/{user.username}/g, message.user.username)
// 		// .replace(/{user.id}/g, message.user.id)
// 		// .replace(/{user.discriminator}/g, message.user.discriminator)
// 		// .replace(/{user.tag}/g, message.user.tag)

// 		try {
// 			async function createCanvas() {
// 				var imageUrlRegex = /\?size=2048$/g;
// 				var AUTHOR_NAME = message.author.username;
// 				var AUTHOR_TAG = message.author.tag;
// 				var AUTHOR_TAG_LENGTH =
// 					AUTHOR_TAG.length > 10
// 						? AUTHOR_TAG.substring(0, 12) + '..'
// 						: AUTHOR_TAG;
// 				var AUTHOR_NAME_LENGTH =
// 					AUTHOR_NAME.length > 10
// 						? AUTHOR_NAME.substring(0, 12) + '..'
// 						: AUTHOR_NAME;
// 				var { body: avatar } = await get(
// 					message.author
// 						.displayAvatarURL({
// 							format: 'png',
// 							dynamic: true,
// 							size: 1024,
// 						})
// 						.replace(imageUrlRegex, '?size128'),
// 				);
// 				var { body: defaultbackground } = (await get(background))
// 					? await get(background)
// 					: await get(`https://wallpapercave.com/wp/wp5777334.jpg`);

// 				return (
// 					new Canvas(820, 360)
// 						// @ts-ignore
// 						.addImage(defaultbackground, 0, 0, 820, 360)
// 						// @ts-ignore
// 						.addRoundImage(avatar, 335, 35, 150, 150, 150 / 2)
// 						.setColor('#ffffff')
// 						.setTextAlign('center')
// 						.setTextFont('30px fatality')
// 						.addText(WELCOME_MESSAGE_TITLE, 410.6, 228.1)
// 						.setTextFont('25px fatality')
// 						.addText(WELCOME_MESSAGE_TEXT, 410.6, 276.1)
// 						.toBuffer()
// 				);
// 			}
// 			const attachment = this.client.util.attachment(
// 				await createCanvas(),
// 				'welcome.png',
// 			);
// 			message.channel.send(attachment);
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	}
// }
