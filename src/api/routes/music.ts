import { Router } from 'express';
export const router = Router();
import { bot } from '../../client/EnmaClient';

router.post('/music/play', async (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	const user = await bot.users.fetch(req.body.user);

	const results = await bot.music.search(req.body.name, req.body.user);

	switch (results.loadType) {
		case 'SEARCH_RESULT':
		case 'TRACK_LOADED':
			player.queue.add(results.tracks[0]);

			if (!player.playing && !player.paused && !player.queue.size) {
				res.send(`Now playing ${results.tracks[0].title}`);
				return player.play();
			} else res.send(`Enqueued ${results.tracks[0].title}`);
			break;
	}
});

router.get('/music/queue/:guild', (req, res) => {
	const player = bot.music.players.get(req.params.guild);
	if (!player) return res.send('No player found.');

	res.json(player.queue);
});

router.post('/music/skip/', (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	player.stop();
	res.send('Skipped');
});

router.post('/music/previous', (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	const previous = player.queue.previous;

	if (!previous) return res.send('No Song');

	player.queue.unshift(previous);
	return res.send('Skipped');
});

router.post('/music/pause', (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	if (player.paused) return res.send('Already paused');

	player.pause(true);
});

router.post('/music/resume', (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	if (!player.paused) return res.send('Already resumed');

	player.pause(false);
	res.send('Resumed');
});

router.post('/music/resume', (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	player.queue.shuffle();
	return res.send('Shuffled');
});

router.post('/music/stop', (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	player.destroy();
	return res.send('Stopped');
});

router.post('/music/loop', (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	player.setTrackRepeat(true);
	return res.send('Looping');
});

router.post('/music/seek', (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	player.seek(req.body.time);
	return res.send('Seeked');
});

router.post('/music/volume', (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	player.setVolume(req.body.volume);
	return res.send('Set volume');
});

router.post('/music/remove', (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	player.queue.remove(req.body.index);
	return res.send('Removed');
});

router.post('/music/lyrics', async (req, res) => {
	const player = bot.music.players.get(req.body.guild);
	if (!player) return res.send('No player found.');

	const data = await bot.ksoft.lyrics.get(player.queue.current!.title!, {
		textOnly: false,
	});

	if (!data) return res.send('No lyrics found.');
	res.json({
		name: data.name,
		lyrics: data.lyrics,
	});
});
