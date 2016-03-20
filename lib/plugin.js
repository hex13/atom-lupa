process.on('uncaughtException', function (data) {
    console.log("ERROR", data);
    process.send({error: data});
    //console.log("got uncaughtException", arguments);
});

var PATH = '/Users/lukasz/sandbox/lupa41/src/**/*.js'
var vfs = require('vinyl-fs');
var fs = require('fs');
var through = require('through2');
var Path = require('path');

var lupa = require('lupa').lupa;
var createParser = require('./parsers');
var File = require('vinyl');
var parseHtml = require('html-flavors').parseHtml;

var MAX_LISTENERS = 10000000;

var child_process = require('child_process');


function findVariables(file, enc, cb) {
    // this is example lupa plugin

    var body = file.ast.program.body;

    // analyze AST
    var variables = body.filter(function (node) {
        return node.type == 'VariableDeclaration'
    }).reduce(function (vars, node) {
        return vars.concat(node.declarations.map(function (decl) {
            return decl.id.name;
        }));
    }, []);

    var result = file.clone();
    result.metadata = [{name: 'variables', data: variables}]; // add metadata
    cb(null, result);
}


var fileInfo = require('lupa/src/plugins/FileInfo')();
lupa.plugin(function (file, enc, cb) {
    var result = file.clone();
    var contents = file.contents + '';
    var info = fileInfo(contents, file.path);
    result.metadata = [
        {name: 'lines', data: [info.lines] }
    ]
    cb(null, result);
}, function () { return true;});

lupa.plugin(function (file, enc, cb) {
    var result = file.clone();
    result.metadata = [
        {name: 'html-ast', data: file.ast}
    ]
    cb(null, result);
}, function (p, f) { return f.extname == '.html';});



lupa.plugin(findVariables);


lupa.plugin(require('lupa/plugins/React/components.js').getComponents);

//require('lupa/plugins/React/components')
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
})
module.exports = {
    lupa: lupa,

    analyze: function (path, onAnalyze) {
        if (lupa.getState().files.filter(function (f) {
            return f.path == path;
        }).length) {
            console.log("-------udalo sie JUZ jest");
            console.log("-------udalo sie stan", lupa.getState());
            onAnalyze(lupa.getState())
            return;
        }

        var parser = createParser(path);
        if (parser) {

            var parse = require('ast-stream')(parser);

            var code = fs.readFileSync(path, 'utf8');
            var vinyl = new File({
                path: path,
                contents: new Buffer(code)
            })

            // get data from lupa
            lupa.output.pipe(through.obj( function (data, enc, cb) {
                var state = lupa.getState();
                console.log('state', state)
                cb(null, data)
                onAnalyze(state);
            }));

            // hack to prevent break NodeJs stream
            parse.setMaxListeners(MAX_LISTENERS);

            // pipe parsed data tu lupa
            parse.pipe(through.obj(
                function (data, enc, cb) {
                    console.log("pipe data feeding XD");
                    //lupa.input.write(data);

                    // var worker = child_process.fork(__dirname + '/worker');
                    // console.log("worker created", worker);
                    // worker.on('message', function(data) {
                    //     console.log('pl/ message from worker', data);
                    // });
                    // worker.send(data);

                    console.log("FEEDING");
                    try {
                        lupa.feed(data);
                    } catch(e) {
                        console.log(e);
                    }
                    console.log("WAITING....");
                }
            ));
            console.log("BEFORE PARSING....");
            parse.write(vinyl)
        } else {
            console.log("unable to parse ", path);
        }
    }
}

console.log("Hello world from plugin: loaded");
setInterval(function () {
    console.log("Hello world from plugin");
}, 120 * 1000);
