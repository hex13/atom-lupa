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
function atomSetPosition(editor, pos, scrollPos, preview) {
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
    if (!preview) {
        editor.setCursorBufferPosition(pos, {autoscroll: false});
    }

}
//------------
let lastMarker;
function removeLabelDecoration() {
    if (lastMarker) lastMarker.destroy();
    lastMarker = null;
}
function setLabelDecoration(editor, loc, list, cls) {
    if (lastMarker) lastMarker.destroy();

    var decoration, item, lastPos, marker, pos, range;
    console.log("DECOR", loc);
    pos = [~~loc.start.line - 1, loc.start.column];
    //range = new Range(pos, [~~loc.end.line - 1, loc.end.column]);
    range = [
        [~~loc.start.line - 1, loc.start.column],
        [~~loc.end.line - 1, loc.end.column]
    ];
    marker = editor.markBufferRange(range);
    item = document.createElement('span');
    item.style.position = 'relative';
    item.className = 'my-line-class';
    decoration = editor.decorateMarker(marker, {
        item: item,
        type: 'highlight',
        "class": cls || 'my-line-class'
    });

    lastMarker = marker;

    // if (list) {
    //     return list.push(decoration);
    // }
}

function atomMiddleware(store) {
    return (next) => (action) => {
        const state = store.getState();
        const editor = atom.workspace.getActiveTextEditor();
        const isGoTo = !action.preview && !action.restore;
        if (action.type == 'goTo') {
            const loc = action.loc;
            const pos = [loc.start.line - 1, loc.start.column];

            const sameFile = !action.path || (action.path == editor.getPath());

            if (action.restore) {
                removeLabelDecoration();
            }

            if (sameFile) {
                if (editor) {

                    atomSetPosition(editor, pos, action.scrollPos, !isGoTo);
                    if (isGoTo) {
                        editor.element.focus();
                    }
                    if (action.preview) {
                        setLabelDecoration(editor, loc);
                    }
                }
            } else if (isGoTo){
                atom.workspace.open(action.path, {
                    initialLine: pos[0],
                    initialRow: pos[1],
                })
            }
        }
        next(action);
    }
}

module.exports = atomMiddleware;
module.exports.RememberPosition = RememberPosition;
