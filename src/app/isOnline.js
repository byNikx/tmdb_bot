const isOnline = require('is-online');
const shell = require('shelljs');

(function test(){
	var version = shell.exec('node test.js').stdout;
	Promise.resolve()
		.then(()=>{
			console.log('checking connectivity...');
		}).then(function checkConnectivity(){

			return isOnline().then(online => {
				if(!online) {
					console.log('no internet access.');
					return checkConnectivity();
				}
			});

		}).then(()=>{
			console.log('connected!');
		}).catch(()=>{
			test();
		});
})();