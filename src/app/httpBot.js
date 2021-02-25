const http = require("https");
const iteration = process.argv[2];
Promise.resolve()
    .then(() => {
        console.log('starting...');
        return iteration;
    })
    .then(function repeat(n) {
        if (n <= 0) return 0;

        console.log(n);

        let apiOptions = {
            method: 'POST',
            hostname: 'mysleepyhead.com',
            port: null,
            headers: {},
            path: '/index.php?route=extension/module/spin_win/generate_coupon'
        }

        let promise = new Promise((resolve, reject) => {

            let req = http.request(apiOptions, function (res) {
                let chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {

                    let body = Buffer.concat(chunks);
                    if (isJson(body)) {
                        body = JSON.parse(body);
                        const message = body.suc_msg || '';
                        if (message.includes('free') || ['30', '35', '40', '45', '50', 'free'].includes(body.value)) {
                            console.log('\x1b[41m%s\x1b[0m', message, body.code, body);
                            return;
                        } else {
                            console.log(message, body.code);
                        }
                    } else {
                        console.log('something went wrong!');
                    };
                    setTimeout(() => {
                        resolve();
                    }, 2000)

                });

            });

            req.on('error', function (error) {
                console.log('failed');
                reject();
            });

            req.write("{}");
            req.end();

        }).then(function () {
            return (repeat(n - 1));
        }).catch(function () {
            console.log('retrying.....');
            return (repeat(n - 1));
        });
        return promise;

        // return new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         resolve();
        //     }, 1000);
        // }).then(() => {
        //     return repeat(n - 1);
        // })
    })
    .then(() => {
        console.log('completed!');
    })
    .catch(() => {
        console.log('error!');
    });
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
} 