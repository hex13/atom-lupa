"use babel";
import React from 'react';
import {connect, Provider} from 'react-redux';

import createStore from './lib/createStore';

// monkey patching components with file information
const Path = require('path');

require('glob')(Path.join(__dirname, '/lib/components/[A-Z]*.js'), (err, files) => {
    files.map(f => [f, require(f)]).forEach(patchModule);
});

function patchModule([path, m]) {
    Object.keys(m).forEach(k => m[k].lupaMetadata = path);
}


let env;

const Lupa = require('./lib/components/Lupa').Lupa;
const lupa = require('lupa');
const analysis = lupa.analysis;

const fs = require('fs');


if (typeof atom != 'undefined') {
    env = 'atom';
}


const main = ({
    atom: require('./lib/atom-bindings/atom-main.js')
})[env];

const editorMiddleware = ({
    atom: require('./lib/atom-bindings/middleware.js')
})[env];




const lupaMiddleware = require('./lib/lupaMiddleware')(analysis);

const store = createStore([lupaMiddleware, editorMiddleware]);



store.subscribe(function () {

})
window.lupaStore = store;

function mapStateToProps(state) {
    return {
        metadata: state.metadata || [],
        allMetadata: state.allMetadata || [],
        indexed: state.indexed
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}



 //<Provider store={store}>
const CLupa = connect(mapStateToProps, mapDispatchToProps)(Lupa);
module.exports = main({
    dispatch: store.dispatch,
    analysis: analysis,
    //Lupa: (props) => <Lupa {...props}  />,
    Lupa: (props) => <Provider store={store}>
        <CLupa {...props}/>
    </Provider>
});
