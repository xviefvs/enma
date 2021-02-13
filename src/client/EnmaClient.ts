import {
	AkairoClient,
	CommandHandler,
	InhibitorHandler,
	ListenerHandler,
	MongooseProvider,
} from 'discord-akairo';
import { Message } from 'discord.js';
import { config } from 'dotenv';
import { KSoftClient } from '@ksoft/api';
import { Manager } from 'erela.js';
import { connect, connection } from 'mongoose';
import { join } from 'path';
import Spotify from 'erela.js-spotify';
import fetch from 'node-fetch';
import * as data from '../../config.json';
import Api from '../api/server';
import akairo from '../models/akairo';
import Logger from '../utils/Logger';
config({ path: '.env' });
const api = new Api();

declare module 'discord-akairo' {
	interface AkairoClient {
		log: typeof Logger;
		music: Manager;
		ksoft: KSoftClient;
		settings: MongooseProvider;
		config: typeof data;
		fetch: typeof fetch;
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
	}
}

class EnmaClient extends AkairoClient {
	public settings = new MongooseProvider(akairo);

	public config = data;

	public log = Logger;

	public fetch = fetch;

	public ksoft = new KSoftClient(process.env.lyrics_token!);

	public music: Manager = new Manager({
		nodes: [
			{
				host: process.env.lavalink_host!,
				password: process.env.lavalink_pass!,
				port: 36619,
				retryAmount: 5,
				retryDelay: 3000,
			},
			{
				host: process.env.backup_lavalink_host!,
				password: process.env.backup_lavalink_pass!,
				port: 80,
				retryAmount: 5,
				retryDelay: 3000,
			},
			// {
			// 	host: 'lava.danbot.host',
			// 	password: 'DBH',
			// 	port: 2333,
			// 	retryAmount: 5,
			// 	retryDelay: 3000,
			// },
		],
		plugins: [
			new Spotify({
				clientID: process.env.spotify_id!,
				clientSecret: process.env.spotify_secret!,
				albumLimit: 0,
				playlistLimit: 0,
			}),
		],
		send: (id, payload) => {
			const guild = this.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
	});

	public commandHandler: CommandHandler = new CommandHandler(this, {
		directory: join(__dirname, '..', 'commands'),
		automateCategories: true,
		aliasReplacement: /-/g,
		handleEdits: true,
		commandUtil: true,
		commandUtilLifetime: 30000,
		commandUtilSweepInterval: 6000,
		defaultCooldown: 3000,
		ignoreCooldown: data.owners,
		ignorePermissions: data.owners,
		prefix: (message: Message) =>
			this.settings.get(message.guild!.id, 'prefix', 'em!'),
		argumentDefaults: {
			prompt: {
				timeout: 'Time ran out, command has been cancelled',
				ended: 'Too many retries, command has been cancelled',
				cancel: 'Command has been cancelled',
				retries: 3,
				time: 60000,
			},
		},
	});

	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: join(__dirname, '..', 'listeners'),
		automateCategories: true,
	});

	public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
		directory: join(__dirname, '..', 'inhibitors'),
		automateCategories: true,
	});

	public constructor() {
		super(
			{
				ownerID: data.owners,
			},
			{
				disableMentions: 'everyone',
				partials: ['REACTION', 'USER', 'MESSAGE', 'CHANNEL'],
			},
		);
	}

	load() {
		try {
			connect(process.env.mongo_db!, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
			});
		} catch (err) {
			console.error(err);
		}
	}

	init() {
		// Dashboard gonna be delayed until the bot hit 1000 servers.
		// api.start();
		this.load();
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			inhibitorHandler: this.inhibitorHandler,
			music: this.music,
			mongo: connection,
		});
		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.settings.init();
		this.login(process.env.bot_token);
	}

	build() {
		this.init();
	}
}

async function removeReactionSlowdown() {
	const fs = require('fs').promises;
	const filePath =
		process.cwd() + '/node_modules/discord.js/src/rest/RequestHandler.js';
	const file = await fs.readFile(
		filePath,
		{
			encoding: 'utf8',
		},
		() => {},
	);
	const found = file.match(/getAPIOffset\(serverDate\) \+ 250/gim);
	if (found) {
		console.log(
			'Removing additional 250ms timeout for reactions.\nWill need to restart process for changes to take effect.',
		);
		const newFile = file.replace(
			/getAPIOffset\(serverDate\) \+ 250/gim,
			'getAPIOffset(serverDate)',
		);
		await fs.writeFile(
			filePath,
			newFile,
			{
				encoding: 'utf8',
			},
			() => {},
		);
		return process.exit();
	}
}
removeReactionSlowdown();
const bot = new EnmaClient();
bot.build();
export { bot };
