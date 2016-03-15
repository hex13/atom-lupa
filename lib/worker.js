console.log("hello from worker.js");

process.on('message', function (msg) {
    process.send({msg:'bla, bla, bla, hello from worker'});
});
