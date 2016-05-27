"use babel";
import * as redux from 'redux';
import thunk from 'redux-thunk';
import reducer from './state.js';
import domMiddleware  from './middleware/domMiddleware';

export default function createStore(middlewares) {
    return redux.createStore(
        reducer,
        {},
        redux.applyMiddleware.apply(redux, [thunk, domMiddleware].concat(middlewares))
    );
}
