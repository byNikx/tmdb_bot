console.log(process.argv[2])
Promise.resolve()
	.then(()=>{
		console.log('test starting...');
		return 10;
	})
	.then(function repeat(n){
		if(n<=0) return 0;

		console.log(n);

		return new Promise((resolve, reject)=>{
			setTimeout(()=>{
				resolve();
			}, 1000);
		}).then(()=>{
			return repeat(n-1);
		})
	})
	.then(()=>{
		console.log('completed!');
	})
	.catch(()=>{
		console.log('error!');
	});