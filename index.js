"use babel";
import React from 'react';
import {connect, Provider} from 'react-redux';
import reducer from './lib/state.js';
import domMiddleware  from './lib/middleware/domMiddleware';

// monkey patching components with file information
const Path = require('path');

require('glob')(Path.join(__dirname, '/lib/components/[A-Z]*.js'), (err, files) => {
    files.map(f => [f, require(f)]).forEach(patchModule);
});

function patchModule([path, m]) {
    Object.keys(m).forEach(k => m[k].lupaMetadata = path);
}

let env;
const redux = require('redux');
import thunk from 'redux-thunk';


const Lupa = require('./lib/components/Lupa').Lupa;
const lupa = require('lupa');
const analysis = lupa.analysis;
const File = require('vinyl');



if (typeof atom != 'undefined') {
    env = 'atom';
}


const main = ({
    atom: require('./lib/atom-bindings/atom-main.js')
})[env];

const editorMiddleware = ({
    atom: require('./lib/atom-bindings/middleware.js')
})[env];

analysis.indexing.subscribe(files => {
    files.forEach(f => {
        store.dispatch({
            type: 'setMetadata',
            file: f
        })
    })
});


function lupaMiddleware(store) {
    return (next) => (action) => {
        if (action.type == 'indexProject') {
            const activeFile = store.getState().activeFile;
            if (activeFile) {
                analysis.indexProject(Path.dirname(activeFile.path));
            }
        }
        if (action.type == 'setActiveFile') {
            const contents = action.file.contents;
            const f = new File({
                path: action.file.path,
                contents: new Buffer(contents)
            });
            analysis.invalidate(f);
            analysis.process(f).subscribe(f => {

                analysis.findImporters(f.path).toArray().subscribe(function (importers) {
                    const importersMd = importers.map(f => ({
                        type: 'imported by',
                        name: f.path,
                        file: f,
                    }))
                    const finalMetadata = (f.metadata || []).concat(importersMd)
                    store.dispatch({
                        type: 'setMetadata',
                        file: f,
                        metadata: finalMetadata.map((ent, i) => {
                            return Object.assign({}, ent, {id: i});
                        })
                    });
                });
            });

        }
        next(action);
    }
}

function mapStateToProps(state) {
    console.log("MAP", state);
    return {
        metadata: state.metadata || [],
        allMetadata: state.allMetadata || [],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}


const store = redux.createStore(
    reducer,
    {},
    redux.applyMiddleware(thunk, domMiddleware, lupaMiddleware, editorMiddleware)
);
store.subscribe(function () {

})
window.lupaStore = store;

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
