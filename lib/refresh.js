"use babel";

import React from 'react';
import ReactDOM from 'react-dom';
import {Structure} from './components/Structure';

export function refreshStructure(metadata) {
    ReactDOM.render(
        React.createElement(Structure, {metadata: metadata}),
        document.getElementById('lupa-structure')
    )
}
