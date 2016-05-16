"use babel";
import React from 'react';
import {connect, Provider} from 'react-redux';
import reducer from './lib/state.js';
import domMiddleware  from './lib/middleware/domMiddleware';

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


function lupaMiddleware(action) {
    return (next) => (action) => {
        if (action.type == 'setActiveFile') {
            const contents = action.file.contents;
            const f = new File({
                path: action.file.path,
                contents: new Buffer(contents)
            });
            analysis.invalidate(f);
            analysis.process(f).subscribe(f => {
                console.log('procesowalo sie', f.metadata);
                store.dispatch({
                    type: 'setMetadata',
                    file: f,
                    metadata: (f.metadata || []).map((ent, i) => {
                        return Object.assign({}, ent, {id: i});
                    })
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
    //Lupa: (props) => <Lupa {...props}  />,
    Lupa: (props) => <Provider store={store}>
        <CLupa {...props}/>
    </Provider>
});
