"use babel";
import {CompositeDisposable} from 'atom';
import React from 'react';
import ReactDOM from 'react-dom';
import {Styleguide} from '../styleguide';
const log = console.log.bind(console);
const _ = require('lodash');

import {patchReact} from '../styleguide';


module.exports = function({dispatch, Lupa, analysis}) {
    console.log("atom-main.js", dispatch, Lupa);
    analysis.indexing.subscribe(files => {
        atom.notifications.addSuccess(`${files && files.length} files have been indexed.`);
        dispatch({type: 'indexed', result: true, count: files.length})

    })
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
            },
            styleguide: {
                type: 'boolean',
                default: false,
                description: '(Restart of Atom is required after changing)',
            }

        },
        activate(state) {
            const el = document.createElement('div');
            el.style.overflow = 'scroll';


            atom.workspace.addLeftPanel({item: el});

            const breadcrumbsElement = document.createElement('div');
            atom.workspace.addTopPanel({item: breadcrumbsElement});
            const entities = [
                        {type: 'something', name: 'something1'},
                        {type: 'something', name: 'something2'},
                        {type: 'foo', name: 'foo1'},
            ];
            function renderLupa() {
                ReactDOM.render(
                    <Lupa
                        entities={entities}
                        breadcrumbsElement={breadcrumbsElement}/>, el);

            }
            renderLupa();

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
            });

            atom.commands.add('atom-workspace', 'atom-lupa:toggle', function (e) {
                const elementToFocus = el.querySelector('.lupa-search');
                if (elementToFocus) elementToFocus.focus();
            });

            atom.commands.add('.lupa-structure', 'atom-lupa:lupa-structure-esc', function (e) {
                const editor = atom.workspace.getActiveTextEditor();
                if (editor) {
                    editor.element.focus();
                }
            });



            // :
            //   'cmd-.':

            // TODO autorefresh
            setInterval(() => {
                const editor = atom.workspace.getActiveTextEditor();
                if (editor && editor.buffer) {
                    dispatch({
                        type: 'setActiveFile',
                        file: {
                            path: _.get(editor, 'buffer.file.path'),
                            contents: editor.buffer.getText()
                        }
                    })
                }
            }, 1000);

            function updateEditor(editor) {
                if (editor && editor.buffer) {
                    dispatch({
                        type: 'setActiveFile',
                        file: {
                            path: _.get(editor, 'buffer.file.path'),
                            contents: editor.buffer.getText()
                        }
                    });
                    editor.onDidChangeCursorPosition(e => {
                        const pos = e.newBufferPosition;
                        dispatch({
                            type: 'setActivePosition',
                            pos: pos,
                        });
                    })
                }
            }

            const styleguide = {
                element: document.createElement('div'),
                getTitle: () => 'Lupa styleguide'
            };
            styleguide.element.style.overflow = 'scroll';

            if (atom.config.get('atom-lupa.styleguide')) {
                atom.workspace.getActivePane().addItem(styleguide);
                patchReact(React);
            }
            atom.workspace.onDidChangeActivePaneItem(item => {
                if (item===styleguide) {
                    ReactDOM.render(<Styleguide styleguide={window.styleguide}/>, styleguide.element);
                }
            });
        },

        deactivate() {


        }
    };
};
