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

// TODO SoC: index.js should not depend directly atom API
const showMessage = s => atom.notifications.addSuccess(s);
const openFile = f => atom.workspace.open(f);

let env;
const redux = require('redux');
import thunk from 'redux-thunk';


const Lupa = require('./lib/components/Lupa').Lupa;
const lupa = require('lupa');
const analysis = lupa.analysis;
const File = require('vinyl');
const helpers = require('lupa/src/helpers');
const fs = require('fs');


if (typeof atom != 'undefined') {
    env = 'atom';
}

const DEFAULT_CONFIG = {
    comment: 'This is only default config! It may not be appriopriate to your project. Check more on atom.io/packages/atom-lupa',
    filePattern: "src/**/*.js",
}
const CONFIG_FILE_NAME = 'lupaProject.json';


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
            const activeDirectory = Path.dirname(activeFile.path);
            if (activeFile) {
                let configFile = helpers.findInParentDirectories(activeDirectory, CONFIG_FILE_NAME);
                if (!configFile) {
                    // infer most probably project root in case when configFile is not specified
                    const gitRoot = helpers.findInParentDirectories(activeDirectory, '.git');
                    // TODO in case where there is no `.git` directory, root should be taken from localization of:
                    // package.json, gulpfile, gruntfile, .eslintrc, README.md etc.
                    // maybe create some array `potentialRootIndicators` like this
                    // ['package.json', 'Gulpfile.js', 'gruntfile.js', '.eslintrc']
                    // and check them after match is found
                    // in case where there is no match at all: ask user about root
                    if (gitRoot) {
                        configFile = Path.join(Path.dirname(gitRoot), CONFIG_FILE_NAME);
                        console.log('creating config file...', configFile);
                        fs.writeFileSync(configFile, JSON.stringify(DEFAULT_CONFIG, 0, 2), 'utf8');
                        openFile(configFile);
                        showMessage('created config file:' + configFile);
                    }
                }
                if (!configFile) {
                    alert("You have to create config file. Check documentation.");
                } else {
                    analysis.indexProject(configFile);
                }
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
