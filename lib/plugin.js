process.on('uncaughtException', function (data) {
    console.log("ERROR", data);
    process.send({error: data});
    //console.log("got uncaughtException", arguments);
});


process.on('message', function (msg) {
    console.log("plugin, got message", msg);

    if (msg.type == 'analyze') {
        module.exports.analyze(msg.path, function (state) {
            console.log("plugin, analyzed");
            process.send(state);
        });
    }

    if (msg.type == 'loadIndexFile') {
        var json = fs.readFileSync(msg.path, 'utf8');
        var state = JSON.parse(json);
        lupa.load(state);
    }
});

module.exports = {

}
