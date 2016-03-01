var test = require('tape').test;
var plugin = require('../lib/plugin');


test('mock.html', function (t) {
    var pluginCount = 2;
    var count = 0;
    plugin.analyze('mock.html', function (state) {
        count++;

        t.assert(count <= pluginCount);
        if (count == pluginCount) {
            t.end();
        }
        t.equal(state.files.length, 1);
        t.equal(state.files[0].path, 'mock.html')
        t.assert(state.files[0].metadata.length)
    });
});
