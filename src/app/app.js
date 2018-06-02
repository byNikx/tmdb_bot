const tmdb = require('./tmdb');
const http = require("https");
const isOnline = require('is-online');

var target = process.argv[2];
var order = process.argv[3];

if(!target){
	console.log('please provide a target.');
	process.exit();
}

if(!order && isNaN(order)){
	console.log('please provide a valid order.');
	process.exit();
}
order = Number.parseInt(order);

function getApiOptions(type, media){
	
	let apiOptions = {
			method: 'GET',
			hostname: 'api.themoviedb.org',
			port: null,
			headers: {} 
	}
	switch(type.toUpperCase()){
		case 'MOVIES':
			Object.assign(apiOptions, { path: '/3/movie/'+media.id+'?language=en-US&api_key=56fd94ed1618bd7235d227829acdfaa1' });
			break;
		case 'TV_SERIES':
			Object.assign(apiOptions, { path: '/3/tv/'+media.id+'?language=en-US&api_key=56fd94ed1618bd7235d227829acdfaa1' });
			break;
		case 'COLLECTIONS':
			Object.assign(apiOptions, { path: '/3/collection/'+media.id+'?language=en-US&api_key=56fd94ed1618bd7235d227829acdfaa1' });
			break;
		case 'PERSONS':
			Object.assign(apiOptions, { path: '/3/person/'+media.id+'?language=en-US&api_key=56fd94ed1618bd7235d227829acdfaa1' });
			break;	
		default:	
			Object.assign(apiOptions, { path: '/3/movie/'+media.id+'?language=en-US&api_key=56fd94ed1618bd7235d227829acdfaa1' });
	}

	return apiOptions;
}

(function app(target, order){
	Promise.resolve()
		.then(function() {
		  console.log('starting bot...');
		  console.log('checking connectivity...');
		})
		.then(function checkConnectivity(){
			return isOnline().then(online => {
				if(!online) {
					console.log('no internet access.');
					return checkConnectivity();
				}
			});
		}).then(()=>{
			console.log('internet access available.');
			return ([]);
		})
		.then(function recursiveFunction(data, attempt){
  		  var attempt = isNaN(attempt) ? 0: attempt;
		  if(attempt >=10) return 0;	
		  if(!data || data.length<=0){

		  	if(tmdb.buffer.forUpdate && tmdb.buffer.forUpdate.length>0){

		  		console.log('saving', tmdb.buffer.forUpdate.length, tmdb.buffer.type);
		  		return tmdb.insertManyDocuments(tmdb.buffer.forUpdate).then((data)=>{
		  			tmdb.buffer.forUpdate = [];
		  			console.log('updating buffer...');
		  			return tmdb.updateBuffer(tmdb.buffer.fetched).then((data)=>{
		  				tmdb.buffer.fetched = [];
		  				console.log('updated!');
		  				return recursiveFunction(tmdb.buffer.data);
		  			});		  		
			  	});
		  	}
		  	console.log('filling buffer...');	  	
		  	return tmdb.fillBuffer(target, order).then((data)=>{
		  		if(data.length<=0) return recursiveFunction(tmdb.buffer.data, attempt+1);
		  		else return recursiveFunction(tmdb.buffer.data, 0);
		  	});
		  }
		  let item = tmdb.buffer.data.shift();
		  console.log('fetching', tmdb.buffer.type, item.original_title || item.original_name || item.name, item.popularity || '');
		  
		  let promise = new Promise((resolve, reject)=>{

		  	let options = getApiOptions(target,item);

		  	let req = http.request(options, function (res) {
			  let chunks = [];

			  res.on("data", function (chunk) {
			    chunks.push(chunk);
			  });

			  res.on("end", function () {

			    let body = Buffer.concat(chunks);
			    if(tmdb.isJSON(body)){
			    	if(!!body.status_code){
			    	//if(body.status_code && body.status_code == 34){
			    		console.log('Not found', body);
			    	}else{
				    	tmdb.buffer.forUpdate.push(JSON.parse(body.toString()));
			            tmdb.buffer.fetched.push(item._id);
			    	}
			    }
			    resolve();

			  });

			});

			req.on('error', function (error){
				console.log('failed');
			  	reject();
		    });

			req.write("{}");
			req.end();

		  }).then(function(){
		    return (recursiveFunction(tmdb.buffer.data));
		  });

		  return (promise);

		})
		.then(function(){
		  console.log('bot stopped');
		}).catch(()=>{
			console.log('bot stopped with error');
			console.log('retrying...');
			app(target, order);
		});
	})(target, order);