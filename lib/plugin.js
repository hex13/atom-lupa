var PATH = '/Users/lukasz/sandbox/lupa41/src/**/*.js'
var vfs = require('vinyl-fs');
var fs = require('fs');
var through = require('through2');
var Path = require('path');

var lupa = require('lupa').lupa;
var createParser = require('lupa/parsers/parsers');
var File = require('vinyl');
var parseHtml = require('html-flavors').parseHtml;

var MAX_LISTENERS = 10000000;



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

module.exports = {
    lupa: lupa,

    // TODO temporary function, because init.coffee is in coffeescript and
    // we have code in JavaScript
    getHtmlPreview: function (file) {
        var md = file.metadata.filter(function (md) {
            return md.name == 'html-ast';
        })[0];
        if (md) {
            var root = md.data;
            var s = '';
            function visit(node) {
                if (!node.tag) return '';
                s += '<li>';
                s += node.tag;
                s += '<ul>';
                node.children && node.children.forEach(visit);
                s += '</ul></li>';
            }
            visit(root);
            return '<ul>'+s+'</ul>';
        }
    },

    analyze: function (path, onAnalyze) {
        // if (path.substr(-2) != 'js') {
        //     console.log("only JS files");
        // }
        if (lupa.getState().files.filter(function (f) {
            return f.path == path;
        }).length) {
            onAnalyze(lupa.getState())
            return;
        }

        // lupa.input._writableState.ended = false
        // lupa.input._writableState.ending = false
        // lupa.input._writableState.finished = false

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
                cb(null, data)
                onAnalyze(lupa.getState());
            }));

            // hack to prevent break NodeJs stream
            parse.setMaxListeners(MAX_LISTENERS);

            // pipe parsed data tu lupa
            parse.pipe(through.obj(
                function (data, enc, cb) {
                    console.log("pipe data XD");
                    lupa.input.write(data);
                }
            ));

            parse.write(vinyl)
        } else {
            console.log("unable to parse ", path);
        }
    }
}
