let mongo = require('mongodb');
let config = require('./config');
let util = require('./util');

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

	let _buffer = new Buffer('movies', []);

	/**
	 * [Connect]
	 * @return {[Promise]} [description]
	 */
	let _connect = (type) => {
		let _promise = new Promise((resolve, reject)=>{
			mongo.MongoClient.connect(config.db[type].url, function(err, db) {
				if(!err){
					console.log("Connected to server.");
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
	 * [Get Buffer]
	 * @return {[Buffer]} [Returns Buffer object]
	 */
	this.getBuffer = () => {
		return _buffer;
	};

	/**
	 * [Set Buffer]
	 * @param  {[String]} type [description]
	 * @param  {[Array]} data [description]
	 * @return {[Void]}      [description]
	 */
	this.setBuffer = (type, data) => {
		_buffer = new Buffer(type, data);
	}

	/**
	 * [Get Movies]
	 * @return {[Array]} [description]
	 */
	this.getMovies = () => {

		return new Promise((resolve, reject) => {
			console.log('fetching...');
			_connect('buffer').then((db)=>{
				var cursor = db.collection('movies').find().limit(10);
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

	return this;
})(mongo, config);