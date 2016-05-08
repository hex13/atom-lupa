"use babel";

import {CompositeDisposable} from 'atom';
import React from 'react';
import ReactDOM from 'react-dom';

const log = console.log.bind(console);
const _ = require('lodash');

module.exports = function({dispatch, Lupa}) {
    console.log("atom-main.js", dispatch, Lupa)
    return {
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
            const entities = [
                        {type: 'something', name: 'something1'},
                        {type: 'something', name: 'something2'},
                        {type: 'foo', name: 'foo1'},
            ];
            ReactDOM.render(<Lupa entities={entities} />, el);

            const editor = atom.workspace.getActiveTextEditor();
            if (editor) {
                updateEditor(editor);
            }
            atom.workspace.onDidChangeActivePaneItem(updateEditor);

            function updateEditor(editor) {
                console.log("updateEditor", editor, _.get(editor, 'buffer.file.path'));
                dispatch({
                    type: 'setActiveFile',
                    file: {
                        path: _.get(editor, 'buffer.file.path'),
                        contents: editor.buffer.getText()
                    }
                })
            }
        },

        deactivate() {

            alert('deact');
        }
    };
};
