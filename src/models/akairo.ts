import { Schema, model } from 'mongoose';

const akairoSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
		},
		settings: {
			type: Object,
			require: true,
		},
	},
	{ minimize: false }
);

export default model('akairo', akairoSchema);
