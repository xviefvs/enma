import express from 'express';
const app = express();
import Logger from '../utils/Logger';
const port = process.env.port || 3002;
import { router as MusicRoute } from './routes/music';

export default class Api {
	constructor() {
		app.use(express.json());
		app.use('/api', MusicRoute);
		app.all('*', (req, res) => res.send('NOT FOUND'));
	}

	start() {
		app.listen(port, () => Logger.info(`Listening at port ${port}`, 'api'));
	}
}
