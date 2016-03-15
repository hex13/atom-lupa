var Path = require('path');

var parseHtml = require('html-flavors').parseHtml;

var parsers = {
    '.js': require('flow-parser'),
    '.html': {
        parse: function (code) {
            var ast = parseHtml(code);
            return ast;
        }
    }
};

function createParser(path) {
    var ext = Path.extname(path);
    console.log(ext)
    if (parsers.hasOwnProperty(ext)) {
        return parsers[ext];
    }
}

module.exports = createParser;
