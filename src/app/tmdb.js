let mongo = require('mongodb');
let config = require('./config');
let util = require('./util');

<<<<<<< HEAD
/**
 * [Buffer Class]
 * @param {[String]} type [description]
 * @param {[Array]} data [description]
 */
class Buffer{
	constructor(){
		let _type;
		let _data;
		let _forUpdate;
		let _fetched;
	}
	get type () {
		return this._type;
	}
	set type (type) {
		this._type = type;
	}

	get data () {
		return this._data;
	}
	set data (data) {
		this._data = data;
	}

	get forUpdate () {
		return this._forUpdate;
	}

	get fetched () {
		return this._fetched;
	}

	// setForUpdate(data) {
	// 	if(!this._forUpdate.length)
	// 		this._forUpdate = [];

	// 	console.log("this._forUpdate", this._forUpdate);
	// 	this._forUpdate.push(data);
	// }
=======
module.exports = (function(mongo, config){

	/**
	 * [Buffer Class]
	 * @param {[String]} type [description]
	 * @param {[Array]} data [description]
	 */
	let Buffer = function(type, data){
		this.type = type;
		this.data = data;

		this.getType = () => {
			return type;
		};
		this.getData = () => {
			return data;
		};

		this.setType = (type) => {
			this.type = type;
		}
		this.setData = (data) => {
			this.data = data;
		}
		return this;
	};
>>>>>>> 26c26337108100558623149995f1dd7948121c3f

}

module.exports = (function(mongo, config){

	
	this.buffer = new Buffer();

	/**
	 * [Connect]
	 * @return {[Promise]} [description]
	 */
<<<<<<< HEAD
	let _connect = (db) => {
		let url = db === 'main' ? config.db.main_url: config.db.buffer_url
=======
	let _connect = (type) => {
>>>>>>> 26c26337108100558623149995f1dd7948121c3f
		let _promise = new Promise((resolve, reject)=>{
			mongo.MongoClient.connect(config.db[type].url, function(err, db) {
				if(!err){
//					console.log("Connected to server.");
					resolve(db);
				}
				else{
					db.close();
					reject(err);
				}
			});
		});		
		return _promise;	
	};

	/**
	 * [Get Movies]
	 * @return {[Array]} [description]
	 */
	this.getMovies = () => {

		return new Promise((resolve, reject) => {
<<<<<<< HEAD
			console.log('fetching movies...');
			_connect('buffer').then((db)=>{
				let cursor = db.collection('movies').find({fetched: null}).sort({popularity: -1}).limit(40);
=======
			console.log('fetching...');
			_connect('buffer').then((db)=>{
				var cursor = db.collection('movies').find().limit(10);
>>>>>>> 26c26337108100558623149995f1dd7948121c3f
				let movies = [];
				cursor.each(function(err, movie) {
			      if (movie != null){
			      	movies.push(movie);
			      }else{
			      	db.close();
					resolve(movies);
				  }
	 		});
			}).catch((error)=>{
				reject(error);
			});
	 	});

	 };	
	 /**
	  * [Fill Buffer]
	  * @return {[Promise]} [description]
	  */
	this.fillBuffer = () => {
		return new Promise((resolve, reject)=>{
			this.getMovies().then((movies) => {
					this.buffer = {
						type: 'movies',
						data: movies,
						forUpdate: [],
						fetched: []
					};		
					resolve();
				}).catch((error) => {
					throw error;
				});
		});
		// return this.getMovies().then((movies) => {
		// 	this.buffer = {
		// 		type: 'movies',
		// 		data: movies
		// 	};		
		// }).catch((error) => {
		// 	throw error;
		// });
	}

	this.insertManyMovie = (movies) =>{
		return new Promise((resolve, reject)=>{
			_connect('main').then((db)=>{
				let cursor = db.collection('movies');
				cursor.insertMany(movies).then(result => {
					db.close();
					resolve(result);
				});
			})
			.catch((error)=>{
				reject(error)
			});
		});
	}

	this.updateBuffer = (data) =>{
		return new Promise((resolve, reject)=>{
			_connect('vuffer').then((db)=>{
				let cursor = db.collection(buffer.type);
				cursor.updateMany({_id: {$in: data}}, { $currentDate: {
				        fetchedOn: true
				     },
				     $set: {
				        fetched: true
				     }}, {upsert:true})
				.then(result => {
					db.close();
					resolve(result);
				});
			})
			.catch((error)=>{
				reject(error)
			});
		});
	}

	this.isJSON = (str) =>{
		try{
			JSON.parse(str);
		}catch(e){
			return false;
		}
		return true;
	} 

	return this;
})(mongo, config);