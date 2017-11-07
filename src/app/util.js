module.exports = (function(){

	this.getObjectId = (object) => {

		if(this.isArray(object))
			return getObjectIdsFromList(object);
		else
			return getObjectIdFromObject(object);
	}

	let getObjectIdsFromList = (list) => {
		return list.map(object => object._id);
	}

	let getObjectIdFromObject = (object) => {
		return object._id;
	}

	this.isArray = (object) => {
		return Object.prototype.toString.call( object ) === '[object Array]';
	}

	return this;

})();