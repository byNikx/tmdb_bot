let tmdb = require('./tmdb');

tmdb.getMovies().then((movies) => {

	tmdb.setBuffer('movies', movies);
	
	tmdb.getBuffer().getData().forEach(function(movie, index){
		console.log(movie);
	});
}).catch((error) => {
	console.log(error);
});