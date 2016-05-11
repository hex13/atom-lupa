"use strict";
// action creators

function RememberPosition(editor) {
    const pos = editor.getCursorBufferPosition();
    return {
        type: 'rememberPosition',
        pos: [pos.row, pos.column],
        path: editor.getPath()
    }
}

//----------------------------------------------
function atomSetPosition(editor, pos) {
    const edEl = editor.editorElement;

    const visibleRowRange = editor.getVisibleRowRange();
    const heightInLines = visibleRowRange[1] - visibleRowRange[0];
    const half = ~~(heightInLines / 2);

    console.log("DEBUG", pos);
    const pixelPosition = edEl.pixelPositionForBufferPosition([pos[0] - half, pos[1]]).top;
    edEl.setScrollTop(pixelPosition);
    editor.setCursorBufferPosition(pos, {autoscroll: false});

}
//------------

function atomMiddleware(store) {
    return (next) => (action) => {
        const state = store.getState();
        const editor = atom.workspace.getActiveTextEditor();
        if (action.type == 'goTo') {

            if (editor) {
                next(RememberPosition(editor));

                // workaround of Atom scrolling bug
                // atom/atom#11429, atom/atom#3324
                // (normally we should use scrollToBufferPosition,
                // but it doesn't work in expected way).
                const loc = action.loc;
                const pos = [loc.start.line - 1, loc.start.column];
                atomSetPosition(editor, pos);
            }
        }
        if (action.type == 'goToLastPosition') {
            const positions = state.positions || [];
            const lastPos = positions[positions.length - 1];
            if (lastPos) {
                atomSetPosition(editor, lastPos.pos);
            }
        }
        next(action);
    }
}

module.exports = atomMiddleware;
