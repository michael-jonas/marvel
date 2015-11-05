var express = require('express');
var app = express();
var url = require('url');
var path = require('path');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var data = '';

var api = require('marvel-api');

var marvel = api.createClient({
	publicKey: process.env.pub,
	privateKey: process.env.priv
});

marvel.characters.findAll(function(err, results){
	if(err) throw err;
});

app.get('/:character', function(req,res){

	//To do fix this favicon get
	if(req.params.character === 'favicon.ico'){
		res.send('Hit favicon');
	}

	else{
		marvel.characters.findByName(req.params.character, function(err, results){

			//If it cant find the character it might crash
			if(err) {
				res.send('Character not found. Try again');
				console.log(results);
			}
			
			else if(results == undefined){ 
				console.log('undefined');
				res.send('Character not found');
			}

			else{

				download(results.data[0].thumbnail.path + '.' + results.data[0].thumbnail.extension, 'marvel' + '.jpg', function(){
					fs.readFile('marvel.jpg', function(err,data){
						if(err) throw err;
						res.writeHead(200, {'Content-Type': 'text/html'});
			  			res.write('<html><body><img src="data:image/jpeg;base64,')
			  			res.write(new Buffer(data).toString('base64'));
			  			res.end('"/></body></html>');
					});
				});
			}
		});
	}
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
	console.log('Node app running on port', app.get('port'));
});


function download(uri, filename, callback){
	request.head(uri, function(err,res,body){
		console.log('content-type:', res.headers['content-type']);
    	console.log('content-length:', res.headers['content-length']);
		
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

