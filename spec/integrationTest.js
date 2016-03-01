var test = require('tape').test;
var plugin = require('../lib/plugin');

var count = 0;

//TODO get this value from plugin itself
var pluginCount = 3;

test('ss', function (t) {
    plugin.analyze('mock.js', function (state) {
        count++;
        t.assert(count<4);
        if (count == pluginCount) {
            t.end();
        }
        t.equal(state.files.length, 1);
        t.equal(state.files[0].path, 'mock.js')
        t.assert(state.files[0].metadata.length)
    });
});
