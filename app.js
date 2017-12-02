const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// connect to database
mongoose.connect('mongodb://127.0.0.1/fundthatflip', {useMongoClient: true});
mongoose.Promise = global.Promise;

// static files
app.use(express.static('./public'));

// middleware - body parser
app.use(bodyParser.json());

// middleware - error handler
app.use(function(err, req, res, next){
	res.status(422).send({error: 'error'});
})

// routes
app.use('/api', require('./routes/api'));

// catch all
app.get('*', function(req, res){
	res.sendFile(__dirname+'/public/index.html');
});

app.listen(process.env.PORT || 3000, function(){
	console.log('listening for requests');
});
