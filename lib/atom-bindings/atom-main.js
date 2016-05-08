"use babel";

import {CompositeDisposable} from 'atom';
import React from 'react';
import ReactDOM from 'react-dom';

import {Structure} from '../components/Structure';

module.exports = {
    subscriptions: null,
    config: {
        autoRefresh: {
            type: 'boolean',
            default: true,
        },
        shouldShowBreadcrumbs: {
            type: 'boolean',
            default: 'true',
            description: '(Restart of Atom is required after changing)',
        }
    },
    activate(state) {
        const el = document.createElement('div');


        atom.workspace.addLeftPanel({item: el});
        const metadata = [
                    {type: 'something', name: 'something1'},
                    {type: 'something', name: 'something2'},
                    {type: 'foo', name: 'foo1'},
        ];
        ReactDOM.render(<Structure metadata={metadata}/>, el);

        alert('act');
    },

    deactivate() {
        alert('deact');
    }
};
