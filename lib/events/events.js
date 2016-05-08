"use babel";

export function emit(name, args) {
    if (handlers.hasOwnProperty(name)) {
        handlers[name].apply(null, args);
    } else {
        console.error('Lupa: can\'t find handler for ' + name);
    }
}

var handlers = require('../atom-bindings/atom-handlers');

window.lupaEmit = emit;
