import { config } from 'dotenv';
config({ path: '.env' });
import { join } from 'path';
import { connect, connection } from 'mongoose';
import {
	AkairoClient,
	CommandHandler,
	ListenerHandler,
	InhibitorHandler,
	MongooseProvider,
} from 'discord-akairo';
import { Message } from 'discord.js';
import { Manager } from 'erela.js';
import Spotify from 'erela.js-spotify';
import akairo from '../models/akairo';
import * as data from '../../config.json';
import Log from './../utils/Logger';

declare module 'discord-akairo' {
	interface AkairoClient {
		log: Log;
		music: Manager;
		utils: Util;
		commandHandler: CommandHandler;
	}
}

class EnmaClient extends AkairoClient {
	public settings = new MongooseProvider(akairo);

	public log: Log;

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

	public commands: CommandHandler = new CommandHandler(this, {
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
	// @ts-ignore
	public listeners = new ListenerHandler(this, {
		directory: join(__dirname, '..', 'listeners'),
		automateCategories: true,
	});

	public inhibitors = new InhibitorHandler(this, {
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

		this.log = Log;
	}

	db() {
		try {
			connect(process.env.mongo_db!, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
		} catch (err) {
			console.error(err);
		}
	}

	init() {
		this.db();
		this.commands.useListenerHandler(this.listeners);
		this.commands.useInhibitorHandler(this.inhibitors);
		this.listeners.setEmitters({
			commandHandler: this.commands,
			listenerHandler: this.listeners,
			inhibitorHandler: this.inhibitors,
			music: this.music,
			mongo: connection,
		});
		this.commands.loadAll();
		this.listeners.loadAll();
		this.inhibitors.loadAll();
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
