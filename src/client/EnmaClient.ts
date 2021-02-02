import {
	AkairoClient,
	CommandHandler,
	ListenerHandler,
	InhibitorHandler,
	MongooseProvider,
} from 'discord-akairo';
import { join } from 'path';
import { connect, connection } from 'mongoose';
import { Message } from 'discord.js';
import { Manager } from 'erela.js';
import { KSoftClient } from '@ksoft/api';
import { config } from 'dotenv';
config({ path: '.env' });
import Spotify from 'erela.js-spotify';
import AlexClient from 'alexflipnote.js';
import akairo from '../models/akairo';
import * as data from '../../config.json';
import Logger from '../utils/Logger';

// import Api from '../api/server';
// const api = new Api();

declare module 'discord-akairo' {
	interface AkairoClient {
		log: typeof Logger;
		music: Manager;
		ksoft: KSoftClient;
		settings: MongooseProvider;
		alex: AlexClient;
		commandHandler: CommandHandler;
		listenerHandler: ListenerHandler;
		inhibitorHandler: InhibitorHandler;
	}
}

class EnmaClient extends AkairoClient {
	public settings = new MongooseProvider(akairo);

	public log = Logger;

	public alex = new AlexClient(process.env.image_token!);

	public ksoft = new KSoftClient(process.env.lyrics_token!);

	public music: Manager = new Manager({
		nodes: [
			{
				host: process.env.lavalink_host!,
				password: process.env.lavalink_pass!,
				port: Number(process.env.lavalink_port!),
			},
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
		commandUtilLifetime: 60000,
		commandUtilSweepInterval: 6000,
		defaultCooldown: 3000,
		ignoreCooldown: data.owners,
		ignorePermissions: data.owners,
		prefix: (message: Message) => {
			if (message.guild) {
				return this.settings.get(message.guild.id, 'prefix', 'em!');
			}

			return 'em!';
		},
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
			},
		);
	}

	load() {
		try {
			connect(process.env.mongo_dev!, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
			});
		} catch (err) {
			console.error(err);
		}
	}

	init() {
		// api.listen();
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
	}

	build() {
		super.login(process.env.bot_token);
		this.init();
	}
}

const bot = new EnmaClient();
bot.build();
export { bot };
