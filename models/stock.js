const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
	stock: {type: String, required: [true, 'Stock field is required']},
	data: {type: Object}
});

const Stock = mongoose.model('stock', stockSchema);

module.exports = Stock;
