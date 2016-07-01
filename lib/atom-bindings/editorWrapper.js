'use strict';

module.exports = {
    RememberPosition(editor) {
        editor = editor || atom.workspace.getActiveTextEditor();
        if (!editor) {
            return {
                type: 'error'
            }
        }

        const pos = editor.getCursorBufferPosition();
        const scrollPos = editor.getVisibleRowRange();
        return {
            type: 'rememberPosition',
            pos: [pos.row, pos.column],
            scrollPos: scrollPos,
            path: editor.getPath(),
            selections: editor.getSelectedBufferRanges()
        }
    }
}
