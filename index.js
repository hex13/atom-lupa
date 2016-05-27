let env;

if (typeof atom != 'undefined') {
    env = 'atom';
}

module.exports = require('./lib/init')({
    env: env,
    main: ({
        atom: require('./lib/atom-bindings/atom-main.js')
    })[env],
    editorMiddleware: ({
        atom: require('./lib/atom-bindings/middleware.js')
    })[env]
});
