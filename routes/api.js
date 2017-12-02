const express = require('express');
const router = express.Router();

const Stock = require('../models/stock');

router.post('/stock', function(req, res, next) {
	Stock.findOne({stock: req.body.stock}).then(function(stock){
		res.send({stock_obj: stock})
	}).catch(next);
})

module.exports = router;
