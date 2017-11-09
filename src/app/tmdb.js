let mongo = require('mongodb');
let config = require('./config');

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

}

module.exports = (function(mongo, config){

	
	this.buffer = new Buffer();

	/**
	 * [Connect]
	 * @return {[Promise]} [description]
	 */
	let _connect = (db) => {
		let url = db === 'main' ? config.db.main_url: config.db.buffer_url
		let _promise = new Promise((resolve, reject)=>{
			mongo.MongoClient.connect(url, function(err, db) {
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
	this.getMedia = (type) => {

		return new Promise((resolve, reject) => {
			console.log('fetching', type, '...');
			_connect('buffer').then((db)=>{
				let cursor = db.collection(type).find({fetched: null}).sort({popularity: -1}).limit(20);
				let mediaData = [];
				cursor.each(function(err, media) {
			      if (mediaData && media){
			      	mediaData.push(media);
			      }else{
			      	db.close();
					resolve(mediaData);
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
	this.fillBuffer = (type) => {
		return new Promise((resolve, reject)=>{
			this.getMedia(type).then((response) => {
					this.buffer = {
						type: type,
						data: response,
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

	this.insertManyDocuments = (documents) =>{
		return new Promise((resolve, reject)=>{
			_connect('main').then((db)=>{
				let cursor = db.collection(buffer.type);
				cursor.insertMany(documents).then(result => {
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