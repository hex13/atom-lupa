console.log("hello from worker.js");

process.on('message', function (msg) {
    console.log("worker.js: new message", msg)
});
