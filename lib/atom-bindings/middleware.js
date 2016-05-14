"use strict";
// action creators

function RememberPosition(editor) {
    editor = editor || atom.workspace.getActiveTextEditor();

    const pos = editor.getCursorBufferPosition();
    const scrollPos = editor.getVisibleRowRange();
    return {
        type: 'rememberPosition',
        pos: [pos.row, pos.column],
        scrollPos: scrollPos,
        path: editor.getPath()
    }
}

//----------------------------------------------
function atomSetPosition(editor, pos, scrollPos) {
    const edEl = editor.editorElement;
    const presenter = edEl.component.presenter;
    let pixelPosition;
    if (!scrollPos) {
        // workaround of Atom scrolling bug
        // atom/atom#11429, atom/atom#3324
        // (normally we should use scrollToBufferPosition,
        // but it doesn't work in expected way).

        const visibleRowRange = editor.getVisibleRowRange();
        const heightInLines = visibleRowRange[1] - visibleRowRange[0];
        const half = ~~(heightInLines / 2);

        pixelPosition = edEl.pixelPositionForBufferPosition([pos[0] - half, pos[1]]).top;
    } else {
        pixelPosition = edEl.pixelPositionForBufferPosition(scrollPos).top;
    }

    edEl.setScrollTop(pixelPosition);
    presenter.commitPendingScrollTopPosition();

    editor.setCursorBufferPosition(pos, {autoscroll: false});

}
//------------

function atomMiddleware(store) {
    return (next) => (action) => {
        const state = store.getState();
        const editor = atom.workspace.getActiveTextEditor();
        if (action.type == 'goTo') {

            if (editor) {

                const loc = action.loc;
                const pos = [loc.start.line - 1, loc.start.column];
                atomSetPosition(editor, pos, action.scrollPos);
            }
        }
        next(action);
    }
}

module.exports = atomMiddleware;
module.exports.RememberPosition = RememberPosition;
