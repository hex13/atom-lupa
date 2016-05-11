// action creators

function RememberPosition(editor) {
    return {
        type: 'rememberPosition',
        pos: editor.getCursorBufferPosition(),
        path: editor.getPath()
    }
}

//----------------------------------------------

function atomMiddleware(action) {
    return (next) => (action) => {
        if (action.type == 'goTo') {
            const editor = atom.workspace.getActiveTextEditor();
            if (editor) {
                next(RememberPosition(editor));

                // workaround of Atom scrolling bug
                // atom/atom#11429, atom/atom#3324
                // (normally we should use scrollToBufferPosition,
                // but it doesn't work in expected way).
                const loc = action.loc;
                const edEl = editor.editorElement;

                const visibleRowRange = editor.getVisibleRowRange();
                const heightInLines = visibleRowRange[1] - visibleRowRange[0];
                const half = ~~(heightInLines / 2);
                const pos = [loc.start.line - 1, loc.start.column];

                const pixelPosition = edEl.pixelPositionForBufferPosition([pos[0] - half, pos[1]]).top;
                edEl.setScrollTop(pixelPosition);
                editor.setCursorBufferPosition(pos, {autoscroll: false});
            }
        }
        next(action);
    }
}

module.exports = atomMiddleware;
