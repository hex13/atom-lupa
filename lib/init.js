"use babel";
import React from 'react';
import {connect, Provider} from 'react-redux';

import createStore from './createStore';

// monkey patching components with file information
const Path = require('path');

require('glob')(Path.join(__dirname, '/components/[A-Z]*.js'), (err, files) => {
    files.map(f => [f, require(f)]).forEach(patchModule);
});

function patchModule([path, m]) {
    Object.keys(m).forEach(k => m[k].lupaMetadata = path);
}
//---

let env;

const Lupa = require('./components/Lupa').Lupa;
const lupa = require('lupa');
const analysis = lupa.analysis;

const fs = require('fs');

module.exports = function (opts) {
    const env = opts.env;
    const main = opts.main;
    const editorMiddleware = opts.editorMiddleware;


    const lupaMiddleware = require('./lupaMiddleware')(analysis);

    const store = createStore([lupaMiddleware, editorMiddleware]);


    function mapStateToProps(state) {
        return {
            metadata: state.metadata || [],
            allMetadata: state.allMetadata || [],
            indexed: state.indexed,
            activePosition: state.activePosition
        };
    }

    function mapDispatchToProps(dispatch) {
        return {
            dispatch: dispatch
        };
    }


    const CLupa = connect(mapStateToProps, mapDispatchToProps)(Lupa);
    return main({
        dispatch: store.dispatch,
        analysis: analysis,
        //Lupa: (props) => <Lupa {...props}  />,
        Lupa: (props) => <Provider store={store}>
            <CLupa {...props}/>
        </Provider>
    });
}
