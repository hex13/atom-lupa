var PATH = '/Users/lukasz/sandbox/lupa41/src/**/*.js'
var vfs = require('vinyl-fs');
var through = require('through2');

var lupa = require('lupa').lupa;
var File = require('vinyl');
var parse = require('ast-stream')(require('flow-parser'));




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
});



lupa.plugin(findVariables);

console.log("pluginek", require('lupa/plugins/React/components.js').getComponents);
lupa.plugin(require('lupa/plugins/React/components.js').getComponents);

//require('lupa/plugins/React/components')

module.exports = {
    lupa: lupa,
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
        console.log("TO JE PATH", lupa.input)
        // lupa.input._writableState.ended = false
        // lupa.input._writableState.ending = false
        // lupa.input._writableState.finished = false
        var parse = require('ast-stream')(require('flow-parser'));

        // lupa.input = through.obj(function (ch, enc, cb) {
        //     cb(null, ch);
        // });
        //
        // console.log("Buffer", parse.write);

        var fs = require('fs');
        var code = fs.readFileSync(path, 'utf8');
        var vinyl = new File({
            path: path,
            contents: new Buffer(code)
        })
        //vfs.src([path])

            parse
            .pipe(lupa.input)
            .pipe(through.obj( function (data, enc, cb) {
                console.log("dostalismy x", lupa.getState());
                //lupa.save('/Users/lukasz/abc.json')
                cb(null, data)
                onAnalyze(lupa.getState());
            }));
        parse.write(vinyl)
    }
}
