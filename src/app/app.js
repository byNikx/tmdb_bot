let tmdb = require('./tmdb');
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
// }).catch((error) => {
// 	console.log(error);
// });