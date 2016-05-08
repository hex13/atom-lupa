"use babel";
import React from 'react';
import {connect, Provider} from 'react-redux';

let env;
const redux = require('redux');


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

const handlers = {
    setActiveFile(state, action) {
        return Object.assign({}, state, {activeFile: action.file})
    },
    setMetadata(state, action) {
        return Object.assign({}, state, {metadata: action.metadata})
    },
}

function reducer(state, action) {
    if (handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state, action);
    }
    return state;
}

function lupaMiddleware(action) {
    console.log('lupaMiddleware');
    return (next) => (action) => {
        if (action.type == 'setActiveFile') {
            const contents = action.file.contents;
            const f = new File({
                path: action.file.path,
                contents: new Buffer(contents)
            });

            analysis.process(f).subscribe(f => {
                console.log('procesowalo sie', f);
                store.dispatch({
                    type: 'setMetadata',
                    metadata: f.metadata
                });
            });

        }
        next(action);
    }
}

function mapStateToProps(state) {
    console.log("MAP", state);
    return {
        metadata: state.metadata || []
    };
}


const store = redux.createStore(
    reducer,
    {},
    redux.applyMiddleware(lupaMiddleware)
);
store.subscribe(function () {
    console.log("SUBSCRIBE", store.getState())
})

 //<Provider store={store}>
const CLupa = connect(mapStateToProps)(Lupa);
module.exports = main({
    dispatch: store.dispatch,
    //Lupa: (props) => <Lupa {...props}  />,
    Lupa: (props) => <Provider store={store}>
        <CLupa {...props}/>
    </Provider>
});
