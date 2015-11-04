var express = require('express');
var app = express();
var url = require('url');
var path = require('path');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var data = '';
var pubKey = '18b80a4ceb57142835c9f9b54233eb1c';
var privKey = '7bbdc7541dfac1eedfd43ddf3a6add2edf3d7f2a';

var api = require('marvel-api');

var marvel = api.createClient({
	publicKey: pubKey,
	privateKey: privKey
});

marvel.characters.findAll(function(err, results){
	if(err) throw err;
});

app.get('/:character', function(req,res){
	marvel.characters.findByName(req.params.character, function(err, results){
		if(err) throw err;

		download(results.data[0].thumbnail.path + '.' + results.data[0].thumbnail.extension, 'marvel' + '.jpg', function(){
			fs.readFile('marvel.jpg', function(err,data){
				if(err) throw err;
				res.writeHead(200, {'Content-Type': 'text/html'});
	  			res.write('<html><body><img src="data:image/jpeg;base64,')
	  			res.write(new Buffer(data).toString('base64'));
	  			res.end('"/></body></html>');
			});
		});
	});
});

app.listen(3000);


function download(uri, filename, callback){
	request.head(uri, function(err,res,body){
		console.log('content-type:', res.headers['content-type']);
    	console.log('content-length:', res.headers['content-length']);
		
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

