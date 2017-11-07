let tmdb = require('./tmdb');
<<<<<<< HEAD
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
=======
let util = require('./util');


let fetchFromRemote = (id)=>{
    console.log('fetching from remote for id: ', id);	
    return new Promise((resolve, rejected)=>{
    	setTimeout(()=>{
	    	console.log("fetched!");	
	    	resolve();
	    },1000);
    });
}

let prepareIdBuffer = (type)=>{
	console.log('preparing id buffer for type: ', type);
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
	    	console.log("prepared!");	
	    	resolve([1,2,3,4,5,6,7,8,9,10]);
	    },1000);
	});
}
let save = ()=>{
	console.log('saving...');
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
	    	console.log('saved!');	
	    	resolve(true);
	    },1000);
	});
};

Promise.resolve(5)
.then((response)=>{
	console.log('initializing...');
	return 5;
}).then(function repeat(response){
	if(response<=0)
		return;
	else
		return repeat(response-1);

}).catch((error)=>{
    console.log("error", error);

});
// tmdb.getMovies().then(function fetchMovies(movies){
	

// 	console.log(movies.length||0, 'movie ids fetched from db.');

// 	tmdb.setBuffer('movies', movies);
	
// 	let idBuffer = tmdb.getBuffer();
// 	let dataBuffer = tmdb.getBuffer();

// //	if(!!!buffer)

// 	// idBuffer.getData().forEach(function(movie, index){
// 	// 	let id = util.getObjectId(movie);
// 	// 	console.log('id', id);
// 	// });

// 	let step_1 = Promise.resolve(3)
// 	.then((response) => {
// 		console.log('Starting...');
// 		return 3;
// 	})
// 	.then(function prepareIdBuffer(response){
// 		console.log('preparing ID buffer...');
// 		if(response<=0){
// 			console.log('exiting from buffer.');
// 			return;
// 		}

// 		console.log("response", response);
// 		return prepareIdBuffer(response-1);

// 	}).then((response)=>{
// 		console.log('Fininshed.');
// 	});
// 	return step_1;




// }).then((response)=>{
// 	console.log('Finished.');
>>>>>>> 26c26337108100558623149995f1dd7948121c3f
// }).catch((error) => {
// 	console.log(error);
// });