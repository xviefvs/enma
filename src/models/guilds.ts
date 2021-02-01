import { Schema, model } from 'mongoose';

const guildSchema = new Schema({
	guildID: {
		type: String,
		required: true,
	},
	words: {
		type: Array,
		default: null,
	},
});

export default model('Guild', guildSchema);
