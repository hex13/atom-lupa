"use strict";
let env;
const redux = require('redux');

if (typeof atom != 'undefined') {
    env = 'atom';
}

const main = ({
    atom: require('./lib/atom-bindings/atom-main.js')
})[env];

const handlers = {
    setActiveFile(state, action) {
        return Object.assign({}, state, {activeFile: action.file})
    }
}

function reducer(state, action) {
    if (handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state, action);
    }
    return state;
}
const store = redux.createStore(reducer);
store.subscribe(function () {
    console.log("SUBSCRIBE", store.getState())
})

module.exports = main(store.dispatch);
