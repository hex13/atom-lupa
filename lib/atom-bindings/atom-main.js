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
            el.style.overflow = 'scroll';


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

            atom.commands.add('.lupa-structure .lupa-entity', 'atom-lupa:lupa-structure-enter', function (e) {
                const el = e.target.closest('.lupa-entity');
                if (el) {
                    dispatch(window.lupaNavigationActions.GoTo(el));
                }
            })
            // TODO autorefresh
            function updateEditor(editor) {
                if (editor.buffer) {
                    dispatch({
                        type: 'setActiveFile',
                        file: {
                            path: _.get(editor, 'buffer.file.path'),
                            contents: editor.buffer.getText()
                        }
                    })
                }
            }
        },

        deactivate() {

            alert('deact');
        }
    };
};
