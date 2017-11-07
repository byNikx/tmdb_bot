let tmdb = require('./tmdb');
let http = require("https");

Promise.resolve()
	.then(function() {
	  console.log('Starting bot...');
	  return ([]);
	})
	.then(function recursiveFunction(data){
	  if(!data || data.length<=0){

	  	if(tmdb.buffer.forUpdate && tmdb.buffer.forUpdate.length>0){

	  		console.log('Inserting', tmdb.buffer.forUpdate.length, tmdb.buffer.type);
	  		return tmdb.insertManyMovie(tmdb.buffer.forUpdate).then((data)=>{
//	  			tmdb.buffer.insertCount += tmdb.buffer.forUpdate.length; 
	  			tmdb.buffer.forUpdate = [];
	  			console.log('updating buffer...');
	  			return tmdb.updateBuffer(tmdb.buffer.fetched).then((data)=>{
	  				tmdb.buffer.fetched = [];
	  				console.log('updated!');
//	  				console.log(tmdb.buffer.insertCount, 'documents inserted.');
	  				return recursiveFunction(tmdb.buffer.data);
	  			});		  		
		  	});
	  	}
	  	console.log('filling buffer...');	  	
	  	return tmdb.fillBuffer().then((data)=>{
	  		return recursiveFunction(tmdb.buffer.data);
	  	});
	  }
	  let item = tmdb.buffer.data.shift();
	  console.log('fetching', tmdb.buffer.type, item.original_title, item.popularity);
	  
	  let promise = new Promise((resolve, reject)=>{

	  	let options = {
				"method": "GET",
				"hostname": "api.themoviedb.org",
				"port": null,
				"path": "/3/movie/"+item.id+"?language=en-US&api_key=56fd94ed1618bd7235d227829acdfaa1",
				"headers": {}
			};
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
			    	tmdb.buffer.forUpdate.push(JSON.parse(body.toString()));// = item;
		            tmdb.buffer.fetched.push(item._id);
		    	}
		    }
		    resolve();
		    // setTimeout(()=>{
		    // 	resolve();
		    // },1000);
		  });
		});

		req.write("{}");
		req.end();






	    // setTimeout(()=>{
     //      tmdb.buffer.forUpdate.push(item);// = item;
     //      tmdb.buffer.fetched.push(item._id);
	    //   resolve();
	    // }, 1000)
	  }).then(function(){
	    return (recursiveFunction(tmdb.buffer.data));
	  });

	  return (promise);

	})
	.then(function(){
	  console.log('Bot stopped.');
	});
// tmdb.getMovies().then((movies) => {

// 	tmdb.buffer = {
// 		type: 'movies',
// 		data: movies
// 	};
	
// 	tmdb.buffer.data.forEach(function(movie, index){
// 		console.log(movie);
// 	});
// }).catch((error) => {
// 	console.log(error);
// });